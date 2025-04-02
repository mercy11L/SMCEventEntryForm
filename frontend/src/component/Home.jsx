import React, { useState, useEffect } from "react";
import { useNavigate,Link } from 'react-router-dom';
import "./css/Home.css";
import { isAdminAuthenticated,logout,Alogout } from './services/Auth';
import Header from "./Header.jsx";

export default function Home() {
    const images = [
        "/code_image/s1.jpg",
        "/code_image/s2.jpg",
        "/code_image/s3.jpg"
    ];
      const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const logoutUser= ()=>{
        if(isAdminAuthenticated()){
            Alogout();
            navigate("/AdminLogin")
        }
        else{
            logout();
            navigate("/Login")
        }
    }
    return (
        <>
            <Header logoutUser={logoutUser}/>
            <section className="home-section">
            <div className="carousel">
                {images.map((img, index) => (
                    <div 
                        key={index} 
                        className={`slide ${index === currentIndex ? "active" : ""}`}
                    >
                        <img src={img} alt={`Slide ${index + 1}`} />
                        <div className="overlay"></div>
                    </div>
                ))}
            </div>

            <div className="content">
                <h1>Event Registration and Report Generation System</h1>
                {!isAdminAuthenticated() && (
                    <>
                    <h2>Register for Events</h2>
                    <Link className="register-btn" to="/Form">Register</Link>
                    </>
                )}
                {isAdminAuthenticated() && (
                <>
                    <Link to="/dispEvents" className="register-btn">View Registered Events</Link>
                </>
                )}
            </div>

            <div className="dots">
                {images.map((_, index) => (
                    <input 
                        key={index} 
                        type="radio" 
                        name="carousel-dot" 
                        checked={index === currentIndex}
                        onChange={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </section>
        </>
        
    );
}
