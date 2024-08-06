import React, { useEffect, useState,useContext } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'


const Profile = ()=>{
    
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [profilepic,setProfilepic] = useState("")
    const [password,setPassword] = useState("")
    const [loading ,setLoading] = useState(false);
    
    useEffect(()=>{
        M.AutoInit();
    },[])

    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setPics(result.myposts)
        })
    },[])

    useEffect(()=>{
        if (profilepic) {
            setLoading(true);
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
                fetch('/updatepic',{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem('jwt')
                    },
                    body:JSON.stringify({
                        profilepic:data.url
                    })
                })
                .then(res=>res.json())
                .then(result=>{
                    
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,profilepic:result.profilepic}))
                    dispatch({type:"UPDATEPIC",payload:result.profilepic});
                    const modal3 = document.getElementById("modal3");
                    var instance = M.Modal.getInstance(modal3);
                    setLoading(false);
                    instance.close();

                    
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }   
    },[profilepic])

    const updateProfilepic = (file)=>{
        setProfilepic(file);
        
    }
    const updatePassword = (password)=>{
        fetch('/changepassword',{
            method:'put',
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                _id:state._id,
                password
            })
          }).then(res=>res.json())
          .then(data=>{
              if(data.error){
              M.toast({html: data.error, classes:"#c62828 red darken-3"})
              }
              else{
                M.toast({html:data.message,classes:"#2e7d32 green darken-3"})
              }
          }).catch(err=>{
            console.log(err)
          })
    }
    // const openPost = (item)=>{ 
    //     setPostData(item)
    //     const modal4 = document.getElementById("modal4");
    //     var instance = M.Modal.getInstance(modal4);
    //     instance.open();
    // }
    
    return(
        <div style={{maxWidth:"600px",margin:"0px auto"}}>
            <div style={{display:"flex",justifyContent:"space-around",marginTop:"20px",borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={state?state.profilepic:"loading"}/>
                </div>
                <div>
                    
                    <h4>{state?state.name:"Loading"}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                        <h6> { mypics.length } posts</h6>
                        <h6>{state?state.followers.length:"Loading"} followers</h6>
                        <h6>{state?state.following.length:"Loading"} following</h6> 
                    </div>
                    <div>
                    <a class='dropdown-trigger btn'  data-target='dropdown1'>Options</a>
                    <ul id='dropdown1' class='dropdown-content'>
                    <li>  <a data-target="modal2" class=" modal-trigger">Change Password</a></li>
                    <li class="divider" tabindex="-1"></li>
                    <li><a data-target="modal3" class=" modal-trigger">Update Profile Pic</a></li>
                    </ul>
                    </div>
                    
                </div>
            </div>
            <div className='gallery' style={{}}>
                {
                    mypics.map(item=>{
                        return(
                            <img style={{cursor:"pointer"}}  role="button" key={item._id} className='item' src={item.photo}/>
                        )
                    })
                }
                
            </div>
            <div id="modal2" className="modal">
                <div className="modal-content" style={{ color: "black" }}>
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword((e.target.value))}></input>
                    <button class="modal-close" onClick={()=>updatePassword(password)}>Submit</button>
                </div>
                <div class="modal-footer">
                    <button class="modal-close waves-effect waves-green btn-flat" onClick={() => {setPassword('')}}>Close</button>
                </div>
            </div>
            <div id="modal3" className="modal">
                <div className="modal-content" style={{ color: "black" }}>
                    <input type="file" onChange={(e)=>updateProfilepic((e.target.files[0]))} />
                </div>
                <div>
                    {loading && <h4 style={{fontSize:"16px" , color:"green",textAlign:"center"}}>Uploading ...</h4>}
                </div>
                <div class="modal-footer">
                    <button class="modal-close waves-effect waves-green btn-flat" onClick={() => {setProfilepic('')}}>Close</button>
                </div>
            </div>
            {/* <div id="modal5" className="modal">
                <div className="modal-content" style={{ color: "black" }}>
                    <div>
                        <ul className="collection">
                            {state.followers.map(item => {
                                return <a href={(item._id === state._id ? '/profile' : ('/profile/' + item._id))} className="collection-item" onClick={() => { }}>{item.name}</a>
                            })}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-close waves-effect waves-green btn-flat">Close</button>
                </div>
            </div> */}
            {/* <div id="modal4" className="modal" >
                <div className="modal-content" style={{ color: "black" }}>
                    <div className='flex-container'>
                        <div className='postimagediv'>
                            <img className='postimage' src={postData.photo}></img>
                        </div>
                        <div>
                             <h6>{postData.postedBy.name}</h6>
                        </div>
                        <div><button class="modal-close waves-effect waves-green btn-flat" onClick={() => {setPostData([])}}>Close</button></div>
                    </div>
                    
                </div>
               
            </div> */}
        </div>
    )
}

export default Profile