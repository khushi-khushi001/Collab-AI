

function RoomCard({title, onClick}) {
    return ( 
        <div className="dashboard-card" onClick={() => {
            onClick();
        }}
        style={{cursor: "pointer",
               background:"white",
               padding:"24px",
               borderRadius:"16px",
               border:"1px solid black"
        }}>

            <h3 >{title}</h3>
        </div>
     );
}

export default RoomCard;