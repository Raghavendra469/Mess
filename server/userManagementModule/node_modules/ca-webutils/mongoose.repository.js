const {NotFoundError}= require('./errors');

class MongooseRepository{
    constructor(model){
        this.model=model;
        //console.log('this.model',this.model);
        
    }

    async getAll(matcher={}){
        return await this.model.find(matcher);
    }

    async findAll(matcher={}) {
        return await this.model.find(matcher);
    }

    async getOne(matcher){
        return await this.model.findOne(matcher);
    }

    async findOne(matcher){
        return await this.model.findOne(matcher);
    }

    async create(object){
        let data = new this.model(object);
        return await data.save();
    }

    async getById(id){
        let result = await this.model.findOne({id});
        if(result)
            return result;
        else
            throw new NotFoundError(`No data found for id: ${id}`,{message:'Not Found', id});
    }

    async update(matcher, updater){
        //const existing   = await this.getById(id);
        //let updated = updater(existing);
        return await this.model.updateOne(matcher, updater);

    }

    async remove(id){
        return await this.model.findOneAndRemove({id});
    }    

    async aggregate(pipeline){
        return await this.model.aggregate(pipeline);
    }
}

module.exports=MongooseRepository;