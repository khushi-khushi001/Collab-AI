import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// signup
export const signupUser = async(userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);

    return response.data;
};

// login 
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);

    return response.data;
};