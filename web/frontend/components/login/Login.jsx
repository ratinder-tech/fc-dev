import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./style.css";
import { useState, useEffect } from "react";
import { Loader } from "../loader";

export function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const login = () => {
        setIsLoading(true);
        const payload = {
            "email": email,
            "password": password,
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
        }
        axios.post('https://fctest-api.fastcourier.com.au/api/wp/login', payload, { "headers": headers }).then(response => {
            console.log(response.data.merchant);
            props.setUserDetails(response.data.merchant);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("accessToken", response.data.merchant.access_token);
            navigate('/homepage');
            setIsLoading(false);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }

    return (
        <div className="main-container">
            {isLoading && <Loader />}
            <div className="logo-image">
                <img src="https://portal-staging.fastcourier.com.au/assets/media/logos/fast-courier-dark.png" />
            </div>
            <div className="inner-container">
                <div className="heading1">
                    Sign In to FastCourier
                </div>
                <div className="heading2">
                    <span>New Here? </span>
                    <Link to="/signup" style={{ textDecoration: "none" }}>
                        <span className="text-button"> Create an Account </span>
                    </Link>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="heading-continer">
                    <div className="heading-text1">
                        <span> Password&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="heading-text2">
                        <Link to="/forgotPassword" style={{ textDecoration: "none" }}>
                            <span className="text-button"> Forgot Password ? </span>
                        </Link>
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-field">
                        <input className="input-field-text" type="password" name="password" onChange={(e) =>
                            setPassword(e.target.value)
                        } />
                    </div>
                </div>
                <div className="input-container">
                    {/* <Link to="/homepage" style={{ width: "90%" }} onClick={() => props.setIsLoggedIn(true)}> */}
                    <button type="submit" className="submit-btn" variant="primary" onClick={() => login()}>
                        Continue
                    </button>
                    {/* </Link> */}
                </div>
            </div>
        </div>
    );
}