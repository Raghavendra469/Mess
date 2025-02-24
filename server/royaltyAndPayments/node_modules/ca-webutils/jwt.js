let jwt = require('jsonwebtoken');
let { AuthenticationError } = require('./errors');
let expiry = Number(process.JWT_EXPIRY || 60 * 60)

//typcial jwt payload

async function createToken(data, key, options = {}, claimsRequested ) {
    
    const defaultPayload = {
        iss: process.env.JWT_ISSUER,
        //sub: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiry 
    };

    let commonPayloadKey=['sub','aud']
    let commonPayload={};
    let payload = data;

    for(let key in data){
        if(commonPayloadKey.includes(key)){
            commonPayload[key] = data[key];
            delete data[key]
        }
    }

    if(claimsRequested && claimsRequested instanceof Array) {
        payload={};
        for (let claim of claimsRequested) {
            if (data[claim]){
                payload[claim] = data[claim];
            }                
        }
    }

    data = { ...defaultPayload, claims: payload, ...commonPayload } //this data should be encrypted and bundeled

    key = key || process.env.JWT_SECRET

    // console.log('key',key);
    // console.log('options',options);



    return jwt.sign(data, key, options);
}

async function decode(token, key, options = {}) {
    key = key || process.env.JWT_SECRET
    return new Promise((resolve, reject) => {

        jwt.verify(token, key, options, (error, data) => {
            if (error) {
                return reject(error)
            } else {

                return resolve(data)
            }
        })
    });

}


const decodeTokenMiddleware = (key, options = {}) => async (request, response, next) => {
    key = key || process.env.JWT_SECRET
    try {
        let authorization = request.headers.authorization
        if (!authorization)
            throw new AuthenticationError("No Authorization Header")
        let token = authorization.split(' ')[1]
        if (!token)
            throw new AuthenticationError("No BEARER Token Found")

        let data = await decode(token, key, options);
        //success
        request.token= data;
        request.user = data.claims;

    } catch (error) {
        if (!(error instanceof AuthenticationError))
            error = new AuthenticationError(error.message, error);
        //error
        request.tokenError = error;
    }

    next(); //in both case we go to next middleware.
}

const authenticate = (request, response, next) => {

    if (request.tokenError) {
        return response.status(401).json({ message: "Not Autehnticated", error: request.tokenError })

    }
    next();
}

const authorize = (...expectedRoles) => (request, response, next) => {
    if (request.tokenError) {
        return response.status(401).json({ message: "Not Autehnticated", error: request.tokenError })
    }

    let userRoles = request.user.roles || [];

    //expected roles should include one of user roles
    for (let expectedRole of expectedRoles) {
        expectedRole.toLowerCase();
        let userRole = userRoles.find(role => role.toLowerCase() === expectedRole);
        if (userRole) {
            return next();
        }
    }

    //no match found.

    response.status(403).send({ message: "You are not Authorized", expectedRoles });

}






module.exports = {
    createToken,
    decode,
    decodeTokenMiddleware,
    tokenDecorder: decodeTokenMiddleware,
    authenticate,
    authorize
}