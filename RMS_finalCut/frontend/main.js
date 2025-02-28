import express from 'express';
import path from 'path';
 
let app = express();
const staticPath = path.join(path.join(process.cwd(),'dist'));
app.use(express.static(staticPath));
app.get('*',(request,response)=>{
    response.sendFile(path.join(path.join(process.cwd(),'dist')))
})
 
app.listen(80,()=>console.log("server is started on : http://18.204.221.88:80"));