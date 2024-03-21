export class apiFeatures{

    constructor(mongooseQuery,queryString){
        this.mongooseQuery= mongooseQuery;
        this.queryString = queryString
    }

    // 1-pagination................................................
    paginate(){
        let PAGE_LIMIT=10
        let PAGE_NUMBER=this.queryString.page * 1 || 1
        if(this.queryString.PAGE_NUMBER<=0) PAGE_NUMBER= 1
        let SKIP =(PAGE_NUMBER - 1) * PAGE_LIMIT
        this.PAGE_LIMIT=PAGE_LIMIT
        this.PAGE_NUMBER=PAGE_NUMBER
        this.mongooseQuery.skip(SKIP).limit(PAGE_LIMIT)
        return this;
    }

    // 2-filter....................................................
    filter(){
        let filterObj={...this.queryString}
    let excludedQuery=['page','sort','fields','search']
    excludedQuery.forEach((q)=>{
        delete filterObj[q]
    })
    filterObj=JSON.stringify(filterObj)
    filterObj=filterObj.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,match=>`$${match}`)
    filterObj=JSON.parse(filterObj)
    this.mongooseQuery.find(filterObj)
    return this;
    }

    // 3-sort......................................................
    sort(){
        if(this.queryString.sort){
            let sortedBy=this.queryString.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
    
        }
        return this;
    }

    // 4-search.....................................................
    search(){
        if(this.queryString.search){
            this.mongooseQuery.find({
                $or:
                [
                    {title:{$regex:this.queryString.search,$options:'i'}},
                    {description:{$regex:this.queryString.search,$options:'i'}},
                    {email:{$regex:this.queryString.search,$options:'i'}},
                    {userName:{$regex:this.queryString.search,$options:'i'}},
                    {status:{$regex:this.queryString.search,$options:'i'}},
                ]
            })
        }
        return this
    }

    // 5- selected fields...........................................
    fields(){
        if(this.queryString.fields){
            let fields=this.queryString.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
    
        }
        return this
    }

}