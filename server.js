const app = require('./src/app')
const env = require('dotenv').config()
const connectDB = require('./src/database/db')

app.listen(8000,()=>{
    connectDB()
    console.log("express server satrt at port 8000")
})

