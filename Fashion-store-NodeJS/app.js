const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

dotenv.config({
    path:'./config/config.env'
});

const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');
const ordersRoute = require('./routes/orders');

const errorController = require('./controllers/errorController');

const allowCors = require('./middleware/cors');
const app = express();

 const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30   minutes window
    max: 600 
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes window
    max: 50
});

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 30, 
    message:"Too many accounts created from this IP, please try again after an hour"  
});

app.use(limiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/forgotPassword', authLimiter);
app.use('/api/v1/auth/signup', createAccountLimiter);

app.use(bodyParser.json({
    limit:'50kb'
}));
app.use(helmet());
app.use(allowCors());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/shop', shopRoute);
app.use('/api/v1/orders', ordersRoute);

app.use(errorController);

//*Connect to database
(async()=>{
    const options = {
         useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex:true,
        useFindAndModify:false,
        poolSize:10,
        serverSelectionTimeoutMS:10000,
        socketTimeoutMS:45000 
    }

    try {
        await mongoose.connect(process.env.CONNECT_ATLAS, options);
        console.log('successfully connected to database');
    } catch(err){
        console.log(err);
    }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server starts on port 5000');
})

