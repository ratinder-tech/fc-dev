import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomePage from "./pages";
import { Login } from "./components";
import { Signup } from "./components/signup";

export default function App() {
  return (
    <div>
      <div className="top-bar">
        <div className="toggle-text">Sandbox</div>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
        <div className="toggle-text">Live</div>
      </div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
