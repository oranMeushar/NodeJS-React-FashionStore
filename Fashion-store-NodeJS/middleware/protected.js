const catchAsync = require('./catchAsync');
const AppError = require('../util/AppError');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../model/User');

const protected = catchAsync(async(req, res, next) => {

    
    //*check if token was sent via cookie
    const token = req.cookies.token;
    if (!token) {
        return next(new AppError('Please login to get access', 'Failed', 401));
    }
    
    //*validate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded) {
        return next(new AppError('Not authenticated', 'Failed', 401));
    }

    //*Check if user stil exists
    const user = await User.findOne({_id:decoded.userId})
    if (!user) {
        return next(new AppError('User with this token is no longer exists', 'Failed', 401));    
    }

    req.user = user
    next();
});


module.exports = protected;