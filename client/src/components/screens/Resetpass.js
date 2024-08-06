import React, { useState,useContext } from "react";
import { useHistory } from "react-router-dom";
import {UserContext} from '../../App'
import { Redirect } from "react-router-dom";
import M from 'materialize-css'


const Resetpass = () => {
  const {state,dispatch} = useContext(UserContext)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [otp,setOtp] = useState("")
  const [otpform,setOtpform] = useState("")
  const history = useHistory()
  const PostData = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html:"Invalid Email", classes:"#c62828 red darken-3"})
    }
    else{
    fetch("/sendemail",{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          email
        })
    })
    .then(res=>(
      res.json()))
    .then(data=>{
      if(data.error){
        M.toast({html: data.error, classes:"#c62828 red darken-3"})
      }
      else{

        M.toast({html:data.message,classes:"#2e7d32 green darken-3"})
        
        setOtpform(true);
      }
    })
    .catch(err=>{
      console.log(err)
    })
    }
  }

  const changePassword = ()=>{
    fetch("/resetpassword",{
      method:"post",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        email,
        password,
        otp
      })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.error){
      M.toast({html: data.error, classes:"#c62828 red darken-3"})
    }
    else{
      M.toast({html:data.message,classes:"#2e7d32 green darken-3"})
      history.push('/login')
    }
  })
  .catch(err=>{
    console.log(err)
  })
  }

  if(!state)
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        {!otpform ?
        <><input type="text" placeholder="email" value={email} onChange={(e)=>setEmail((e.target.value))} ></input>
        <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=>PostData()}> Send OTP </button></>
        :<>
        <input type="text" placeholder="OTP" value={otp} onChange={(e)=>setOtp((e.target.value))}></input>
        <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword((e.target.value))}></input>
        <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=>changePassword()}> Change Password </button></>
      }
      </div>
    </div>
  );
  else
  return(
    <Redirect to="/" />
  );
};

export default Resetpass;
