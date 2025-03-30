import React, { useState } from "react";
import axios from 'axios';
import "./css/form.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {Navigate,useNavigate } from 'react-router-dom';
import { isAuthenticated } from "./services/Auth"; 
import Header from "./Header.jsx";
import { logout } from "./services/Auth";
import Select from 'react-select';
import { clubs, units, departments,centres,categories,themes } from "./utils/data.js";
import { getUserData } from "./services/storage.js";
import { jwtDecode } from "jwt-decode";

export default function Form() {
  const [subSuccess, setSubSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [formData, setFormData] = useState({
    user_id:"",
    num: "",
    nc: "",
    name:"",
    lvl: "",
    mode: "",
    eventDate: "",
    endDate: "",
    organisedBy: "",
    selectedOptions: [],
    sc:"",
    isOrganised: "",
    nofpart:"",
    theme:"",
    categories:[],
    desc:"",
    obj:"",
    outcome:"",
    geo:[],
    geocap:"",
    signcap:"",
    invite: [],
    ptlist: [],
    signature: "",
  });

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], 
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'], 
      //['link', 'image'], 
      [{ 'align': [] }],
      ['clean']
    ]
  }

  const validate = () => {
    let newErrors = {};
    if (!formData.num.match(/^\d{10}$/)) {
      newErrors.num = "Enter a valid 10-digit phone number";
    }
    if (!formData.nofpart.match(/^\d+$/)) {
      newErrors.nofpart = "Please provide valid count";
    }
    if (!formData.name) newErrors.name = "Please enter the name";
    if (!formData.lvl) newErrors.lvl = "Please select an event level";
    if (!formData.mode) newErrors.mode = "Please select a mode";
    if (!formData.eventDate) newErrors.eventDate = "Please select the start date of the event";
    if (!formData.isOrganised) newErrors.isOrganised = "Please select Yes or No";
    if (!formData.nofpart) newErrors.nofpart = "Please provide no. of participants";
    if (!formData.theme) newErrors.theme = "Please enter the theme of the event";
    if (!formData.nc) newErrors.nc = "Please Enter the name of the event Coordinator";
    if (!formData.endDate) newErrors.endDate = "Please enter the end date of the event";
    if (!formData.sc.trim()) newErrors.sc = "Enter special considerations";
    
    if (!formData.organisedBy) {
      newErrors.organisedBy = "Please select an organizing group";
    }
    if (formData.organisedBy === "departments" && formData.selectedOptions.length === 0) {
      newErrors.departments = "Please select at least one department";
  }
  if (formData.organisedBy === "centres" && formData.selectedOptions.length === 0) {
      newErrors.centres = "Please select at least one centre";
  }
  if (formData.organisedBy === "Clubs" && formData.selectedOptions.length === 0) {
      newErrors.clubs = "Please select at least one club";
  }
  if (formData.organisedBy === "Units" && formData.selectedOptions.length === 0) {
      newErrors.units = "Please select at least one unit";
  }

    if (!formData.obj) newErrors.obj = "Please provide the Objectives of the event";
    if (!formData.desc) newErrors.desc = "Please provide the Description of the event";
    if (!formData.outcome) newErrors.outcome = "Please provide the Outcome of the event";

    if (!formData.categories || formData.categories.length === 0) newErrors.categories = "Please select atleast one category";
    if (!formData.theme) newErrors.theme = "Please select the Theme of the Event";

    if (!formData.invite || formData.invite.length === 0) newErrors.invite = "Please upload at least one invite file";
    if (!formData.ptlist || formData.ptlist.length === 0) newErrors.ptlist = "Please upload at least one participant list file";
    if (!formData.geo || formData.geo.length === 0) newErrors.geo = "Please upload at least one Geotagged file";
    if (!formData.geocap) newErrors.geocap = "Please provide captions for the geotagged pictures";
    if (!formData.signature || formData.signature.length === 0) newErrors.signature = "Please upload signature file";
    if (!formData.signcap) newErrors.signcap = "Please menton the description of the signature";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
        ...prevData,
        [name]: files ? [...files] : value,
    }));

    // Remove error for the updated field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],  
  }));
};


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const token = getUserData();
    const decoded = jwtDecode(token);
    formData.user_id = decoded.id;
    //console.log(formData.user_id);
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === "selectedOptions" || key === "categories") {
          data.append(key, JSON.stringify(formData[key]));  // Convert array to JSON string
        }
        if (Array.isArray(formData[key])) {
            // Append each file individually
            formData[key].forEach((file, index) => {
                if (file instanceof File) {
                    data.append(key, file);
                }
            });
        } else {
            data.append(key, formData[key]);
        }
      }
      
      console.log("FormData Entries:");
        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }

      const response = await axios.post("http://localhost:5000/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setEventId(response.data.id);
      if (response.data.message.includes("success")) {
        setSubSuccess(true);
        navigate("/Download", { state: { eventId: response.data.id } });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setLoading(false);
  };


const handleDynamicUpdate = (e) => {
  const { name, value } = e.target;

  setFormData((prevData) => ({
    ...prevData,
    [name]: value,  // Update organisedBy
    selectedOptions: [], // Reset selected options when category changes
  }));

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "", // Remove error when a valid selection is made
  }));
};

const handleSelectChange = (name) => (selectedOptions) => {
  const labelsArray = selectedOptions.map(option => option.label);
  setFormData((prevData) => ({
    ...prevData,
    [name]: labelsArray,
  }));
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: selectedOptions.length ? "" : prevErrors[name],
  }));
};


const handleThemeChange = (selectedOption) => {   
  console.log(selectedOption);  
  setFormData((prevData) => ({     
    ...prevData,     
    theme: selectedOption.label, // Store only the label
  }));  

  setErrors((prevErrors) => ({     
    ...prevErrors,     
    theme: selectedOption ? "" : prevErrors.theme,  
  }));  
};


  if(!isAuthenticated()){
    return <Navigate to="/Login"/>;
  }

  const logoutUser= ()=>{
          logout();
          navigate("/Login");
  }
  return (
    <>
      <Header logoutUser={logoutUser}/>
      <div className="form-container">
      <form onSubmit={handleSubmit}>
      <div className="form-row">
      <div className="form-group">
          <label htmlFor="name">Name of the Event</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="eventDate">Start Date of the Event</label>
          <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} className="form-input" />
          {errors.eventDate && <p className="error-message">{errors.eventDate}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date of the Event</label>
          <input type="date" id="endDate" name="endDate" min={formData.eventDate || ""} value={formData.endDate} onChange={handleChange} className="form-input" />
          {errors.endDate && <p className="error-message">{errors.endDate}</p>}
        </div>
        </div>
        <div className="form-row">
          
        <div className="form-group">
          <label htmlFor="lvl">Event Level</label>
          <select id="lvl" name="lvl" value={formData.lvl} onChange={handleChange} className="form-select">
            <option value="" disabled>Select an option</option>
            <option>International</option>
            <option>National</option>
            <option>State</option>
            <option>Regional</option>
            <option>Institutional</option>
            <option>Departmental</option>
          </select>
          {errors.lvl && <p className="error-message">{errors.lvl}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="mode">Mode of Event</label>
          <select id="mode" name="mode" value={formData.mode} onChange={handleChange} className="form-select">
            <option value="" disabled>Select an option</option>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>
          {errors.mode && <p className="error-message">{errors.mode}</p>}
        </div>
        </div>  
        <div className="form-row">
      <div className="form-group">
          <label htmlFor="nc">Name of the Event Coordinator</label>
          <input type="text" id="nc" name="nc" value={formData.nc} onChange={handleChange} className="form-input" />
          {errors.nc && <p className="error-message">{errors.nc}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="num">Contact Number of the Event Coordinator</label>
          <input type="text" id="num" name="num" value={formData.num} onChange={handleChange} className="form-input" />
          {errors.num && <p className="error-message">{errors.num}</p>}
        </div>
        </div>
        
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="nofpart">Number of Participants</label>
          <input type="text" id="nofpart" name="nofpart" value={formData.nofpart} onChange={handleChange} className="form-input" />
          {errors.nofpart && <p className="error-message">{errors.nofpart}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="sc">Special Considerations</label>
          <input 
  type="text" 
  id="sc" 
  name="sc" 
  value={formData.sc} 
  onChange={handleChange} 
  className="form-input"
/>
          {errors.sc && <p className="error-message">{errors.sc}</p>}
        </div>
        </div>
        <div className="form-group">
        <label htmlFor="organisedBy">The Event Organised By</label>
        <select 
  name="organisedBy" 
  className="form-select" 
  value={formData.organisedBy}
  onChange={handleDynamicUpdate}>
  <option value="" disabled>Select an option</option>
  <option value="Departments">Departments</option>
  <option value="Centres">Centres</option>
  <option value="Clubs">Clubs</option>
  <option value="Units">Units</option>
</select>
{errors.organisedBy && <p className="error-message">{errors.organisedBy}</p>}
        </div>
        {formData.organisedBy === "Departments" && (
          
        <div className="form-group">
        <label>Select the organising Department(s)</label>
        <Select
        options={departments}
        isMulti
        closeMenuOnSelect={false}
        onChange={handleSelectChange("selectedOptions")}
        value={formData.selectedOptions.map(label => ({ label, value: label}))}
        placeholder="Choose Departments..."
        className="basic-multi-select"
        id="form-select" 
        classNamePrefix="select"
        />
          {errors.departments && <p className="error-message">{errors.departments}</p>}
        </div>)}
        {formData.organisedBy === "Centres" && (
        <div className="form-group">
        <label>Select the organising Centre(s)</label>
        <Select
        options={centres}
        isMulti
        id="form-select"
        closeMenuOnSelect={false}
        onChange={handleSelectChange("selectedOptions")}
        value={formData.selectedOptions.map(label => ({ label, value: label}))}
        placeholder="Choose Centres..."
        className="basic-multi-select"
        classNamePrefix="select"
        />
        {errors.centres && <p className="error-message">{errors.centres}</p>}
        </div>)}
        {formData.organisedBy === "Clubs" && (
        <div className="form-group">
        <label>Select the organising Club(s)</label>
        <Select
        options={clubs}
        isMulti
        id="form-select"
        closeMenuOnSelect={false}
        onChange={handleSelectChange("selectedOptions")}
        value={formData.selectedOptions.map(label => ({ label, value: label}))}
        placeholder="Choose Clubs..."
        className="basic-multi-select"
        classNamePrefix="select"
        />
          {errors.clubs && <p className="error-message">{errors.clubs}</p>}
        </div>)}
        {formData.organisedBy === "Units" && (
        <div className="form-group">
        <label>Select the organising Unit(s)</label>
        <Select
        options={units}
        id="form-select"
        isMulti
        closeMenuOnSelect={false}
        onChange={handleSelectChange("selectedOptions")}
        value={formData.selectedOptions.map(label => ({ label, value: label}))}
        placeholder="Choose Units..."
        className="basic-multi-select"
        classNamePrefix="select"
        />
          {errors.units && <p className="error-message">{errors.units}</p>}
        </div>)}
        
        <div className="form-group">
        <label>Select the Categories</label>
        <Select
        id="form-select"
        closeMenuOnSelect={false}
        options={categories}
        isMulti
        value={categories.filter(option => formData.categories.includes(option.label))}
        onChange={handleSelectChange("categories")}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select categories..."
      />
      {errors.categories && <p className="error-message">{errors.categories}</p>}
      </div>
      <div className="form-row">
      <div className="form-group">
          <label>Is the event organised by the Institution?</label>
          <div className="form-radio-group">
          <label><input type="radio" name="isOrganised" value="yes" checked={formData.isOrganised === 'yes'} onChange={handleChange} />
          Yes</label>
          <label>
          <input type="radio" name="isOrganised" value="no" checked={formData.isOrganised === 'no'} onChange={handleChange} />
          No</label>
          </div>
          {errors.isOrganised && <p className="error-message">{errors.isOrganised}</p>}
        </div>
      <div className="form-group">
      <label>Select the Theme of the Event</label>
      <Select
        options={themes}
        value={themes.find(option => option.label === formData.theme) || null}
        onChange={handleThemeChange}
        className="basic-single"
        classNamePrefix="select"
        placeholder="Select the Theme..."
      />
      {errors.theme && <p className="error-message">{errors.theme}</p>}
    </div>
    </div>
        <div className="form-group">
          <label htmlFor="obj">Objective of the Event</label>
          {/* <textarea type="text" id="obj" name="obj" value={formData.obj} onChange={(e) => setFormData({ ...formData, obj: e.target.value })} className="form-input"></textarea> */}
          <ReactQuill value={formData.obj} modules={quillModules} 
          onChange={(value) => {
            setFormData({ ...formData, obj: value });
            setErrors((prevErrors) => ({
              ...prevErrors,
              obj: value ? "" : prevErrors.obj,
            })
            )}} />          
          {errors.obj && <p className="error-message">{errors.obj}</p>}
        </div>
            
        <div className="form-group">
          <label htmlFor="desc">Description of the Event</label>
          <ReactQuill value={formData.desc} modules={quillModules} 
          onChange={(value) => {
            setFormData({ ...formData, desc: value });
            setErrors((prevErrors) => ({
              ...prevErrors,
              desc: value ? "" : prevErrors.desc,
            })
            )}} />
          {errors.desc && <p className="error-message">{errors.desc}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="outcome">Outcome of the Event</label>
          <ReactQuill value={formData.outcome} modules={quillModules} 
          onChange={(value) => {
            setFormData({ ...formData, outcome: value });
            setErrors((prevErrors) => ({
              ...prevErrors,
              outcome: value ? "" : prevErrors.outcome,
            })
            )}} /> 
          {errors.outcome && <p className="error-message">{errors.outcome}</p>}
        </div>

        <div className="form-group">
          <label>Upload Invitation</label>
          {/* <input type="file" name="invite" multiple onChange={(e) => saveFile(e, 'invite')} className="form-file" /> */}
          <input type="file" name="invite" multiple onChange={handleChange} className="form-file" />
          {errors.invite && <p className="error-message">{errors.invite}</p>}
          {/* {renderFileList} */}
        </div>

          <div className="form-group">
            <label>Upload Geo-tagged pictures</label>
            <input type="file" name="geo" multiple onChange={handleChange} className="form-file" />
            {errors.geo && <p className="error-message">{errors.geo}</p>}
          </div>

          <div className="form-group">
            <label>Captions for Geo-tagged pictures<small><p>Please provide captions for the geo-tagged pictures in the same order as uploaded, separated by commas. If a picture has no caption, leave it blank</p></small></label>
            <input type="text" name="geocap" onChange={handleChange} className="form-file" />
            {errors.geocap && <p className="error-message">{errors.geocap}</p>}
          </div>

        <div className="form-group">
          <label>Upload Participation List</label>
          <input type="file" name="ptlist"  multiple onChange={handleChange} className="form-file" />
          {errors.ptlist && <p className="error-message">{errors.ptlist}</p>}
        </div>

        <div className="form-group">
          <label>Upload Signature</label>
          <input type="file" name="signature" onChange={handleChange} className="form-file" />
          {errors.signature && <p className="error-message">{errors.signature}</p>}
        </div>

        <div className="form-group">
            <label>Description of the Signature uploaded<small>Eg: Name, department, ..</small></label>
            <input type="text" name="signcap" onChange={handleChange} className="form-file" />
            {errors.signcap && <p className="error-message">{errors.signcap}</p>}
          </div>
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            {/* <span className="sr-only">Loading...</span> */}
          </div>
        </div>
      )}
      <button type="submit" className="form-submit" disabled={loading}>Submit</button>
      </form>
      </div>
    </>
    
  );
}