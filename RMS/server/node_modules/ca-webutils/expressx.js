
let express= require('express');
let path= require('path');

const successMap = {
    GET: 200,
    POST: 201,
    PUT: 202,
    PATCH: 202,
    DELETE: 204
}

const errorMap = {
    'NotFoundError': 404,
    'ValidationError': 400,
    'DuplicateError': 400,
    'AuthenticationError': 401,
    'AuthorizationError': 403
    //we may have more errors
}

const addCustomError = (error, statusCode) => errorMap[error] = statusCode;

class Response {
    constructor(body, statusCode, headers = {}) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = headers;
    }
    send(response) {
        response.status(this.statusCode)
        for (let key in this.headers)
            response.set(key, headers[key]);
        response.send(this.body)
    }
}

class ResponseError extends Error {
    constructor(message, status, error={}, header) {
        super(message);
        
        if(!error.message)
            error.message=message;
        this.response = new Response(error, status, header);
    }

    send(response) {
        this.response.send(response);
    }
}


function routeHandler(controllerFunction) {

    //this function will handle the response.
    return async (request, response, next) => {
        try {
            let controllerParam = {
                request,
                response,
                next,
                path: request.path,
                url: request.url,
                params: request.params,
                body: request.body,
                query: request.query,
                user:request.user,
                tokenError:request.tokenError,
                token:request.token,
                ...request.params
            }
            let result = await controllerFunction(controllerParam);
            if (!result && request.method === 'GET')
                throw new NotFoundError('Not Found', { message: 'Not Found', url: request.path, params: request.params, query: request.query })
            if (result instanceof Response) {
                return result.send(response);
            }
            let status = successMap[request.method];
            return response.status(status).send(result);

        } catch (error) {
            // let status = errorMap[error.constructor.name] || 500;
            // response.status(status);
            // let body = error.errors || { message: error.message, status, errors: error }
            // response.send(body);
            errorHandler(error,request,response,next);

        }
    }
}




function jsonBody(request, response, next) {

    if (['get', 'delete'].includes(request.method.toLowerCase())) {
        //console.log('Not a body request');
        return next();
    }



    if (!request.get('Content-Type').includes('/json')) {
        //console.log('Not a JSON request');
        return next(); //skip 
    }

    //console.log('parsing json body');
    let body = "";
    request
        .on('data', buffer => body += buffer.toString())
        .on('end', () => {
            try {
                //console.log('body',body);

                request.body = JSON.parse(body);

                //console.log('request.body',request.body);

            } catch (e) {
                //body can't be parsed.
                //It is optional to have a JSON body
                //so we will ignore this error.
                //console.log('invalid json',body);

            }
            next();
        });
}

function logRequestInfo(request, response, next) {
    console.log(`${request.method} ${request.path}`);
    console.log('request.path', request.path);
    console.log('request.params', request.params);
    console.log('request.query', request.query);
    console.log('request.body', request.body);
    console.log();


    next();

}

function getHttpError(error){

    let status=500; //default
    if(errorMap[error.constructor.name]){
        status=errorMap[error.constructor.name];
    }else{
        for(let message in errorMap){
            if(error.message.includes(message)){
                status=errorMap[message];
                break;
            }
        }
    }

    let body = error.errors || { message: error.message, status, errors: error }
    if(!body.message)
        body.message=error.message;
    
    return new ResponseError(error.message, status, body);
}

const errorHandler = (error, request, response, next) => {
    // let status = errorMap[error.constructor.name] || 500;
    // response.status(status);
    // let body = error.errors || { message: error.message, status, errors: error }
    // response.send(body);

    if(!(error instanceof ResponseError))
        error=getHttpError(error);

    error.send(response);

}

async function createApiApp( options={}){

    options={staticPath:"public", routeBuilder: app=>{}, ...options};

    let app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    if(options.staticPath){
        app.use(express.static(path.join(process.cwd(),options.staticPath)));
    }
    options.routeBuilder(app);

    app.use(errorHandler);

    return app;

}



module.exports = {
    jsonBody: jsonBody,
    logRequestInfo,
    errorHandler,
    addCustomError,
    routeHandler,
    Response,
    createApiApp,
};
