import { Link } from "react-router-dom";
import "../login/style.css";

export function Signup() {
    return (
        <div className="main-container">
            <div className="logo-image">
                <img src="https://portal-staging.fastcourier.com.au/assets/media/logos/fast-courier-dark.png" />
            </div>
            <div className="inner-container">
                <div className="heading1">
                    Create an Account
                </div>
                <div className="heading2">
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        <span className="text-button"> Sign in here</span>
                    </Link>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> First Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Last Name&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        Company (Optional)
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span> Password&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="password" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        <span>Confirm Password&nbsp;</span><span style={{ color: "red" }}> *</span>
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="password" />
                    </div>
                </div>
                <div className="input-container">
                    <button className="submit-btn" variant="primary">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}