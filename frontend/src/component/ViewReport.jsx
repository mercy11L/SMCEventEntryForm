import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isAuthenticated,logout } from "./services/Auth";
import { getUserData } from "./services/storage";
import Header from "./Header";
import "./css/ViewReport.css";

export default function ViewReport() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/Login");
      return;
    }

    const token = getUserData();
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    axios.get(`http://localhost:5000/events/${userId}`)
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, [navigate]);

  const logoutUser = () => {
      logout();
      navigate("/Login");
    };
  
    return (
      <>
        <Header logoutUser={logoutUser} />
      <div className="hi"> 
      <div className="container-view">
        <h2 className="title">Your Event Reports</h2>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : events.length === 0 ? (
          <p className="no-events">No events found</p>
        ) : (
          <table className="event-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Organised By</th>
                <th>Theme</th>
                <th>More Info</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{event.name}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.endDate}</td>
                  <td>{event.organisedBy}</td>
                  <td>{event.theme}</td>
                  <td>
                  <a href={`http://localhost:5000/files/Event_Report_${event._id}.pdf`} target="_blank" rel="noopener noreferrer">
                  View Details
                  </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </>
  );
}
