import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        {/* Clicking Logo -> Home */}
        <Link to="/">
          <img src="/code_image/s_logo.png" alt="Stella Maris College Logo" className="college-logo" />
        </Link>

        {/* Clicking Text -> About Page */}
        <Link to="/About" className="college-name">
          STELLA MARIS COLLEGE (Autonomous)
        </Link>
      </div>

      <div className="footer-center">
        <p>© Copyright Stella Maris College (17, Cathedral Road, Chennai - 600086)</p>
      </div>

      <div className="social-icons">
        <a href="https://www.facebook.com"  target="_blank" rel="noopener noreferrer">
          <img src="/code_image/facebook.png" className="f" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com"  target="_blank" rel="noopener noreferrer">
          <img src="/code_image/Instagram Logo.png" className="i" alt="Instagram" />
        </a>
        <a href="https://www.youtube.com"  target="_blank" rel="noopener noreferrer">
          <img src="/code_image/Youtube Logo.png" className="y" alt="YouTube" />
        </a>
        <a href="https://twitter.com"  target="_blank" rel="noopener noreferrer">
          <img src="/code_image/TWITTER_NEW.jpg" className="t" alt="Twitter" />
        </a>
      </div>
    </footer>
  );
}
