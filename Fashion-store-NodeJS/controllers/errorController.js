const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error:err,
        stack:err.stack
    })
}

const sendErrorProduction = (err, res)=>{
    let message = err.isOperational ? err.message
    :'Something went wrong. please try again later';

    res.status(err.statusCode).json({
        status:err.status,
        message,
        error:err
    });
}

const handleCastError = (error)=>{
    const message = `Invalid value <${error.value}> for ${error.path}`;
    return message;
}

const handleValidationError = (error) =>{
    const messages = Object.values(error.errors).map((error) =>{
        return error.message
    })
    return messages.join('. ');
}

const handleDuplicateField = (error)=>{
    const key = Object.keys(error.keyValue)[0];
    const value = Object.values(error.keyValue)[0];
    const message = `Duplicate field value<${key} = ${value}>. Please try again`;
    return message;
}

const error = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Server error';

    if (process.env.NODE_ENV =='development') {  
        sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV =='production') {
        let error = {...err};

        if (error.name == 'CastError') {
            error.message = handleCastError(error);
        }
        if (error.name == 'ValidationError') {
            error.message = handleValidationError(error);
        }
        if (error.code == '11000') {
            error.message = handleDuplicateField(error);
        }
        sendErrorProduction(error, res)
    }
}

module.exports = error;