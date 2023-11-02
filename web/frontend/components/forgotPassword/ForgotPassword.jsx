import { Link } from "react-router-dom";
import "../login/style.css";

export function ForgotPassword() {
    return (
        <div className="main-container">
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
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <div className="btn-section">
                    <button className="submit-btn" variant="primary">
                        Submit
                    </button>
                    <Link to="/login" style={{width : "100%"}}>
                        <button className="cancel-btn" variant="primary">
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}