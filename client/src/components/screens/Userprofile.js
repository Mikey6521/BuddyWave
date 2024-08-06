import React, { useEffect, useState,useContext } from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'


const Profile = ()=>{
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setProfile(result)
        })
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item!=data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
        })
    }

    return(
        <>
        {userProfile ?

        <div style={{maxWidth:"500px",margin:"0px auto"}}>
            <div style={{display:"flex",justifyContent:"space-around",marginTop:"20px",borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={userProfile.user.profilepic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                        <h6>{ userProfile.posts.length } posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {!state.following.includes(userid) ?
                        <a className="#42a5f5 blue lighten-1 btn-small" onClick={()=>followUser()}>Follow</a>
                        :
                        <a className="#42a5f5 blue lighten-1 btn-small" onClick={()=>unfollowUser()}>Unfollow</a>
                    }
                    
                    
                </div>
            </div>
            <div className='gallery' style={{}}>
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className='item' src={item.photo}/>
                        )
                    })
                }
            </div>
        </div>

        : <h2>Loading .....</h2>}
        </>
    )
}

export default Profile