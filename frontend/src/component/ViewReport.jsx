import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "./services/Auth";
import { getUserData } from "./services/storage";
import Header from "./Header";
import { FaSearch } from "react-icons/fa"; // Import search icon
import "./css/ViewReport.css";

export default function ViewReport() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]); // For search results

  useEffect(() => {

    const token = getUserData();
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    axios.get(`http://localhost:5000/events/${userId}`)
      .then((response) => {
        const indexedEvents = response.data.map((event, index) => ({
          ...event,
          originalIndex: index + 1,
        }));
        setEvents(indexedEvents);
        setFilteredEvents(indexedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [navigate]);

  if (!isAuthenticated()) {
    navigate("/Login");
    return;
  }

  const logoutUser = () => {
    logout();
    navigate("/Login");
  };

  // Handle search
  const handleSearch = () => {
    const filtered = events.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <>
      <Header logoutUser={logoutUser} />
      <div className="hii">
        <div className="container-view">
          <h2 className="title">Your Event Reports</h2>

          {/* Search Box */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter event name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" onClick={handleSearch} />
          </div>

          {filteredEvents.length === 0 ? (
            <p className="no-events">No events found</p>
          ) : (
            <table className="event-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Event Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Organised By</th>
                  <th>Theme</th>
                  <th>More Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr key={event.user_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                    <td>{event.originalIndex}</td>
                    <td>{event.name}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.endDate}</td>
                    <td>{event.organisedBy}</td>
                    <td>{event.theme}</td>
                    <td>
                      <a href={`http://localhost:5000/files/Event_Report_${event.Eid}.pdf`} target="_blank" rel="noopener noreferrer">
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
