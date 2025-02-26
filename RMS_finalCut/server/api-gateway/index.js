const express = require('express');
const cors = require('cors');
const {createProxyMiddleware}=require('http-proxy-middleware')
const path=require('path');
const fs=require('fs');
const https = require('https');



let basePath=path.join(process.cwd())
 
let sslOption = {
    key: fs.readFileSync(path.join(basePath, 'key.pem')),
    cert: fs.readFileSync(path.join(basePath, 'cert.pem')),
    passphrase:'password'
}





const app = express();

app.use('/api/auth', createProxyMiddleware({ target: "https://localhost:5001", changeOrigin: true, secure: false }));
app.use("/api/songs", createProxyMiddleware({ target: "https://localhost:5002", changeOrigin: true, secure: false }));
app.use("/api/royalty", createProxyMiddleware({ target: "https://localhost:5003", changeOrigin: true, secure: false }));
app.use("/api/transactions", createProxyMiddleware({ target: "https://localhost:5003", changeOrigin: true, secure: false }));
app.use("/api/collaborations", createProxyMiddleware({ target: "https://localhost:5004", changeOrigin: true, secure: false }));
app.use("/api/notifications", createProxyMiddleware({ target: "https://localhost:5004", changeOrigin: true, secure: false }));
app.use("/api/users", createProxyMiddleware({ target: "https://localhost:5005", changeOrigin: true, secure: false }));








https.createServer(sslOption, app).listen(3000,()=>{
    console.log('API Gateway running securely on https://localhost:3000');
});



