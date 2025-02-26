//injector container
// let container={
//     authorRepository: {
//             serviceClass: JsonAuthorRepository,  //class
//             serviceInstance:null   //object of the class
//         },
//         bookRepository: {
//             serviceClass: JsonBookRepository, 
//             serviceInstance:null
//         },
//         visitCounter: {
//             serviceClass: VisitCounter, 
//             serviceInstance:null
//         }
//     }
// }


class Injector{
    constructor(){
        this.container = {

        };
    }
    addService(serviceKey, serviceClass){
        this.container[serviceKey] = {serviceClass, 
            serviceInstance:null  //object not yet created.
        };

        return this;
    }
    
    addServiceObject(serviceKey, serviceInstance){
        this.container[serviceKey]={serviceInstance:serviceInstance}
        return this;
    }

    getService(serviceKey) {
        
        //console.log('service requested', serviceKey);

        let serviceInfo = this.container[serviceKey];
        if(!serviceInfo)
            throw new Error(`No service found with key ${serviceKey}`);

        if(serviceInfo.serviceInstance){ //object is already created
           // console.log('returning existing service ', serviceInfo.serviceInstance.constructor.name)
            return serviceInfo.serviceInstance;
        }
        else{
            //console.log(`creating service ${serviceKey} : ${serviceInfo.serviceClass.name}`)
            let instance = this._createInstance(serviceInfo); //create object
            serviceInfo.serviceInstance = instance; //safe for next request
            //console.log();
            return instance; //return the object.
        }

    }

    _createInstance({serviceClass}){
        if(!serviceClass._dependencies){ //if defpendency is not defined
            console.log('No dependencies found for ',serviceClass.name);
            return new serviceClass(); 
        } //create normal object

        //since we have dependencies, lets find them.
        let args = [];
        //console.log('resolving dependencies ', serviceClass._dependencies);
        for(let serviceName of serviceClass._dependencies) {
            args.push( this.getService(serviceName))
        }

        return new serviceClass(...args);
    }
}


module.exports=new Injector();