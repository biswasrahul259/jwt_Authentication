const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    token: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createOn:{
        type: Date,
        default:new Date()
    },
    updateOn:{
        type: Date,
        default:new Date()
    }
})

const adminModel = mongoose.model("admin",Schema)
module.exports = adminModel ;