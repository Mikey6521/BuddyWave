const jwt = require('jsonwebtoken')
// const {JWT_KEYWORD} = require('../config/keys')
const JWT_KEYWORD = "secretKey"
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"youre not logged in"})    
    }
    const token = authorization.replace("Bearer ","")
    // console.log(token);
    jwt.verify(token,JWT_KEYWORD,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }

        const {id} = payload
        User.findById(id)
        .then(userdata=>{
            req.user = userdata;
            next();
        })
    })
} 