import './css/SignUp.css';
import { useState } from 'react';
import axios from 'axios';
import { Link,Navigate } from 'react-router-dom';
import { storeUserData } from './services/storage';
import { isAuthenticated } from './services/Auth';
import Header from "./Header.jsx";

export default function SignUp() {

const [inputs,setInputs] = useState({
        name:"",
        email:"",
        password:"",
        cpassword:""
});
    
const initialStateErrors={
    email:{required:false, invalid:false},
        password:{required:false, length:false},
        cpassword:{required:false , same:false},
        name:{required:false},
        custom_error:null
};

const [errors,setErrors] = useState(initialStateErrors);

const [loading,setLoading]  =  useState(false);

const handleInput = (event) => {
    const { name, value } = event.target;

    setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value
    }));

    // clear error when user starts typing
    setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: { required: false, same: false }, // reset validation errors
        custom_error: null // clear custom error too
    }));
};

//const navigate = useNavigate();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const handleSubmit=async (event)=> {
    event.preventDefault();
    let errors= initialStateErrors;
    let hasError=false;
    if(inputs.name===""){
        errors.name.required=true;
        hasError=true;
    }
    if(inputs.email===""){
        errors.email.required=true;
        hasError=true;
    }
    else if (!emailRegex.test(inputs.email)) {
        errors.email.invalid = true;
        hasError = true;
    }
    if(inputs.password===""){
        errors.password.required=true;
        hasError=true;
    }
    if (inputs.password.length <= 5) {
        errors.password.length = true;
        hasError = true;
    }
    if(inputs.cpassword===""){
        errors.cpassword.required=true;
        hasError=true;
    }
    else{
        if(inputs.password!==inputs.cpassword){
            errors.cpassword.same=true;
            hasError=true;
        }
    }
    if (!hasError) {
        setLoading(true);
        const { name,email,password }=inputs;
        await axios.post("http://localhost:5000/SignUp", {name,email,password} )  
        .then((response) => {
            storeUserData(response.data.token);
        })
        .catch((error) => {
            //setErrors({ custom_error: error.response?.data.message || "Something went wrong" });
            if(error.response.data.message==="User already exists."){
                setErrors({...errors,custom_error:"Already this email has been registered!"});
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }
    else{
        setErrors({...errors}); 
    }       
}
if(isAuthenticated()){
    return <Navigate to="/"/>;
}

    return(
    <>
    <Header/>
    <section className="register-block">
            <div className="container">
               <div className="row ">
                  <div className="col register-sec">
                     <h2 className="text-center">Register Now</h2>
                     <form onSubmit={handleSubmit} className="register-form" action="" >
                      <div className="form-group">
                        <label htmlFor="exampleInputName1" className="text-uppercase">Name</label>
          
                        <input type="text" className="form-control" onChange={handleInput} name="name" id=""  />
                        { errors.name.required ? (<span className="text-danger" >
                            Name is required.
                        </span>) : null}
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1" className="text-uppercase" >Email</label>
          
                        <input type="text"  className="form-control" name="email" onChange={handleInput} id="" />
                        {errors.email.required ? (<span className="text-danger" >
                            Email is required.
                        </span>) : null}
                        {errors.email.invalid ? (<span className="text-danger" >
                            Invalid email format
                        </span>) : null}
                     </div>
                     <div className="form-group">
                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                        <input  className="form-control" type="password" onChange={handleInput} name="password" id=""/>
                        {errors.password.required?(<span className="text-danger" >
                            Password is required.
                        </span>):null}
                        {errors.password.length?(<span className="text-danger" >
                            Password must be greater than 5 characters
                        </span>):null}
                     </div>
                     <div className="form-group">
                        <label htmlFor="exampleInputcPassword1" className="text-uppercase">Confirm Password</label>
                        <input  className="form-control" type="password"  onChange={handleInput} name="cpassword" id=""/>
                        {errors.cpassword.required?(<span className="text-danger" >
                            Confirm Password is required.
                        </span>):null}
                        {errors.cpassword.same?(<span className="text-danger" >
                            Password does not matched.
                        </span>):null}
                     </div>
                     <div className="form-group">
          
                     <span className="text-danger" >
                            { errors.custom_error?
                            (<p>{errors.custom_error}</p>)
                            :null
                            }
                            </span>
                        { loading?<div  className="text-center">
                          <div className="spinner-border text-primary " role="status">
                            {/* <span className="sr-only">Loading...</span> */}
                          </div>
                        </div>:null}
          
                        <input type="submit" className="btn btn-login float-right"  disabled={loading} value="Register"/>
                     </div>
                     <div className="clearfix"></div>
                     <div className="form-group">
                       <p>Already have account ? Please <Link class="sp" to="/Login">Login</Link></p>
                     </div>
                     </form>
                  </div>
          
               </div>
            </div>
    </section>
    </>
    );
}