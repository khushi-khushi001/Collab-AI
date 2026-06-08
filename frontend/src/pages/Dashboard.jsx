import { useState } from "react";
import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardLayout from "../layouts/dashboardLayout";


function DashboardPage() {


    return ( 
        <DashboardLayout activePage="dashboard">



        <div className="dashboard-grid">
            <DashboardCard
              title="Meetings"
              value="4"
           />

            <DashboardCard
             title="Messages"
             value="12" 
            />

            <DashboardCard
             title="Projects"
             value="3"
           />

        </div>

        </DashboardLayout>
     );
}

export default DashboardPage;