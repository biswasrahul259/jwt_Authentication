const express = require("express")
const mongoose = require("mongoose")
const body_parser = require("body-parser")
const app = express();
require("dotenv").config()

app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}))

const userRouter = require("./Route/userRouter")
app.use(userRouter);

const adminRouter = require("./Route/adminRouter")
app.use("/admin",adminRouter) 

const port = process.env.PORT
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(port,()=>{
        console.log((`Db is connected`));
        console.log(`server is running on port no : http://localhost:${port}`);
    })
}).catch((err)=>{
    console.log(err,`somthig went wrong with the server`);
})
