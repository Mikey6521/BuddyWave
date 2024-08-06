import React, { useEffect, useState,useContext } from "react";
import {Link, useHistory} from 'react-router-dom';
import { Redirect } from "react-router-dom";
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signup = () => {
  const {state,dispatch} = useContext(UserContext)
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [profilepic,setProfilepic] = useState("")
  const [url,setUrl] = useState(undefined)
  const history = useHistory()

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])

  const uploadprofilepic = ()=>{
    const data = new FormData()
    data.append("file",profilepic)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","instaclonewebapp")
    fetch('https://api.cloudinary.com/v1_1/instaclonewebapp/image/upload',{
      method:"POST",
      body:data
    })
    .then(res=>res.json())
    .then(data=>{
      setUrl(data.url)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  const uploadFields = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html:"Invalid Email", classes:"#c62828 red darken-3"})
    }
    else{
    fetch("/signup",{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name,
          email,
          password,
          profilepic:url
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
  }

  const PostData = () =>{
    if(profilepic){
       uploadprofilepic()
    }
    else{
      uploadFields()
    }
  }
  
  if(!state)
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder="username" value={name} onChange={(e)=>setName((e.target.value))} ></input>
        <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail((e.target.value))} ></input>
        <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword((e.target.value))}></input>
        <div className="file-field input-field">
        <div className="btn">
          <span>Upload Profile Pic</span>
          <input type="file" onChange={(e)=>setProfilepic((e.target.files[0]))} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
        </div>
        <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={()=>PostData()}>
          Signup
        </button>
        <h6 >
            <Link to="/login">Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
  else
  return(
    <Redirect to="/" />
  );
};

export default Signup;
