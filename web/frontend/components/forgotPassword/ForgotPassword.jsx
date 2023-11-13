import { Link } from "react-router-dom";
import axios from 'axios';
import "../login/style.css";
import "./style.css";
import { useState } from "react";
import { Modal } from "../modal";
import { Loader } from "../loader";

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const forgotPassword = () => {
        setIsLoading(true);
        const payload = {
            "email": email,
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "version": "3.1.1",
        }
        axios.post('https://fctest-api.fastcourier.com.au/api/wp/forgot_password', payload, { "headers": headers }).then(response => {
            console.log(response.data);
            setIsLoading(false);
            setShowModal(true);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }
    return (
        <div className="main-container">
            {isLoading && <Loader />}
            <Modal showModal={showModal} width="">
                <div className="success-modal">
                    <div className="success-tex">
                        We have sent you a password reset email.
                    </div>
                    <Link to={"/login"}>
                        <div className="success-btn">
                            <button className="submit-btn" variant="primary">
                                Ok
                            </button>
                        </div>
                    </Link>
                </div>
            </Modal>
            <div className="logo-image">
                <img src="https://portal-staging.fastcourier.com.au/assets/media/logos/fast-courier-dark.png" />
            </div>
            <div className="inner-container">
                <div className="heading1">
                    Forgot Password ?
                </div>
                <div className="heading2">
                    <span style={{ color: "#b5b5c3" }}>Enter your email to reset your password.</span>
                </div>

                <div className="input-container">
                    <div className="input-lebel">
                        <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="btn-section">
                    <button className="submit-btn" variant="primary" onClick={() => forgotPassword()}>
                        Submit
                    </button>
                    <Link to="/login" style={{ width: "100%" }}>
                        <button className="cancel-btn" variant="primary">
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}