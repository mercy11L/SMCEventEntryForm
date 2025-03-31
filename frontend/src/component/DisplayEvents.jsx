import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Header from "./Header.jsx";
import "./css/ViewReport.css";

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

    return (
        <>
        <Header />
        <div className="hi"> 
        <div className="container-view">
            <h2 className="title">Your Event Reports</h2>
            {events.length === 0 ? (
                <p className="no-events">No events found</p>
            ) : (
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Coordinator</th>
                            <th>Contact Number</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={event._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
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
