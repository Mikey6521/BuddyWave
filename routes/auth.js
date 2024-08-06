const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const {JWT_KEYWORD} = require('../config/keys')
const JWT_KEYWORD = 'secretKey'
const User = mongoose.model('User')
const Otp = mongoose.model('Otp')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const {NODEMAILER_PASS} = require('../config/keys')

router.post('/signup',async (req,res)=>{
    const {name,email,password,profilepic} = req.body;
    if(!email || !password || !name){
       return res.status(422).json({error:"Add all the fields properly"})
    }
    await User.findOne({email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                profilepic
            })
            user.save()
            .then(user=>{
                res.json({message:"user saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })  
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please fill all the fields"})
    }
    await User.findOne({email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(matched=>{
            if(matched){
                //res.json({message:"logged in successfully"})
                console.log("hello")
                const token = jwt.sign({id:savedUser._id},JWT_KEYWORD)
                console.log("hello")
                console.log(token)
                const {_id,name,email,followers,following,profilepic} = savedUser
                console.log("logged in")
                res.json({token,user:{_id,name,email,followers,following,profilepic}})

            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/sendemail',async (req,res)=>{
    const {email} = req.body
    if(!email){
        return res.status(422).json({error:"please fill all the fields"})
    }
    let data = await User.findOne({email})
    if(data){
    let otpcode = Math.floor((Math.random()*10000)+1)
    let otpData = new Otp({
        email:req.body.email,
        code:otpcode,
        expiryIn: new Date().getTime() + 300*1000
    })
    let otpResponse = await otpData.save()
    await mailer(req.body.email,otpcode)
    return res.status(200).json({message:"Otp sent successfully to your email"})
    }
    else{
        return res.status(422).json({error:"User do not exist"})
    }
})

router.post('/resetpassword',async (req,res)=>{
    
    req.body.otp =await parseInt(req.body.otp)
    let data = await Otp.findOne({email:req.body.email,code:req.body.otp})
    if(data){
        let currentTime = new Date().getTime();
        let diff = data.expiryIn - currentTime
        if(diff>0){
            let user = await User.findOne({email:req.body.email})
            user.password = await bcrypt.hash(req.body.password,12)
            user.save();
            return res.status(200).json({message:"Password successfully changed"})
        }
        else{
            return res.status(422).json({error:"Time Limit Exceeded"})
        }
    }
    else{
        return res.status(422).json({error:"Invalid OTP"})
    }
})

router.put('/changepassword',requireLogin,async (req,res)=>{
    let newpassword = await bcrypt.hash(req.body.password,12)
    User.findByIdAndUpdate(req.user._id,{password:newpassword},(err)=>{
        if(err){
            console.log(err)
            return res.json({error:"Try Again, Password is not changed"})
        }
        else{
            return res.json({message:"Password successfully changed"})
        }
    })
})

const mailer = async (email,otp)=>{
    let transporter = nodemailer.createTransport({
        service:'outlook',
        auth:{
            user:'Mujaphar.Shaik@cubastion.com',
            pass: '#Mm556521'
        },
        tls:{
            rejectUnauthorized: false,
        },
    })
    let mailOptions = {
        from:'Mujaphar.Shaik@cubastion.com',
        to:email,
        subject:'OTP for resetting password',
        text:`your OTP for changing password is ${otp}`
    }
    let result = await transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }else{
            console.log('email sent' + info);
        }
    });
}




module.exports = router
