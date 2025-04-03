import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from 'react-router-dom';
import Header from "./Header.jsx";
import "./css/DisplayEvents.css";
import { isAdminAuthenticated, Alogout } from "./services/Auth.js";
import { FaSearch } from "react-icons/fa"; // Import search icon

export default function DisplayEvents() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/events")
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
    }, []);

    if (!isAdminAuthenticated()) {
        return <Navigate to="/" />;
    }

    const logoutUser = () => {
        Alogout();
        navigate("/AdminLogin");
    };

    // Handle search when clicking icon
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
                                    <th>Coordinator</th>
                                    <th>Contact Number</th>
                                    <th>More Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map((event, index) => (
                                    <tr key={event._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                                        <td>{event.originalIndex}</td>
                                        <td>{event.name}</td>
                                        <td>{event.eventDate}</td>
                                        <td>{event.endDate}</td>
                                        <td>{event.nc}</td>
                                        <td>{event.num}</td>
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
