import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
    return ( 
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginPage />}></Route>

            <Route path='/signup' element={<SignupPage />}/>

            <Route path='/dashboard' element={
                <ProtectedRoute>
                    <DashboardPage/>
                </ProtectedRoute>
               }/>
        </Routes>
        </BrowserRouter>
     );
}


export default AppRoutes;