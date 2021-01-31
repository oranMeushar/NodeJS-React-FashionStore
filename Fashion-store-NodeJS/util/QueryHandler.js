class QueryHandler{
    constructor(model, reqQuery, reqParams){
        this.model = model;
        this.reqQuery = {...reqQuery};
        this.query = {...reqQuery};
        this.limit = 8;
        this.page = 1;
        this.sort = 'createdAt';
        this.select = null;
        this.reqParams = reqParams;
        if (reqParams) {
            this.query.category = reqParams.category;
        }
    }

    async getData(){
        const removeFields = ['sort', 'page', 'limit', 'fields'];
        const docsCount = await this.model.countDocuments(this.reqParams);

        removeFields.forEach(item =>{
            if(this.query[item]){
                delete this.query[item];
            }
        });

        this.query = JSON.stringify(this.query);

        this.query = this.query.replace(/\b(gt|gte|lt|lte)\b/g, (match) =>{
            return `$${match}`;
        });

        this.query = JSON.parse(this.query);

        //*Find the desired Query
        let dataQuery = this.model.find(this.query);

        //*Allow sort
        if (this.reqQuery.sort) {
            let {sort} = this.reqQuery;
            sort = sort.replace(/,/g, (match) =>{
                return ` `;
            }); 
            this.sort = sort;
        }

        //*Allow limit
        if(this.reqQuery.limit){
            this.limit = parseInt(this.reqQuery.limit) || 8;
        }

        //*Allow page selection
        const totalPages = Math.ceil(docsCount / this.limit);
        if (this.reqQuery.page) {
            this.page = parseInt(this.reqQuery.page) || 1;
            if(this.page > totalPages){
                this.page = totalPages;
            }
        }

        //*Select specific fields
        if(this.reqQuery.fields){
            let {fields} = this.reqQuery;
            fields = fields.replace(/,/g, (match) =>{
                return ` `;
            }); 
            this.select = '-_id' + ' ' + fields
        }

        return await dataQuery
        .sort(this.sort)
        .skip((this.page-1) * this.limit)
        .limit(this.limit)
        .select(this.select)
        .lean();
    }

    async getPagination(){
        const totalPages = Math.ceil(await this.model.countDocuments(this.reqParams) / this.limit);
        let pagination = {
            totalPages,
            currentPage:this.page,
        };

        if(this.page < totalPages){
            pagination.nextPage = this.page + 1;
        }

        if(this.page > 1){
            pagination.prevPage = this.page - 1;
        }
        return pagination;
    }
}

module.exports = QueryHandler;