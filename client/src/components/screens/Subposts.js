import React,{useState,useContext,useEffect} from 'react'
import {UserContext} from '../../App'
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Typography from '@mui/material/Typography';
import {withRouter} from "react-router-dom";
import { Box } from "@mui/material";

const Subposts = (props)=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [comment,setComment] = useState("");
    useEffect(()=>{
        fetch('/subposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])

    const likePost = (id)=>{
      fetch('/like',{
        method:'put',
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          postId:id
        })
      })
      .then(res=>res.json())
      .then(result=>{
        let oldData = [...data];
        const newData = oldData.map(item=>{
          if(item._id==result._id){
            return result
          }
          else{
            return item
          }
        })
        setData(newData)
      })
      .catch(err=>{
        console.log(err)
      })
    }

    const unlikePost = (id)=>{
      fetch('/unlike',{
        method:'put',
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          postId:id
        })
      })
      .then(res=>res.json())
      .then(result=>{
        const newData = data.map(item=>{
          if(item._id==result._id){
            return result
          }
          else{
            return item
          }
        })
        setData(newData)
      })
      .catch(err=>{
        console.log(err)
      })
    }

    const makeComment = (text,postId)=>{
      fetch('/comment',{
        method:'put',
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          postId,
          text
        })
      })
      .then(res=>res.json())
      .then(result=>{
        const newData = data.map(item=>{
          if(item._id==result._id){
            return result
          }
          else{
            return item
          }
        })
        setData(newData)
      })
      .catch(err=>{
        console.log(err)
      })
    }

    const deletePost = (postId)=>{
      fetch(`/deletepost/${postId}`,{
        method:"delete",
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
      })
      .then(res=>res.json())
      .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
          return item._id !== result._id
        })
        setData(newData)
      })
      .catch(err=>{
        console.log(err)
      })
    }

    const navigateTo = (record)=>{
      if(record.postedBy._id !== state._id) props.history.push(`/profile/${record.postedBy._id}`);
      else props.history.push('/profile');
    }

    return (
      <div className="home">
      {data.map((item) => {
        let comments = [...item.comments]
        comments.reverse();
        console.log(item.postedBy)
        return (
          <div className="card home-card" key={item._id}>
            <div className="cardtitle" style={{padding:"10px"}}>
              <Box style={{display:"flex",alignItems:"center" , gap:"15px"}}>
                <Avatar src={item.postedBy.profilepic} alt={item.postedBy.name}/>
                <Typography style={{cursor:"pointer",fontSize:"14px",fontWeight:"600"}} onClick={()=>navigateTo(item)}>
                  {item.postedBy.name}
                </Typography>
              </Box>
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right", cursor: "pointer" }}
                  onClick={() => {
                    deletePost(item._id);
                  }}
                >
                  delete
                </i>
              )}
            </div>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content input-field">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons lke"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons lke"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  favorite_border
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              <div style={{maxHeight:"200px",overflow:"scroll"}}>
              <List sx={{paddingLeft:"0px"}}>
              {comments.map((record) => {
                return (
                  <ListItem  sx={{paddingLeft:"0px"}}>
                    <ListItemAvatar>  
                       <Avatar alt={record.postedBy.name} src = {record.postedBy.profilepic} sx={{borderColor:"green"}}/>
                    </ListItemAvatar>
                    <ListItemText primary={<React.Fragment><Typography onClick={()=>navigateTo(record)} style={{fontWeight:"500",fontSize:"16px",cursor:"pointer"}}>{record.postedBy.name}</Typography></React.Fragment>} secondary={record.text} />
                  </ListItem>
                );
              })}
              </List>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(item._id);
                }}
              >
                <input type="text" placeholder="Add comment" onChange={(e)=>{setComment(e.target.value)}} value={comment} />
              </form>
            </div>
          </div>
        );
      })}
    </div>
    );
}

export default  withRouter(Subposts)