import { useState,useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({toggleSidebar , isOpen}) {

    const navigate = useNavigate();
    const {user, logout} = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="dashboard-navbar">
            <div style={{display: "flex",
                gap:"12px", alignItems:"center"
            }}>
             <button
                 className="menu-btn"
                 onClick={toggleSidebar} 
                >
                 ☰
              </button>
                <h3 className="dashboard-user-title">Welcome {user?.name} </h3>
            </div>

            <div className="navbar-actions">
              <button className="logout-btn"
              style={{marginRight: "20px"}}
               onClick={handleLogout}>
                
                Logout
             </button>


              <button className="logout-btn"
                style={{
                    background: "white",
                    color: "black",
                    fontSize: "15px"
                }}
              onClick={() => navigate("/history")}>
              ⏱ History
              </button>
           </div>

           <div className="mobile-menu-wrapper">

            <button
                className="mobile-menu-btn"
                onClick={() => setShowMenu(!showMenu)}
                >
                ⋮
            </button>

         {showMenu && (
         <div className="mobile-dropdown">

            <button onClick={handleLogout}>
             Logout
            </button>

            <button onClick={() => navigate("/history")}>
                ⏱ History
            </button>

         </div>
         )}
         </div>
        </div>
    );
}

export default Navbar;