// src/services/authService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3202'; 


//SIGN-UP
export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { email, password });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

//LOGIN
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
