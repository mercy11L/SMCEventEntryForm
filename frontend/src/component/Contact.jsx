import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './css/Contact.css';
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    Name: '',
    DeptName: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error when typing
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.Name.trim()) newErrors.Name = 'Name is required';
    if (!formData.DeptName.trim()) newErrors.DeptName = 'Department Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      axios.post('http://localhost:5000/contact', formData)
        .then((response) => {
          alert('Form submitted successfully!');
          navigate("/");
          setFormData({ Name: '', DeptName: '', email: '', mobile: '', message: '' });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <div className="contact-box">
          {/* Contact Info Section */}
          <div className="contact-info">
            <h2>Contact Info</h2>
            <p>17, Cathedral Road, Chennai, TamilNadu, India</p>
            <p>vpofficesmc@gmail.com</p>
            <p>04428110121</p>
          </div>
          {/* Contact Form Section */}
          <div className="contact-form">
            <h2>Send your Query</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div>
                  <input
                    type="text"
                    name="Name"
                    placeholder="Enter your Name"
                    value={formData.Name}
                    onChange={handleChange}
                  />
                  {errors.Name && <p className="error-text">{errors.Name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="DeptName"
                    placeholder="Department Name"
                    value={formData.DeptName}
                    onChange={handleChange}
                  />
                  {errors.DeptName && <p className="error-text">{errors.DeptName}</p>}
                </div>
              </div>
              <div className="input-group">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <p className="error-text">{errors.mobile}</p>}
                </div>
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <p className="error-text">{errors.message}</p>}
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;