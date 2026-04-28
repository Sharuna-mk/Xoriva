import React from "react";
import { GoogleAuthProvider, signInWithPopup, } from "firebase/auth";
import { authentication } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { googleLoginAPI } from '../services/allAPI'

const provider = new GoogleAuthProvider();

const GoogleLogin = () => {
  const navigate = useNavigate()
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(authentication, provider);
      console.log("Popup success", result);

      const user = result.user;

      const firebaseToken = await user.getIdToken();

      const response = await googleLoginAPI(firebaseToken);
      console.log(response);

      sessionStorage.setItem("Token", response.token);
      sessionStorage.setItem("userData", JSON.stringify(response.user));

      console.log("STORED TOKEN:", sessionStorage.getItem("Token"));
      navigate("/");


    } catch (error: any) {
      console.error("Login Error:", error.message);
    }
  };



  return (
    <button onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  );
};

export default GoogleLogin;