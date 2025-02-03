import React, {useState} from 'react';
import "./LoginRegister.css";
import { FaUser, FaLock, FaEnvelope  } from "react-icons/fa";
import {NULL} from "turbo-stream/dist/utils";


const LoginRegister = () => {

    const[action, setAction] = useState("");

    const registerLink =() => {
        setAction("active");
    };

    const loginLink =() => {
        setAction("");
    };

    return (

        <div className= {`wrapper ${action}`}>
            <div className= "form-box login">
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type= "text" placeholder="Username" required />
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type= "password" placeholder="Password" required />
                        <FaLock className="icon"/>
                    </div>
                    <div className="remember-forgot">
                        <label><input type ="checkbox" /> Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit" onClick={func}>Login</button>
                    <div className ="register-link" >
                        <p>Don't have an account? <a
                            href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div>

            <div className= "form-box register">
                <form action="">
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input type= "text" placeholder="Username" required />
                        <FaUser className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type= "Email" placeholder="Email" required />
                        <FaEnvelope className="icon"/>
                    </div>
                    <div className="input-box">
                        <input type= "password" placeholder="Password" required />
                        <FaLock className="icon"/>

                    </div>

                    <div className="remember-forgot">
                        <label><input type ="checkbox" />I agree to the terms & conditions</label>
                    </div>

                    <button type="submit" >Register</button>

                    <div className ="register-link" >
                        <p>Already have an account? <a
                            href="#" onClick={loginLink}> Login </a></p>
                    </div>

                </form>
            </div>
        </div>
    );




};
function func() {
    const username = document.getElementById("Username");
    const password = document.getElementById("Password");
    //else (email == null || password == null) {
      //  alert("Please enter all the fields");
    //}
    // @ts-ignore
    if (username == "rull@1" && password == "1234") {
        alert("Success");
    }
    else {
        alert("Please enter all the fields");
        window.location.href = "https://www.youtube.com/watch?v=3nrQGtVztR0";
    }

        //window.location.href = "https://www.youtube.com/watch?v=3nrQGtVztR0";



}


export default LoginRegister;