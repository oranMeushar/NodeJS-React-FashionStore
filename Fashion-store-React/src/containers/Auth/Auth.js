import React from 'react';
import './Auth.css';

import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

const Auth = () =>{
    return(
        <div className="auth">
            <SignIn></SignIn>
            <SignUp></SignUp>
        </div>   
    )
}

export default Auth;