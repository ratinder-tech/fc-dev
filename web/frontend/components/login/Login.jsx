import "./style.css";

export function Login() {
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
                    <span>New Here? </span><span style={{ color: "#ff6900" }}> Create an Account</span>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        Email
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <div className="input-container">
                    <div className="input-lebel">
                        Password
                    </div>
                    <div className="input-field">
                        <input className="input-field-text" type="text" />
                    </div>
                </div>
                <button className="submit-btn" variant="primary">
                    Continue
                </button>
            </div>
        </div>
    );
}