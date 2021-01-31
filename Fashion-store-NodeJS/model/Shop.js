const mongoose = require('mongoose');


const options = {
    optimisticConcurrency:true,
    selectPopulatedPaths:false,
}

const shopsSchema = new mongoose.Schema({
    category:{
        type:'string',
        required:[true, 'Please provide a valid category'],
        enum:['hats', 'jackets', 'men', 'sneakers', 'women']
    },
    name:{
        type:'string',
        required:[true, 'Please provide name'],
    },
    imageUrl:{
        type:'string',
        required:[true, 'Please provide an imageUrl'],
    },
    price:{
        type:'number',
        required:[true, 'Please provide price'],
    }

}, options);

const Shop = mongoose.model('Shop', shopsSchema);

module.exports = Shop;