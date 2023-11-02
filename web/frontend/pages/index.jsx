import { useState } from "react";
import { Link } from "react-router-dom";
import { MerchantBillingDetails } from "../components/merchantBillingDetails";
import "./style.css";
import { Configuration } from "../components/configuration";

export default function HomePage(props) {
  const [activeNavItem, setActiveNavItem] = useState("configuration");
  console.log("homepage");
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
          <div className={activeNavItem == "about" ? "nav-bar-item-active" : "nav-bar-item"} onClick={() => setActiveNavItem("about")}>
            <span>About Plugin</span><span>{activeNavItem == "about" && ">>"}</span>
          </div>
          <div className={activeNavItem == "changePassword" ? "nav-bar-item-active" : "nav-bar-item"} onClick={() => setActiveNavItem("changePassword")}>
            <span>Change Password</span><span>{activeNavItem == "changePassword" && ">>"}</span>
          </div>
          <Link to="/login" onClick={() => props.setIsLoggedIn(false)}>
            <div className="nav-bar-item" onClick={() => setActiveNavItem("configuration")}>
              Logout
            </div>
          </Link>
        </div>
      </div>
      <div className="homepage-right">
        <Configuration />
      </div>
    </div>
  );
}
