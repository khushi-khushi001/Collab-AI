import { useState } from "react";
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";


function DashboardLayout({children , activePage}) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen((prev) => {
            return !prev;
        })
    }
    return ( 
        <div className="dashboard-layout">
            <Sidebar  activePage={activePage} isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <main className="dashboard-main">
                <Navbar toggleSidebar={toggleSidebar}  />
                {children}
            </main>
        </div>
     );
}

export default DashboardLayout;