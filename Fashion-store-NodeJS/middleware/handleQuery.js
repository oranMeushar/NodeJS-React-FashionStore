const catchAsync = require('./catchAsync');
const QueryHandler = require('../util/QueryHandler');

const handleQuery = (model) =>{
    return catchAsync(async(req, res, next) =>{
        const queryHandler = new QueryHandler(model, req.query, req.params);
        req.data = await queryHandler.getData();
        req.pagination = await queryHandler.getPagination();
        next();
    })
}

module.exports = handleQuery;