const mongoose = require('mongoose');


const items = new mongoose.Schema({
    name:{
        type: 'string',
        required: [true, 'Each item should have a name'],
        minLength:[2, 'The minimum length of a title is 2 characters'],
        maxLength:[20, 'The maximum length of a title is 20 characters']
    },
    imageUrl:{
        type:'string',
        required:[true, 'Please provide an imageUrl'],
    },
    price:{
        type: 'number',
        required: [true, 'Item price is required'],
        min:5,
        max:5000
    },
    quantity:{
        type: 'number',
        required: [true, 'Item quantity is required'],
        min:1
    }
});

const ordersOptions = {
    optimisticConcurrency:true,
    selectPopulatedPaths:false,
}

const ordersSchema = new mongoose.Schema({
    items:{
        type:[items],
        required: true
    },
    totalItems:{
        type:'number',
        required:[true, 'Total items is required']
    },
    totalPrice:{
        type:'number',
        required:[true, 'Total price is required']
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:'string',
    }
},ordersOptions);


ordersSchema.pre('save', function(next){
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let hour = '' + date.getHours();
    let minute = '' + date.getMinutes();

    if (day.length < 2) {
        day = '0' + day
    }
    if (month.length < 2){
        month = '0' + month;
    }

    if (hour.length < 2){
        hour = '0' + hour;
    }
    if (minute.length < 2){
        minute = '0' + minute;
    }
    const createdAt =`${day}/${month}/${date.getFullYear()} at ${hour}:${minute}`
    this.createdAt = createdAt;
    next();
})

const Order = mongoose.model('Order', ordersSchema);

module.exports = Order;