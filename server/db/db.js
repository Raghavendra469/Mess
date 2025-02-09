const mongoose =require("mongoose");
const dotenv =require('dotenv');
dotenv.config();

const connectToDatabase = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected")
    }
    catch(error){
        console.log(error)
    }
}

module.exports={connectToDatabase}