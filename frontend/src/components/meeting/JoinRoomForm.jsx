import { useState } from "react";


function JoinRoomForm({onJoin}) {

    const [roomId, setRoomId] = useState("");

    const handlesubmit = (e) => {
        e.preventDefault();

        onJoin(roomId);
    }
    return (  
        <form onSubmit={handlesubmit}>

            <input className="primary-input"
            placeholder="Enter Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)} /> <br /><br />

            <button className="logout-btn" type="submit"> Join Room </button>
        </form>
    );
}

export default JoinRoomForm;