// utils/fetchEvent.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getevent`); // use correct endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};