const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path=require('path');
const fs=require('fs');
const https = require('https');

dotenv.config();

let basePath=path.join(process.cwd())
 
let sslOption = {
    key: fs.readFileSync(path.join(basePath, 'key.pem')),
    cert: fs.readFileSync(path.join(basePath, 'cert.pem')),
    passphrase:'password'
}


const royaltyRoutes = require('./routes/royaltyRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js');


const connectToDatabase = () => {
    try {

        mongoose.connect(process.env.MONGODB_URL)
        console.log("Connnected to MongoDB");

    }
    catch (error) {
        console.log(error)
    }
}
const app = express();
const server = https.createServer(sslOption, app);
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/royalty', royaltyRoutes);
app.use('/api/transactions', transactionRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
async function startServer(){
    try{
        await connectToDatabase();
        server.listen(PORT, () => {
            console.log(`Server is running on port https://localhost:${PORT}`);
        });
    }catch(err)
    {
        console.error('Error starting the server')
    }

}
startServer();
