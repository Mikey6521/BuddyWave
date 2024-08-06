import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Createpost from "./components/screens/Createpost";
import Resetpass from "./components/screens/Resetpass";
import Userprofile from "./components/screens/Userprofile";
import Page404 from "./components/screens/Page404";
import { useEffect, createContext, useReducer, useContext } from "react";
import { initialState, reducer } from "./reducers/userReducer";
import Subposts from "./components/screens/Subposts";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      history.push('/login')
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/home">
        <Home/>
        </Route>
        <Route path="/resetpassword">
          <Resetpass/>
        </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route path="/createpost">
        <Createpost/>
      </Route>
      <Route path="/profile/:userid">
        <Userprofile/>
      </Route>
      <Route path="/subposts">
        <Subposts/>
      </Route>
      <Route path="/*">
        <Page404/>
      </Route>
    </Switch>
  );
};

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routing></Routing>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
