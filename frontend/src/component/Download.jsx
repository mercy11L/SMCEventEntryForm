import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated } from "./services/Auth"; 
import { useState } from "react";
import axios from "axios";
import Header from "./Header.jsx";
import { logout } from "./services/Auth";
import  "./css/download.css";

const Download = () => {
  const location = useLocation();
  const eventId = location.state?.eventId;
  const navigate = useNavigate();
  const [loadingDocx, setLoadingDocx] = useState(false);

  const handleNav=()=>{
    navigate("/ViewReport")
  }
  const handleDownload = async () => {
    setLoadingDocx(true);

  try {
    const response = await axios.get(
      `http://localhost:5000/download/${eventId}`,
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Event_Report.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("File downloaded successfully");
  } catch (error) {
    console.error("Error downloading file: ", error);
  }
    setLoadingDocx(false);
};


  if (!isAuthenticated()) {
    return <Navigate to="/Login" />;
  }

  if (!eventId) {
    return <Navigate to="/" replace />
  }

  const logoutUser = () => {
    logout();
    navigate("/Login");
  };

  return (
    <>
  <Header logoutUser={logoutUser} />
  <div className="outer">
  <div className="container download-container">
    <div className="card download-card">
      <h4 className="card-title">Download Event Report</h4>
      <p className="event-id">
        <strong>Event ID:</strong> {eventId}
      </p>
      <button
  className="btn btn-outline-primary download-btn"
  disabled={loadingDocx}
  onClick={() => handleDownload("docx")}
>
  {loadingDocx ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
  Download Word Report
</button>

<button
  className="btn btn-primary download-btn"
  onClick={handleNav}>
  {loadingDocx ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
  View your past Generated Report
</button>
    </div>
  </div>
  </div>
</>


  );
};

export default Download;
