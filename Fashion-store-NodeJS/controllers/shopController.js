const catchAsync = require('../middleware/catchAsync');
const validator = require('validator');
const AppError = require('../util/AppError');

const getCollections = catchAsync(async(req, res, next) =>{
    res.status(200).json({
        status:'Success',
        count:req.data.length,
        pagination:req.pagination,
        data:{
            data:req.data
        }
    })
});


const getCollection = catchAsync(async(req, res, next) =>{
    res.status(200).json({
        status:'Success',
        count:req.data.length,
        pagination:req.pagination,
        data:{
            collection:req.data
        }
    })
});

const contactUs = catchAsync(async(req, res, next) =>{
    const fullName = validator.trim(req.body.fullName);
    const email = validator.isEmail(req.body.email);
    const message = validator.trim(req.body.message);

    if (!fullName || !email || !message) {
        return next(new AppError('one of the required fields is missing or invalid', 'Failed', 400))
    } 
    res.status(200).json({
        status:'Success',
        message:'Message was successfully received'
    });  
})

module.exports.getCollections = getCollections;
module.exports.getCollection = getCollection;
module.exports.contactUs = contactUs;