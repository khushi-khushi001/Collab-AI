
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/dashboardLayout";
import { useNavigate } from "react-router-dom";

function MeetingHistoryPage() {

    const navigate = useNavigate();

    const [meetings, setMeetings] = useState([]);

    useEffect(() => {

        fetchMeetings();

    }, []);

    const fetchMeetings = async () => {

        try {
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/meetings/history`);

            setMeetings(response.data);

        } catch (error) {
            
            console.log(error);
        }
    }
    return ( 
        <div className="history-container">

            <h2 className="history-box">Meeting History</h2>

           {meetings.length === 0 ? (
            <p>No meetings found</p>
           ): (
            meetings.map((m, index) => (
                <div key={index} className="meeting-card">

                    

                    <div className="meeting-header">

                        <h3>Room ID: {m.roomId}</h3>
                        <span>
                            {new Date(m.createdAt).toLocaleString()}
                        </span>
                    </div>

                    <div className="summary-box">
                        <pre>{m.summary}</pre>
                    </div>

                </div>
            ))
           )}
        </div>
     );
}

export default MeetingHistoryPage;