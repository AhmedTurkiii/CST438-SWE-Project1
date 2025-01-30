import React from 'react';
import "./sign.css";




function sign() {
    return (
        <div className="Login">
            <div className="LoginBox">
                <div className="LoginHeader"> Login </div>
                <div className="inputs">
                    <input type="Email" placeholder="Enter your Email" />
                    <input type="Password" placeholder="Enter your Password" />
                </div>
            </div>
        </div>
    );
}

export default sign;