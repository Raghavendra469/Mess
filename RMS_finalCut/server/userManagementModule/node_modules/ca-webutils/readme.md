# ca-webutils


Contains Assorted Functions and subpackages to help create API using Express and Mongoose

Important Modules include

## httpx
* a module for starting http or https server with minimal code

```javascript
const {httpx} = require('ca-webutils');

//launch an http server that always returns 404
//runs on default 80 or a port supplied as last command line argument or in enviornment
httpx.runApp();
```

* we can also run https with express app

```javascript
let app = express();
//express route here
httpx.runApp({
    protocol: 'https',
    requestHandler: app
    intializer: async()=>{
        //database and other app
        //initialization
    }
});
```
---
## expressx

* Adds helpers to improve experience with express framework
* It provides **requestHandler** that automatically
    1. Passes an object containing
        * request
        * response
        * request.params
        * request.body
        * request.user
        * request.tokenError
        * {...request.params}

    2. Returns the response instead of response.send()
    3. Automatically handles errors and converts to specific error code
    
```javascript
//controller
//instead of
const updateUser async( request, response)=>{
    try{
        let id = request.params.id;
        let body = request.body;
        let result = await service.update(id, body);
        response.send(result);
    }catch(error){
        if(error instanceof NotFoundError){
            response.status(404).send(error.errors);
        } else if(error instanceof ValidationError){
            response.status(400).send(error.errors);
        } else{
            response.status(500).send({message:error.message, error});
        }
    }
    
}

//can be written as

const updateUser = ({id, body})=> service.update(id, body);

```

## jwt

* defines jwt library for
    * encoding token
    * decoding token
    * token handler middleware
    * authenticate route middleware
    * authorize route middleware

## Injector

* A dependnecy injection framework
* We can configure the dependencies.

## MongooseRepository

* Common repository for mongoose

## errors
* common errors like
    * NotFoundError
    * AuthenticationError
    * AuthorizationError
    * ValidationError


### Assorted

* asyncrhonous delay function

