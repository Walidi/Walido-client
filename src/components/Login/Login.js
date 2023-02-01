import React,{useContext, useEffect, useState}  from 'react';
import Axios from 'axios';
import './Login.css';
import  { useHistory } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import logo from '../../images/logo.png';
import { UserContext } from '../Context/UserContext';

function Login () {
  
  const url = "https://walido-server.adaptable.app/";
  const [emailAuth, setEmailAuth] = useState("");
  const [passwordAuth, setPasswordAuth] = useState("");

  const [loginStatus, setLoginStatus] = useContext(AuthContext);
  const {setUser} = useContext(UserContext);

  const [inputResponse, setInputResponse] = useState("");
  const history = useHistory();

  useEffect(() => {   //Ensuring we cannot go back to login page when authenticated!
    if (loginStatus===true) {
      history.push('/home');}
    }); 

  const goToHomeScreen=() => {
    history.push('/home');
  }

  const checkCV = (cvFile) => {
    if (cvFile==="No file uploaded") {
        return cvFile;
    }
    else {
        return cvFile;
    }
}
  
  Axios.defaults.withCredentials = true; 

  const handleLogin = () => {
    
    
    if (emailAuth === "" || passwordAuth === "") {   //Dummy check
      setInputResponse("Fields required!");
      setLoginStatus(false);
     }
   else
    Axios.post(url+'login', {
      email: emailAuth,
      password: passwordAuth
    }).then((response)=> {
      if (!response.data.auth) { //checking for response message
       setInputResponse(response.data.message);     
       setLoginStatus(false);
      } 
      else {    //SUCCESS! 
          
           {loginStatus && goToHomeScreen()};
           setLoginStatus(true); //Maybe consider setting it as (response.data.auth) instead of client-dependant: 'true'
           localStorage.setItem("token", response.data.token); //Json web token is set to user's local storage
           var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
           var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
           var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
           var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');;
           var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
           var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
           var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1'); //Consider cutting off data values from file
           var docID = JSON.stringify(response.data.user[0].docID).replace(/^"(.+(?="$))"$/, '$1'); //Consider cutting off data values from file
           
           setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr, 
            cvFile: checkCV(cvFile), docID: docID});
        }
    });
  };

   const goToRegistration = () => {
    history.push('/registration');
    }
    
  return (
    <section className="Login">
    <div>
    <img style={{flex:1, height: 80, width: 90, marginTop: 10}}
    src={logo}/>
    </div>
        
    <div className="loginContainer">

        <div className ="title">
        <h1>Welcome to Walido.com</h1>
        </div>

        <label className='label'>Email</label>
        <input className='input'
        type="text" 
        required
        autoFocus
        onChange={(event) => {
          setEmailAuth(event.target.value);
        }}
        />
        <label className='label'>Password</label>
        <input className='input'
        type="password"
        required
        autoFocus
        onChange={(event) => {
          setPasswordAuth(event.target.value);
        }}
        />
        <p className="errorMsg">{inputResponse}</p>
        <div className="buttonContainer">
        <button className='button' onClick={handleLogin}> Login </button>
        <p>
            Don't have an account?
            <span onClick={goToRegistration}>Register here!</span>
        </p>
        </div>
      </div>
    </section>
  );
 }
 export default Login;