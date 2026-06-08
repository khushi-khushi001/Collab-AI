import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import BackHandIcon from "@mui/icons-material/BackHand";

const ParticipantCard = ({user, muted, isHandRaised}) => {
   // console.log(user?.name, isHandRaised);

    return (
        <div className="dashboard-card">

            <h3>{user?.name || "Connected"} </h3>
            
            <div style={{
                display:"flex",
                alignItems:"center",
                gap:"8px",
                margin: "6px 0"
            }}>

                {muted ? (
                <MicOffIcon style={{color:"red"}} />
                 ) : (
                    <MicIcon style={{color:"green"}} />
                  )}

                 

                  {isHandRaised  && (
                    <BackHandIcon sx={{color: "#f4c430", fontSize:"20px"}} />
                  )}
            </div>

            
            
            
        </div>
      );
}

export default ParticipantCard;