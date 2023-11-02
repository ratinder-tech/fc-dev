import { Link } from "react-router-dom";
import "./style.css";

export function Login(props) {
    return (
        <div className="main-container">
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
                        <input className="input-field-text" type="text" />
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
                        <input className="input-field-text" type="password" />
                    </div>
                </div>
                <Link to="/homepage" style={{width : "90%"}} onClick={() => props.setIsLoggedIn(true)}>
                    <button className="submit-btn" variant="primary">
                        Continue
                    </button>
                </Link>
            </div>
        </div>
    );
}