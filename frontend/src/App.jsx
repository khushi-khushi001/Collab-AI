import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppRoutes from "./routes/Routes";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import MeetingsPage from "./pages/MeetingsPage";
import MeetingRoomPage from "./pages/MeetingRoomPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MeetingHistoryPage from "./pages/MeetingHistoryPage";
//import MeetingHistoryPage from "./pages/MeetingHistoryPage";
//import MeetingDetailsPage from "./pages/MeetingDetailsPage";


function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path="/" element={<SignupPage/>} />

      <Route path="/dashboard"
       element={
        <ProtectedRoute>
          <DashboardPage/>
        </ProtectedRoute>

       } />

      <Route path="/meetings" 
      element={
       < ProtectedRoute>
       <MeetingsPage/>
       </ProtectedRoute>
      } />

      <Route path="/meeting/:roomId" element={<MeetingRoomPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route  path="/history" element={<MeetingHistoryPage/>}/>
    </Routes>
    </BrowserRouter>
    );
}

export default App;