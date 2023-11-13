import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { MerchantBillingDetails } from "../components/merchantBillingDetails";
import "./style.css";
import { Configuration } from "../components/configuration";
import { ChangePassword } from "../components/changePassword";

export default function HomePage(props) {
  const [activeNavItem, setActiveNavItem] = useState("configuration");
  const navigate = useNavigate();
  console.log("homepage");

  const logout = () => {
    localStorage.setItem("isLoggedIn", false);
    localStorage.setItem("accessToken", "");
    // setActiveNavItem("configuration");
    navigate("/login");
  }

  const getComponent = () => {
    if (activeNavItem == "configuration") {
      return <Configuration {...props} />;
    } else if (activeNavItem == "changePassword") {
      return <ChangePassword setActiveNavItem={setActiveNavItem}/>
    }
  }
  return (
    <div className="homepage">
      <div className="homepage-left">
        <div className="logo-image">
          <img src="https://portal-staging.fastcourier.com.au/assets/media/logos/fast-courier-dark.png" />
        </div>
        <div className="side-nav-bar">
          <div className={activeNavItem == "configuration" ? "nav-bar-item-active" : "nav-bar-item"} onClick={() => setActiveNavItem("configuration")}>
            <span>Configuration</span> <span>  {activeNavItem == "configuration" && ">>"} </span>
          </div>
          {/* <div className={activeNavItem == "about" ? "nav-bar-item-active" : "nav-bar-item"} onClick={() => setActiveNavItem("about")}>
            <span>About Plugin</span><span>{activeNavItem == "about" && ">>"}</span>
          </div> */}
          <div className={activeNavItem == "changePassword" ? "nav-bar-item-active" : "nav-bar-item"} onClick={() => setActiveNavItem("changePassword")}>
            <span>Change Password</span><span>{activeNavItem == "changePassword" && ">>"}</span>
          </div>
          {/* <Link to="/login" onClick={() => props.setIsLoggedIn(false)}> */}
          <div className="nav-bar-item" onClick={() => logout()}>
            Logout
          </div>
          {/* </Link> */}
        </div>
      </div>
      <div className="homepage-right">
        {getComponent()}
      </div>
    </div>
  );
}
