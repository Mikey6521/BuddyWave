const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    expiryIn:{
        type:Number,
        required:true
    }
});

mongoose.model("Otp",otpSchema)