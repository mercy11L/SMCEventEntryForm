import React, { useState } from "react";
import "./css/Login.css";
import axios from "axios";
import {Navigate, useNavigate, Link } from "react-router-dom";
import { storeAdminData } from "./services/storage";
import { isAuthenticated, Alogout, isAdminAuthenticated } from "./services/Auth";
import Header from "./Header.jsx";

export default function AdminLogin() {
    const [inputs, setInputs] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: false, password: false, custom_error: null });
    const [loading, setLoading] = useState(false);
    const navigate= useNavigate();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
        setErrors({ ...errors, [name]: false, custom_error: null });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let hasError = false;
        let newErrors = { email: false, password: false, custom_error: null };

        if (!inputs.email) { newErrors.email = true; hasError = true; }
        if (!inputs.password) { newErrors.password = true; hasError = true; }
        
        if (!hasError) {
            setLoading(true);
            try {
                const response = await axios.post("http://localhost:5000/AdminLogin", inputs);
                storeAdminData(response.data.token);
            } catch (error) {
                newErrors.custom_error = error.response?.data.message || "Invalid Admin Credentials.";
            } finally {
                setLoading(false);
            }
        }
        setErrors(newErrors);
    };

    if (isAuthenticated() || isAdminAuthenticated()) {
        return <Navigate to="/" />;
    }

    const logoutUser= ()=>{
        Alogout();
        navigate("/AdminLogin");
    }
    return (
          <>
            <Header logoutUser={logoutUser}/>
            <section className="register-block">
                <div className="container">
                    <div className="row">
                        <div className="col register-sec">
                            <h2 className="text-center">Admin Login</h2>
                            <form onSubmit={handleSubmit} className="register-form">
                                <div className="form-group">
                                    <label  className="text-uppercase" >Email</label>
                                    <input type="text" className="form-control" onChange={handleInput} name="email" />
                                    {errors.email && <span className="text-danger">Email is required.</span>}
                                </div>
                                <div className="form-group">
                                    <label  className="text-uppercase">Password</label>
                                    <input type="password" className="form-control" onChange={handleInput} name="password" />
                                    {errors.password && <span className="text-danger">Password is required.</span>}
                                </div>
                                <div className="form-group">
                                    {errors.custom_error && <span className="text-danger">{errors.custom_error}</span>}
                                    {loading && <div className="spinner-border text-primary" role="status"></div>}
                                    <input type="submit" className="btn btn-login float-right" disabled={loading} value="Login" />
                                </div>
                            </form>
                            <div className="form-group">
                                <p>Not an admin? <Link to="/login">Login here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
