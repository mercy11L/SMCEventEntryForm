import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/DisplayEvents.css"; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';
import { Alogout } from './services/Auth';
import Header from "./Header.jsx";

export default function DisplayEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/events")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    const logoutUser= ()=>{
            Alogout();
            navigate("/")
        }

    return (
        <>
        <Header logoutUser={logoutUser}/>
        <div className="events-container">
            <h2>Event Details</h2>
            <div className="grid-container">
                {events.map(event => (
                    <div key={event._id} className="event-card">
                        <h3>{event.name}</h3>
                        <p><strong>Start Date:</strong> {event.eventDate}</p>
                        <p><strong>End Date:</strong> {event.endDate}</p>
                        <p><strong>Coordinator:</strong> {event.nc}</p>
                        <p><strong>Contact:</strong> {event.num}</p>
                        <a href={`/files/Event_Report_${event._id}.docx`} target="_blank" rel="noopener noreferrer">
                            📄 View Report
                        </a>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
