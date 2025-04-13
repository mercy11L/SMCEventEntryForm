import React from "react";
import "./css/Login.css";
import { useState } from 'react';
import axios from 'axios';
import { Navigate,Link } from 'react-router-dom';
import { storeUserData } from "./services/storage";
import { isAuthenticated } from './services/Auth';
import Header from "./Header.jsx";

export default function Login() {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const initialStateErrors = {
        email: { required: false, invalid:false },
        password: { required: false ,length:false},
        custom_error: null
    };

    const [errors, setErrors] = useState(initialStateErrors);
    const [loading, setLoading] = useState(false);

    const handleInput = (event) => {
        const { name, value } = event.target;
    
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value
        }));
    
        // Clear the error when user starts typing
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: { required: false, same: false }, // Reset validation errors
            custom_error: null // Clear custom error too
        }));
    };
    
    //const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const handleSubmit = async (event) => {
        event.preventDefault();
        let errors = initialStateErrors;
        let hasError = false;

        if (inputs.password === "") {
            errors.password.required = true;
            hasError = true;
        }
        
        if (inputs.email === "") {
            errors.email.required = true;
            hasError = true;
        }
        else if (!emailRegex.test(inputs.email)) {
            errors.email.invalid = true;
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            const { email,password }=inputs;
            await axios.post("http://localhost:5000/Login",{email, password })  
            .then((response) => {
                console.log("Response:", response.data);
                storeUserData(response.data.token);
            })
            .catch((error) => {
                console.log("Login error:", error);
                if (error.response?.data?.message === "User details not found." || error.response?.data?.message === "Invalid password.") {
                    setErrors({...errors, custom_error:"Invalid User Credentials."});
                } else {
                    setErrors({...errors, custom_error:"Something went wrong."});
                }
            })
            .finally(() => {
                console.log("Login complete");
                setLoading(false);
            });            
        }
        else{
            setErrors({...errors}); 
        } 
    };

    if(isAuthenticated()){
            return <Navigate to="/"/>;
    }

    return (
        <>
        <Header/>
            <section className="register-block">
                <div className="container">
                    <div className="row ">
                        <div className="col register-sec">
                            <h2 className="text-center">Login</h2>
                            <form onSubmit={handleSubmit} className="register-form" action="">
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                    <input type="text" className="form-control" onChange={handleInput} name="email" />
                                    {errors.email.required && (<span className="text-danger">Email is required.</span>)}
                                    {errors.email.invalid ? (<span className="text-danger" >
                                    Invalid email format
                                </span>) : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                    <input className="form-control" type="password" onChange={handleInput} name="password" />
                                    {errors.password.required && (<span className="text-danger">Password is required.</span>)}
                                    
                                </div>
                                <div className="form-group">
                                    <span className="text-danger">
                                        {errors.custom_error && (<p>{errors.custom_error}</p>)}
                                    </span>
                                    {loading && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                {/* <span className="sr-only">Loading...</span> */}
                                            </div>
                                        </div>
                                    )}
                                    <input type="submit" className="btn btn-login float-right" disabled={loading} value="Login" />
                                </div>
                            </form>
                            <div className="form-group">
                                    <p>New User? <Link class="sp" to="/SignUp">SignUp here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
