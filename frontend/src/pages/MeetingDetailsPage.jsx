/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layouts/dashboardLayout";

function MeetingDetailsPage() {

    const {id} = useParams();

    const [meeting, setMeeting] = useState(null);

    useEffect(() => {
        fetchMeeting();
    }, []);

    const fetchMeeting = async () => {
    
            try {
                
                const response = await axios.get(`http://localhost:8000/api/meetings/${id}`);
    
                setMeeting(response.data);
    
            } catch (error) {
                
                console.log(error);
            }
        }

        if(!meeting) {
            return <h3>Loading...</h3>
        }

    return ( 
        <DashboardLayout>

            <h2>Meeting Details</h2>

                    <p>
                        <strong>Room ID:</strong>
                        {""}
                        {meeting.roomId}
                    </p>

                    <p>
                        <strong>Host:</strong>
                        {" "}
                        {meeting.hostName}
                    </p>

                    <p>
                        <strong>Duration:</strong>
                        {""}
                        {meeting.duration || 0}
                        {" "}seconds
                    </p>

                    <p>
                        <strong>Participants:</strong>
                        {""}
                        {meeting.participants?.join(",")}
                    </p>

                    <p>
                        <strong>Summary:</strong>
                        {""}
                        {meeting.summary || "No summary"}
                        
                    </p>
                
            
        </DashboardLayout>
     );
}

export default MeetingDetailsPage;*/