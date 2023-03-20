import React, { Component } from 'react'
import {auth, provider} from '../firebase_config'
import {signInWithPopup} from 'firebase/auth'

import Cookies from 'universal-cookie'

const cookies = new Cookies();

type Props = {
  setIsAuth: Function
}


const Auth  = ({ setIsAuth}: Props) => {


const signInWithGoogle = async () => {
  try {
  const result = await signInWithPopup(auth, provider);
  cookies.set('auth-token', result.user.refreshToken);
  setIsAuth(true);
    
} catch(err) {
  console.error(err);
  
}

};

 return (
    <div className='auth'>
      <h2>Welcome to React Chat</h2>
      <p>Sign in with your Google account to continue</p>
      <button className='btn google' onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}


export default Auth;