const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const options = {
    optimisticConcurrency:true,
    timestamps:true,
    selectPopulatedPaths:false,
}

const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required:[true, 'Please provide a userName'],
        minlength:[2, 'name must be of at least two charcters'],
        maxlength:[30, 'name must not exeeds more than 30 characters']
    },
    email:{
        type: 'string',
        unique:[true, 'Email already exists'],
        required:[true, 'Please provide an email address'],
        validate:[validateEmail, 'Incorrect email address']
    },
    password:{
        type: 'string',
        required:[true, 'Please provide a password'],
        minLength:[6,'password must be at least 6 characters'],
        maxLength:[30,'password must not exceed 30 characters'],
        select:false
    },
    passwordConfirm:{
        type: 'string',
        required:[true, 'Please provide a password'],
        minLength:[6,'password must be at least 6 characters'],
        maxLength:[30,'password must not exceed 30 characters'],
        validate:[isEqualsPasswords, 'Passwords are not matched']
    }, 
    passwordChangedAt:{
        type:Date
    },
    passwordResetToken:{
        type:'string'
    },
    passwordResetExpired:{
        type:Date
    }
}, options);


//*1)check if password was not changed or if it is a new password
//*2)if so, hash the password and remove passwordConfirm from database
//*3)else, return next
userSchema.pre('save', async function(next){ 
    if (this.isModified('password')) {
       const hashPassword = await bcrypt.hash(this.password, 12);
       this.password = hashPassword; 
       this.passwordConfirm = undefined;
       return next();
    }
    next();
})

userSchema.methods.isEqualsPasswords = async function(password, hashPassword){
    return await bcrypt.compare(password, hashPassword);
}

userSchema.methods.generateResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpired = Date.now() + 15 * 60 * 1000 //15 minutes
    await this.save({validateBeforeSave:false});
    return resetToken;
}


function validateEmail(email){
    return validator.isEmail(email)
}

function isEqualsPasswords(passwordConfirm){
    return passwordConfirm === this.password;
}

const User = mongoose.model('User', userSchema);
module.exports = User;