require('dotenv').config()
const http=require('http');
const https=require('https');
const fs = require('fs');
const path=require('path');



const protocolMap={
    http: { port:80, factory: (requestHandler)=>{
        return http.createServer(requestHandler);
    }},

    https: { port:443, factory: (requestHandler)=>{
        let certificatePath= process.env.HTTPS_CERTIFICATE_PATH || '';
        let passphrase = process.env.HTTPS_CERTIFICATE_PASSPHRASE;
        let key= fs.readFileSync( path.join(process.cwd(), certificatePath, 'key.pem'));
        let cert= fs.readFileSync(path.join(process.cwd(), certificatePath, 'cert.pem'));
        let options = { key, cert, passphrase}; 
        return https.createServer(options, requestHandler);
    }}
}




function defaultRequestHandler(request,response){
    response.statusCode = 404;
    let data ={
        error: 'Page not found',
        url: request.url,
        status:404
    }
    response.writeHead(404);
    response.end(JSON.stringify(data));
}


function startServer(server,options) {
    let port = process.argv.length>2 ?  //if arguments are supplied 
                    process.argv[process.argv.length - 1]  //port is last argument
                    : //else
                    (process.env.PORT || protocolMap[options.protocol].port) //use environment variable or default 5000
    port = Number(port); //make port a number;

    //console.log('port',port);
    
    
    return new Promise((resolve,reject)=>{
        server.on('error', reject);
        server.listen(port,()=>resolve(`${options.protocol}://localhost:${port}`));

    });

}

async function runApp( options={} ){

    const defaultOptions = {protocol:'http', requestHandler: defaultRequestHandler, initializer: async()=>{}};
    options = {...defaultOptions,...options};
    
    let info = protocolMap[options.protocol];
    if(!info)
        throw new Error(`Unsupported protocol ${options.protocol}`);

    const server = info.factory(options.requestHandler);
    try{
        await options.initializer();
        let url=await startServer(server, options);
        console.log(`Server started at ${url}`);
    }catch(e){options
        console.error('Error starting server',e.message);
        process.exit(1); //failure.
    }

}

module.exports ={runApp};