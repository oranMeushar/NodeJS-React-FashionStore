const User = require('../model/User');
const catchAsync = require('../middleware/catchAsync');
const sendEmail = require('../util/sendEmail');
const jwt = require('jsonwebtoken');
const AppError = require('../util/AppError');
const crypto = require('crypto');

const getCookieToken = (userId) => {
    const tokenOptions = {
        expiresIn:process.env.JWT_EXPIRE * 60 * 60 * 1000 //2 hours
    }

    const cookieOptions = {
        httpOnly:true,
        maxAge:process.env.COOKIE_EXPIRE * 60 * 60 * 1000,//2 hours
        sameSite:'lax',
    }
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    const token = jwt.sign({userId}, process.env.JWT_SECRET, tokenOptions);

    return{
        token,
        cookieOptions
    }
}

const signup = catchAsync(async (req, res, next)=>{
    //*1)Create user
    await User.init();
    const user = await User.create(req.body);

    //*2)Generate token and send it via cookie.
    const {token, cookieOptions} = getCookieToken(user._id);

    res.cookie('token', token, cookieOptions);
    res.status(201).json({
        status: 'Success',
        message:'User was successfully created',
        data:{
            token
        }   
    })
}); 


const isAuth = catchAsync(async(req, res, next) =>{
    const token = req.cookies.token;
    res.status(200).json({
        status: 'Success',
        token
    })
});

const logout = catchAsync(async(req, res, next) =>{
    
    const options = {
        httpOnly:true,
        maxAge:process.env.COOKIE_EXPIRE * 5 * 1000,
        sameSite:'lax',
    }

    res
    .cookie('token', '', options)
    .status(200)
    .json({
        message:'Successfully logout'
    })
})

const login = catchAsync(async(req, res, next) =>{
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 'Failed', 400))
    }
    const user = await User.findOne({email}).select('+password');
    if (!user || !await user.isEqualsPasswords(password, user.password)) {
        return next(new AppError('Invalid email or password', 'Failed', 400));
    }

    const {token, cookieOptions} = getCookieToken(user._id);
    res
    .cookie('token', token, cookieOptions)
    .status(200)
    .json({
        status: 'Success',
        message:'Successfully logged in',
        data:{
            token
        }  
    });
});


const forgotPassword = catchAsync(async(req, res, next) =>{
    const {email} = req.body;

    if (!email) {
        return next(new AppError('Invalid input. please enter your email', 'Failed', 400));
    }

    const user = await User.findOne({email});

    if (!user) {
        return next(new AppError('User does not exist', 'Failed', 404));
    }

    const resetToken = await user.generateResetToken();
    const resetUrl = `${req.get('Origin')}/resetPassword/${resetToken}`
    try{
        await sendEmail(email, resetUrl); 
        res.status(200).json({
            status:'Success',
            message:'Please check your email for password reset'
        });  
    }
    catch(err){
        realUser.passwordRestToken = undefined;
        realUser.passwordRestExpired = undefined;
        await realUser.save({validateBeforeSave:false});
        return next(new AppError('An error occured while sending the email', 'Failed', 500));//*500=server error
    }
});

const resetPassword = catchAsync(async(req, res, next) =>{
    const resetToken = req.params.resetToken;
    const {password, passwordConfirm} = req.body;
    if (!resetToken) {
        return next(new AppError('Unauthorized', 'Failed', 401));
    }
    const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
        passwordResetToken:hashToken,
        passwordResetExpired:{$gt:Date.now()}
    });
    if (!user) {
        return next(new AppError('Token is invalid or has expired','Failed', 400));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetExpired = undefined;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();
    
    res.status(200).json({
        status: 'Success',
        message:'Password was successfully changed'
    })

})

module.exports.signup = signup;
module.exports.isAuth = isAuth;
module.exports.logout = logout;
module.exports.login = login;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;