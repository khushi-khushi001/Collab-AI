import { useNavigate } from "react-router-dom";
import RoomCard from "../components/meeting/RoomCard";
import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardLayout from "../layouts/dashboardLayout";
import JoinRoomForm from "../components/meeting/JoinRoomForm";


function MeetingsPage() {

    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = crypto.randomUUID();

        navigate(`/meeting/${roomId}`);
    };

    const joinRoom = (roomId) => {
        navigate(`/meeting/${roomId}`);
    };

    return ( 
        <DashboardLayout activePage="meetings">

        <div className="dashboard-grid">
            <RoomCard title="Create New Meeting"
            onClick={createRoom} />
        </div>

        <div style={{marginTop:"20px"}}>
            <JoinRoomForm onJoin={joinRoom} />
        </div>


        </DashboardLayout>
     );
}

export default MeetingsPage;