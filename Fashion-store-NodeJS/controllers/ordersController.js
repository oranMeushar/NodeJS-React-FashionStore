const AppError = require('../util/AppError');
const Order = require('../model/Orders');
const catchAsync = require('../middleware/catchAsync');


const getOrders = catchAsync(async(req, res, next) => {
    const data = await Order.find().select('-__v');
    res.status(200).json({
        status:'Success',
        data
        
    })
});

const getOrder = catchAsync(async(req, res, next) => {
    const orderId = req.params.orderId;
    if (!orderId) {
        return next(new AppError('Order id was not specified', 'Failed', 400));
    }
    const data = await Order.findById(orderId).select('-__v');

    if (!data) {
        return next(new AppError('Order was not found', 'Failed', 404));
    }
    res.status(200).json({
        status:'Success',
        data
        
    })
});

const postOrder = catchAsync(async(req, res, next) => {
    const order = await Order.create(req.body);
    res.status(200).json({
        status:'Success',
        order
        
    })
});

const deleteOrder = catchAsync(async(req, res, next) => {
    const orderId = req.params.orderId;
    await Order.findByIdAndDelete(orderId);
    res.status(204).json({})
});

module.exports.getOrders = getOrders;
module.exports.getOrder = getOrder;
module.exports.postOrder = postOrder;
module.exports.deleteOrder = deleteOrder;

