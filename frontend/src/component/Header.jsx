import "./css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated,isAdminAuthenticated,logout, Alogout } from './services/Auth';

export default function Header(props) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/code_image/s_logo.png" alt="Logo" className="header-logo" />
        </div>
        <div><h2>STELLA MARIS COLLEGE (Autonomous)</h2></div>
        <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
          <Link to="/About" className="nav-link">About</Link>
          {/* <Link to="/services" className="nav-link">Services</Link> */}
          <Link to="/contact" className="nav-link">Contact</Link>
          {!isAuthenticated() && !isAdminAuthenticated() ? (
                <>
                    <Link to="/Login" className="nav-link">Login</Link>
                    <Link to="/AdminLogin" className="nav-link">Admin Login</Link>
                </>
            ) : null}
            {isAuthenticated() ? (
                <li onClick={logout} className="nav-link" style={{ cursor: "pointer" }}>Logout</li>
            ) : null}
             {isAdminAuthenticated() ? (
                <>
                    <li onClick={Alogout} className="nav-link" style={{ cursor: "pointer" }}>Logout</li>
                </>
            ) : null}
            {!isAuthenticated() && !isAdminAuthenticated() ? (
                <Link to="/SignUp" className="nav-link">SignUp</Link>
            ) : null}
        </nav>
      </div>
    </header>
  );
}

