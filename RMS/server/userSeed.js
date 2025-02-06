const User = require ('./models/managerModel.js')
const bcrypt = require ('bcrypt')
const connectToDatabase = require ('./db/db.js')

const userRegister = async ()=>{
    connectToDatabase()

    try{ 
        const hashPassword = await bcrypt.hash("manager",12)
        const newUser = new User({
            
            name: "manager",
            email: "manager@gmail.com",
            password: hashPassword,
            role: "manager"
        })

        await newUser.save()
    }catch(error){
        console.log(error)
    }
}

userRegister();