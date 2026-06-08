import { useNavigate } from "react-router-dom";


function Sidebar({activePage, isOpen, toggleSidebar}) {

    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);

        if(window.innerWidth <= 768){
            toggleSidebar();
        }
    }
    
    return ( 
        <aside className={`sidebar ${isOpen ? "show": ""}`}>
            
            <button className="sidebar-close-btn" onClick={toggleSidebar}>✕</button>

            <h2 className="sidebar-title">TeamSync</h2>

            <div className="sidebar-menu">
                <div className={`sidebar-item ${activePage === "dashboard" ? "active": ""}`}
                  onClick={() => handleNavigate("/dashboard")}>

                    Dashboard

                </div>

                <div className={`sidebar-item ${activePage === "meetings" ? "active": ""}`}
                 onClick={() => handleNavigate("/meetings")}>
                    
                    Meetings
                    
                </div>

                <div className="sidebar-item">Chat</div>

                <div className="sidebar-item">Whiteboard</div>


            </div>
        </aside>
     );
}

export default Sidebar;