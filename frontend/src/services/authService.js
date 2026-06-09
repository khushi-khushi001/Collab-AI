import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// signup
export const signupUser = async(userData) => {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);

    return response.data;
};

// login 
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, userData);
    console.log("api url:", `${API_URL}/api/auth/login`);
    return response.data;
};