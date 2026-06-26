const mongoose = require('mongoose')

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_DB)
        console.log("Database connection successfuly...")
        
    }catch(err){
        console.log(err)
        console.log("Database connection error")
    }
}
module.exports=connectDB