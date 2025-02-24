
const delay = require('./delay');
const expressx = require('./expressx');
const httpx = require('./httpx');
const injector = require('./injector')
const errors=require('./errors');
const MongooseRepository = require('./mongoose.repository');
const jwt = require('./jwt');



module.exports={
    delay,
    expressx,
    httpx,
    injector,
    errors,
    MongooseRepository,
    jwt,
    version:'1.7.1',
}


