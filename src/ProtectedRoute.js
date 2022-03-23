import React from 'react';
import {Route, Redirect} from 'react-router-dom';

function ProtectedRoute({authStatus: authStatus, component: Component, ...rest}) {

    return <Route {...rest} render={(props)=> {
      if (authStatus) {  //If authentication is success (logged in / 'true') we send the component/page to the user
          return <Component />;
      } else  {
          return (  //Else we will be returned to the login screen! 
               <Redirect to ={{pathname: "/", state:{from: props.location}}} />
          );
      }
     }  
}/>;
}
export default ProtectedRoute;