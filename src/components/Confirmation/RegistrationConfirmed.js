import React, { useContext, useEffect} from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import './RegistrationConfirmed.css'

function RegistrationConfirmed () {

  const history = useHistory();
  const [auth]  = useContext(AuthContext);

  
  useEffect(() => {   //Ensuring we cannot go back to login page when authenticated!
    if (auth===true) {
      history.push('/home');
    } 
    }); 
    
  const  goBackToLogin =() => {
        history.push('/');
      }

    return (
    <section className="Confirmation">
        
    <div className="confirmationContainer">
    <p>Your account has been created!</p>
    <div className="buttonContainer">
        <p>
            <span onClick={goBackToLogin}>Go back to login</span>
        </p>
        </div>
        </div>

    </section>
    );
  };

export default RegistrationConfirmed;