import React, {useContext, useState, useEffect} from 'react';
import './MyProfile.css'
import Axios from 'axios';
import  {withRouter } from 'react-router-dom';
import logo from '../../images/logo.png';
import { useHistory } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import { UserContext } from '../Context/UserContext';
import validator from 'validator'
import DeleteIcon from '@mui/icons-material/Delete';


import {
  Nav,
  NavLink,
  Bars,
  NavMenu, 
  NavBtn,
  NavBtnLink
} from '../NavBar/NavbarElements';

function MyProfile () {

  useEffect(() => { //Ensuring we cannot go back to Profile page when logged out! Already done with protected routing, but double security :D
    if (auth===false) {
      history.push('/');
        }
    if (user.cvFile==="No file uploaded") { //If no cv is uploaded, we hide delete icon for obvious reasons
        setShowDeleteIcon(false);
        setCvUploaded(false);
       }
    else {                    
        setShowDeleteIcon(true);     //Show delete icon if user has existing cv file
        setCvUploaded(true);
    }
    }); 

  const history = useHistory();
  
  const url = "https://walido-server.adaptable.app/";
  //Context data
  const [auth, setAuth] = useContext(AuthContext);
  const {user, setUser} = useContext(UserContext);

  //State management of Profile functions
  const [dataChanged, setDataChanged] = useState(false);
  const [showEditContainer, setShowEditContainer] = useState(false);
  const [showFileSubmit, setShowFileSubmit] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  //Input messages for user
  const [emailInputStatus, setEmailInputStatus] = useState("");
  const [nameInputStatus, setNameInputStatus] = useState("");
  const [phonenrInputStatus, setPhonenrInputStatus] = useState("");

  const [file, setFile] = useState("");

  //Values to update/change
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNr, setPhoneNr] = useState(user.phoneNr);
  const [bachelorDegree, setBachelorDegree] = useState(user.bachelorDegree);
  const [masterDegree, setMasterDegree] = useState(user.masterDegree);
          
  const handleLogOut = () => {
    setAuth(false);
    localStorage.clear();
    sessionStorage.clear();

    Axios.get(url+"logout", {
      }).then((response => {
         console.log(response);
       }
    ));
    history.push('/');
}


  const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
         object.target.value = object.target.value.slice(0, object.target.maxLength)
          }
        }

  const handleNewEditClick = () => {
    setShowEditContainer(true) //hides component if shown, reveals if not shown
    setName(user.name);
    setEmail(user.email);
    setPhoneNr(user.phoneNr);
    setBachelorDegree(user.bachelorDegree);
    setMasterDegree(user.masterDegree);
   }

  const handleFileSubmitStatus = (e) => {
    setShowFileSubmit(true);
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  }

   const handleBachelorChange = (e)  => {
    setBachelorDegree(e.target.value);
    setDataChanged(true);
  }
  const handleMasterChange = (e)  => {
    setMasterDegree(e.target.value);
    setDataChanged(true);
  }

   const cancel = () => {
    setEmailInputStatus("");  //Resetting the input-statuses so we can set them again on-press
    setNameInputStatus("");
    setPhonenrInputStatus("");
    setShowEditContainer(false); //If cancelled, we return to profile container
    setShowFileSubmit(false); //If cancelled, we return fileSubmission status to default
    setDataChanged(false);
   }

   const handleNameChange = (e) => {
       setName(e.target.value);
       setDataChanged(true);

   }

   const handleEmailChange = (e) => {
       setEmail(e.target.value);
       setDataChanged(true);
  }
  
  const handlePhoneNrChange = (e) => {
       setPhoneNr(e.target.value);
       setDataChanged(true);
  }
  
   
  const checkEmail = (email) => {
    if (email !== "" && validator.isEmail(email)) {
      return true;
    }
    else {
      return false;
    }
  }

  const checkCV = (cvFile) => {
    if (cvFile==="No file uploaded") {
        return cvFile;
    }
    else {
        setShowDeleteIcon(true);
        return cvFile;
    }
}

   const update = () => {
     
    //If only CV has been uploaded in the updateView:
    if (showFileSubmit === true && dataChanged === false) {

      const formData = new FormData();
      formData.append("file", file);

      if (file.size > 1000000) 
         {
              alert("File too big!");
         }
      else if (file.type!== "application/pdf") {
              alert("Only .pdf files allowed!");
        }
      
      else if (file.name.length > 50) {
              alert("Filename too long!");
        }

     else {

      Axios.post(url+"uploadCV", formData, {headers: {"x-access-token": localStorage.getItem("token")},withCredentials: true}
      ).then(
        (response) => {
          var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
          var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
          var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
          var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');
          var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
          var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
          var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1');
          var docID = JSON.stringify(response.data.user[0].docID).replace(/^"(.+(?="$))"$/, '$1');

          setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr,
             cvFile: checkCV(cvFile), docID: docID});
          alert(response.data.message);  //Sending message from server to user
          setShowEditContainer(false);            //Returning to the normal profile view when user click 'ok'
          setShowFileSubmit(false);

        })
    }} 
    
    //If only data has been updated but no CV changes:
    if (showFileSubmit === false && dataChanged === true) {

    setEmailInputStatus("");  //Resetting the input-statuses so we can set them again on-press
    setNameInputStatus("");
    setPhonenrInputStatus("");

    let inputStatusOk = true;

    if (name === "") {
     setNameInputStatus("Name required!");
       inputStatusOk = false;
    }
   else if (name.length < 3) {
      setNameInputStatus("Name must be at least 3 characters!");
      inputStatusOk = false;
    }

    if (phoneNr.length < 8) {
      setPhonenrInputStatus("Vald phone number required!");
      inputStatusOk = false;
     }

    if (checkEmail(email) === false) {
      setEmailInputStatus("Vald email required!");
      inputStatusOk = false;
    }

    if (inputStatusOk) {   //If input status is true I.E no input errors - We send post request!

    Axios.patch(url+"updateMyProfile", {name: name, email: email, phoneNr: phoneNr, 
    bachelorDegree: bachelorDegree, masterDegree: masterDegree}, 
    {headers: {"x-access-token": localStorage.getItem("token")},withCredentials: true}
    ).then(
      (response) => {
        //Making sure our currentUser Context in client attains the newly updated data when screens change
        var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
        var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
        var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
        var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');
        var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
        var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
        var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1');
        var docID = JSON.stringify(response.data.user[0].docID).replace(/^"(.+(?="$))"$/, '$1');
        setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr,
           cvFile: checkCV(cvFile), docID: docID});

       alert(response.data.message);  //Sending message from server to user
       setShowEditContainer(false);            //Returning to the normal profile view when user click 'ok'
       setDataChanged(false);

      });
    }
     }
 
     //If both CV and data are updated:
      if (showFileSubmit === true && dataChanged === true) {
        setEmailInputStatus("");  //Resetting the input-statuses so we can set them again on-press
        setNameInputStatus("");
        setPhonenrInputStatus("");
    
        let inputStatusOk = true;
    
        if (name === "") {
         setNameInputStatus("Name required!");
           inputStatusOk = false;
        }
       else if (name.length < 3) {
          setNameInputStatus("Name must be at least 3 characters!");
          inputStatusOk = false;
        }
    
        if (phoneNr.length < 8) {
          setPhonenrInputStatus("Vald phone number required!");
          inputStatusOk = false;
         }
    
        if (checkEmail(email) === false) {
          setEmailInputStatus("Vald email required!");
          inputStatusOk = false;
        }
    
        if (inputStatusOk) {   //If input status is true I.E no input errors - We send post request!
    
        Axios.patch(url+"updateMyProfile", {name: name, email: email, phoneNr: phoneNr, 
        bachelorDegree: bachelorDegree, masterDegree: masterDegree}, 
        {headers: {"x-access-token": localStorage.getItem("token")},withCredentials: true}
        ).then(
          (response) => {
            var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
            var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
            var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
            var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');
            var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
            var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
            var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1');
            var docID = JSON.stringify(response.data.user[0].docID).replace(/^"(.+(?="$))"$/, '$1');
            setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr,
               cvFile: checkCV(cvFile), docID: docID});
           alert(response.data.message);  //Sending message from server to user
          });
      const formData = new FormData();
      formData.append("file", file);

      if (file.size > 1000000) 
      {
           alert("File too big!");
      }
      else if (file.type!== "application/pdf") {
           alert("Only .pdf files allowed!");
      }
   
      else if (file.name.length > 50) {
           alert("Filename too long!");
     }

     else {
  
      Axios.post(url+"uploadCV", formData,    {headers: {"x-access-token": localStorage.getItem("token")},withCredentials: true}
      ).then(
        (response) => {
          var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
          var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
          var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
          var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');
          var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
          var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
          var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1');
          var docID = JSON.stringify(response.data.user[0].docID).replace(/^"(.+(?="$))"$/, '$1');
          setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr,
             cvFile: checkCV(cvFile), docID: docID});
          alert(response.data.message);  //Sending message from server to user
          setShowEditContainer(false);            //Returning to the normal profile view when user click 'ok'
          setDataChanged(false);   

        });
          }} 
        }
      };

   const getCV = () => {

    if (user.cvFile === "No file uploaded") {
      }
    else {
	 	Axios.get(url+"getCV", {headers: {"x-access-token": localStorage.getItem("token")},withCredentials: true, responseType: 'blob'}
			).then(
        (response) => {
		      //Create a Blob from the PDF Stream
           const file = new Blob(
            [response.data], 
            {type: 'application/pdf'});
             //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
             //Open the URL on new Window
            window.open(fileURL);
          });
   }};

    const deleteCV = () => {
        var confirmed = window.confirm("Do you want to delete " + user.cvFile + " ?");

        if (confirmed) {
          Axios.delete(url+"deleteCV", {headers: {"x-access-token": localStorage.getItem("token")},withCredentials: true}
          ).then(
            (response) => {
              var id = JSON.stringify(response.data.user[0].id).replace(/^"(.+(?="$))"$/, '$1');
              var name = JSON.stringify(response.data.user[0].name).replace(/^"(.+(?="$))"$/, '$1');
              var email = JSON.stringify(response.data.user[0].email).replace(/^"(.+(?="$))"$/, '$1');
              var bachelorDegree = JSON.stringify(response.data.user[0].bachelorDegree).replace(/^"(.+(?="$))"$/, '$1');
              var masterDegree = JSON.stringify(response.data.user[0].masterDegree).replace(/^"(.+(?="$))"$/, '$1');
              var phoneNr = JSON.stringify(response.data.user[0].phoneNr).replace(/^"(.+(?="$))"$/, '$1');
              var cvFile = JSON.stringify(response.data.user[0].cvFile).replace(/^"(.+(?="$))"$/, '$1');
              var docID = JSON.stringify(response.data.user[0].docID).replace(/^"(.+(?="$))"$/, '$1');
              setUser({id: id, name: name, email: email, bachelorDegree: bachelorDegree, masterDegree: masterDegree, phoneNr: phoneNr,
                 cvFile: checkCV(cvFile), docID: docID});
              alert(response.data.message);  //Sending message from server to user
              setShowEditContainer(false);
            }
          )
        }
    }
    return (
      <>
      <div>
      <Nav>
      <NavLink to='/home'>
        <img style={{flex:1, height: 60, width: 60}}
        src={logo}/>
      </NavLink>
      <Bars />
      <NavMenu>
        <NavLink to='candidates' activeStyle>
          Candidates 
        </NavLink>
        <NavLink to='/myProfile' activeStyle>
          My Profile
        </NavLink>
      </NavMenu>
      <NavBtn>
        <NavBtnLink to ="/" onClick={handleLogOut}>Log out</NavBtnLink>
      </NavBtn>
      </Nav>
      </div>

	<div className ="titleContainer">
	<h1>View and edit your information!</h1>
	</div>
  { !showEditContainer && 
  <div>
	<div className="profileContainer">
   
	<div className="leftContainer">
	<label className='label'>Full name:</label>
	<label className='labelValue'>{user.name}</label> 
	<label className='label'>Email:</label>
	<label className='labelValue'>{user.email}</label> 
	<label className='label'>Phone number:</label>
	<label className='labelValue'>+45 {user.phoneNr}</label> 
	</div>

	<div className="rightContainer">
	<label className='label'>Bachelor's degree:</label>
	<label className='labelValue'>{user.bachelorDegree}</label> 
	<label className='label'>Master's degree:</label>
	<label className='labelValue'>{user.masterDegree}</label> 
  
  <label className='label'>CV:</label>

  <div className="cvContainer">
  <a href="#" style={{textDecoration:'underline', color: 'darkblue', fontSize: 16}} onClick={getCV}>{user.cvFile}</a>
    {showDeleteIcon &&
     <DeleteIcon style={{color:"#8B0000", marginLeft: 7, cursor:'pointer', marginTop: -2}} onClick={deleteCV}/>
  }
  </div>
 
	</div> 
	</div>

	<div className="editButtonContainer">
	<button className='buttonEdit' onClick={handleNewEditClick}> Edit </button>
	</div>  
  </div>
  }
  
  { showEditContainer &&              //Write design for editing here:
  <div>
  <div className="editContainer">
  <div className="leftContainer">
	<label className='editLabel'>Full name:</label>
	<input 
  className="editInput"
  type="text" 
  autoFocus 
  value={name}
  onChange={(event) => {handleNameChange(event)}}/>
    <p className="errorMsg">{nameInputStatus}</p>

  <label className='editLabel'>Email:</label>
	<input 
  className="editInput"
  type="text" 
  autoFocus 
  value={email}
  onChange={(event) => {handleEmailChange(event)}}/>
   <p className="errorMsg">{emailInputStatus}</p>

  <label className='editLabel'>Phone number:</label>
	<input
  className="editPhoneNr" 
  type="number" 
  autoFocus 
  maxLength = "8" 
  onInput={maxLengthCheck} 
  value={phoneNr}
  onChange={(event) => {handlePhoneNrChange(event)}}/>
   <p className="errorMsg">{phonenrInputStatus}</p>

	</div>

  <div className="rightContainer">
  <label className='editLabel'>Bachelor's degree:</label>
  <select name="bachelorDegrees" defaultValue={bachelorDegree} onChange={handleBachelorChange}>
    <option value="--None--">--None--</option>
    <option value="Law">Law</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Medicin">Medicin</option>
    <option value="Business Administration">Business Administration</option>
    <option value="Biology">Biology</option>
    <option value="Finance/Accounting">Finance/Accounting</option>
    <option value="Software engineering">Software engineering</option>
    <option value="Computer Science">Computer Science</option>
    <option value="Data Science">Data Science</option>
    <option value="Information Management">Information Management</option>
    <option value="Economics">Economics</option>
  </select>
  
  <label className='editLabel'>Master's degree:</label>
  <select name="masterDegrees" defaultValue={masterDegree} onChange={handleMasterChange}>
    <option value="--None--">--None--</option>
    <option value="Law">Law</option>
    <option value="Mathematics">Mathematics</option>
    <option value="Medicin">Medicin</option>
    <option value="Business Administration">Business Administration</option>
    <option value="Biology">Biology</option>
    <option value="Finance/Accounting">Finance/Accounting</option>
    <option value="Software engineering">Software engineering</option>
    <option value="Computer Science">Computer Science</option>
    <option value="Data Science">Data Science</option>
    <option value="Information Management">Information Management</option>
    <option value="Economics">Economics</option>
  </select>

  <label className='label'>CV:</label>
    {!cvUploaded &&
    <input type="file" accept=".pdf" onChange={(e) => {handleFileSubmitStatus(e)}} 
    style={ showFileSubmit ? { textDecoration:'underline', color: 'darkblue', fontSize: 14} : {}} />
        }
    {cvUploaded &&
      <div className="cvContainer">
      <a href="#" style={{textDecoration:'underline', color: 'darkblue', fontSize: 16}} onClick={getCV}>{user.cvFile}</a>
        {showDeleteIcon &&
         <DeleteIcon style={{color:"#8B0000", marginLeft: 7, cursor:'pointer', marginTop: -2}} onClick={deleteCV}/>
      }
      </div>
    }

  </div>

  </div>
  <div className="editButtonContainer">
     { (dataChanged || showFileSubmit) && 
	<button className='buttonUpdate' onClick={update}> Save changes </button>
     }
	<button className='buttonCancel' onClick={cancel}> Cancel </button>
	</div> 
  </div>
}
      </>
    );
};

export default withRouter(MyProfile);