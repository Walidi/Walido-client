import React, { useState, useEffect, useContext } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import RegistrationConfirmed from './components/Confirmation/RegistrationConfirmed'
import Home from './components/Home/Home';
import MyProfile from './components/Profile/myProfile';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from './components/Context/AuthContext';
import Axios from 'axios';
import {UserContext, UserProvider} from './components/Context/UserContext';

function App () {           //Exact path = Beginning page of the site

  const [authStatus, setAuthStatus] = useState(AuthContext); //Updating authentication as we're reloading
   
  const {setUser} = useContext(UserContext);  //Updating and retrieving user as we are 'reloading'


  const checkCV = (cvFile) => { 
      if (cvFile==="No file uploaded") {
          return cvFile;
      }
      else {
          return cvFile;
      }
  }
  
 
  useEffect(() => { //Stay logged in, if user is logged in, after refresh

    const token = localStorage.getItem('token');
    Axios.post("https://walido-server.adaptable.app/authenticate", {  //End-point for creation request
    token: token, 
    },{withCredentials: true}).then(response => {
      if (!response.data.auth) { //checking for response message
        setAuthStatus(false); //Login status is 
        localStorage.clear();
        console.log(response.data.user);
       } else {
        setAuthStatus(true);  
        console.log(response.data.user);
        var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
        var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
        var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
        var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');;
        var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
        var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
        var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1'); //CONSIDER CUTTING OFF data value from filename
        setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr, cvFile: checkCV(cvFile)});
       }
    })
  }
  ,[]);
  
  return (
  <AuthContext.Provider value={[authStatus, setAuthStatus]}>
    <Router>
    <Switch>
      <Route exact={true} path="/" component={Login} />
      <Route path="/Registration" component={Registration} />
      <Route path ="/Confirmation" component={RegistrationConfirmed}/>
      <ProtectedRoute path="/home" component ={Home} authStatus = {authStatus}/>
      <ProtectedRoute path = "/myProfile" component={MyProfile} authStatus = {authStatus}/>
    </Switch>
    </Router>
  </AuthContext.Provider>
  );
  };
  const rootElement = document.getElementById('root');
  render(
    // wrap root element with context
    <UserProvider>
      <App /> 
    </UserProvider>,
    rootElement
  );