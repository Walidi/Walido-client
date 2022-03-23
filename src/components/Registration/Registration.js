import React, {useContext, useEffect,useState} from 'react';
import Axios from 'axios';
import validator from 'validator'
import './Registration.css'
import  { useHistory } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function Registration () {

  const [emailReg, setEmailReg] = useState("");
  const [nameReg, setNameReg] = useState("");
  const [passwordReg1, setPasswordReg1] = useState("");
  const [passwordReg2, setPasswordReg2] = useState("");
  const [phonenrReg, setPhonenrReg] = useState("");
  const [emailInputStatus, setEmailInputStatus] = useState("");
  const [nameInputStatus, setNameInputStatus] = useState("");
  const [password1InputStatus, setPassword1InputStatus] = useState("");
  const [password2InputStatus, setPassword2InputStatus] = useState("");
  const [phonenrInputStatus, setPhonenrInputStatus] = useState("");
  const [auth] = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {   //Ensuring we cannot go back to login page when authenticated!
    if (auth===true) {
      history.push('/home');
    } 
    }); 

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
     object.target.value = object.target.value.slice(0, object.target.maxLength)
      }
    }

  const checkEmail = (email) => {
      if (email !== "" && validator.isEmail(email)) {
        return true;
      }
      else {
        return false;
      }
    }

  const goBackToLogin =() => {
    history.push('/');
   }

  const goToConfirmationScreen=() => {
    history.push('/confirmation');
   }

  const handleRegistration = () => {

    setEmailInputStatus("");  //Resetting the input-statuses so we can set them again on-press
    setNameInputStatus("");
    setPassword1InputStatus("");
    setPassword2InputStatus("");
    setPhonenrInputStatus("");

    let inputStatusOk = true;

    if (nameReg === "") {
     setNameInputStatus("Name required!");
       inputStatusOk = false;
    }
   else if (nameReg.length < 3) {
      setNameInputStatus("Name must be at least 3 characters!");
      inputStatusOk = false;
    }

    if (phonenrReg.length < 8) {
      setPhonenrInputStatus("Vald phone number required!");
      inputStatusOk = false;
     }

    if (checkEmail(emailReg) === false) {
      setEmailInputStatus("Vald email required!");
      inputStatusOk = false;
    }

    if (passwordReg1 === "") {
      setPassword1InputStatus("Password required!");
      inputStatusOk = false;
    }

    else if (passwordReg1 !== passwordReg2) {
      setPassword2InputStatus("Passwords do not match!");
      inputStatusOk = false;
    }

   else if (passwordReg1.length<5) {
      setPassword1InputStatus("Password must at least be 5 characters!");
      inputStatusOk = false;
    }

    if (inputStatusOk) {   //If input status is true I.E no input errors - We send post request!

    Axios.post("https://walido-server.herokuapp.com/register", {   //End-point for creation request
      email: emailReg,
      name:  nameReg, 
      password: passwordReg1,
      phoneNr: phonenrReg, 
      bachelorDegree: "--None--",
      masterDegree: "--None--",
      cvFile: "No file uploaded"
    }).then(response => {
      if (response.data.message) {    //If the response from server returns us the message of "User already exists" we alert here!
      alert(response.data.message + " Try another!");
      }
      else {
      //alert('Success!'); //Navigate to "Login" or "Confirmation page of the registration"
      goToConfirmationScreen();
      }
    })
    .catch(error => {
      console.log({
        error,  
        'error response': error.response
      })
      alert('Server error!')
    }) 
  }
  };

    return (

    <section className="Registration">
        
    <div className="registrationContainer">
        <div className ="title">
        <h1>Register yourself here!</h1>
        </div>

        <label className='label'>Full name</label>
        <input className='input'
        type="text" 
        required
        autoFocus
        onChange={(event) => {
          setNameReg(event.target.value);
        }}
        />
        <p className="errorMsg">{nameInputStatus}</p>

         <label className='label'>Phone number</label>
        <input className='input'
        type="number"
        required
        autoFocus
        maxLength = "8" 
        onInput={maxLengthCheck} 
        onChange={(event) => {
          setPhonenrReg(event.target.value);
        }}
        />
        <p className="errorMsg">{phonenrInputStatus}</p>

        <label className='label'>Email</label>
        <input className='input'
        type="text" 
        required
        autoFocus
        onChange={(event) => {
          setEmailReg(event.target.value);
        }}
        />

        <p className="errorMsg">{emailInputStatus}</p>

        <label className='label'>Password</label>
        <input className='input'
        type="password"
        required
        autoFocus
        onChange={(event) => {
          setPasswordReg1(event.target.value);
        }}
        />
        <p className="errorMsg">{password1InputStatus}</p>

        <label className='label'>Repeat password</label>
        <input className='input'
        type="password"
        required
        autoFocus
        onChange={(event) => {
          setPasswordReg2(event.target.value);
        }}
        />
        <p className="errorMsg">{password2InputStatus}</p>

        <div className="buttonContainer">
        <button className='button' onClick={handleRegistration}> Register </button>
        <p>
            Already have an account?
            <span onClick={goBackToLogin}>Login here!</span>
        </p>
        </div>
      </div>
    </section>
    );
};

export default Registration;