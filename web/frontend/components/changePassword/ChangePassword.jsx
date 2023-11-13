import { Link } from "react-router-dom";
import axios from 'axios';
import "./style.css";
import { useState } from "react";
import { Modal } from "../modal";
import { Loader } from "../loader";

export function ChangePassword(props) {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const changePassword = () => {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const payload = {
            "current_password": password,
            "new_password": newPassword,
            "confirm_password": confirmPassword,
        }
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "request-type": "shopify_development",
            "Version": "3.1.1",
            "Authorization": "Bearer " + accessToken
        }
        axios.post('https://fctest-api.fastcourier.com.au/api/wp/change_password', payload, { "headers": headers }).then(response => {
            console.log(response.data);
            setIsLoading(false);
            setShowModal(true);
        }).catch(error => {
            setIsLoading(false);
            console.log(error);
        })
    }
    return (
        <div className="change-password">
            {isLoading && <Loader />}
            <Modal showModal={showModal} width="">
                <div className="success-modal">
                    <div className="success-tex">
                        Password changed successfully.
                    </div>
                    <div className="success-btn">
                        <button className="submit-btn" variant="primary" onClick={() => props.setActiveNavItem("configuration")}>
                            Ok
                        </button>
                    </div>
                </div>
            </Modal>
            <div className="heading1">
                Change Password
            </div>
            <div className="inner-container">
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Password&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> New Password&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="password" onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span>Confirm Password&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <div className="btn-section">
                    <button className="submit-btn" variant="primary" onClick={() => changePassword()}>
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