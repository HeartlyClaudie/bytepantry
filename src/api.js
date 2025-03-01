import axios from "axios";

// Load environment variables
const API_URL = process.env.REACT_APP_API_URL || "http://bytepantry-api-hjbkd7hxfbasg7h8.canadacentral-01.azurewebsites.net";
const AUTH_KEY = process.env.REACT_APP_AUTH_KEY || "";

// Create Axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: AUTH_KEY ? `Bearer ${AUTH_KEY}` : "",
  },
});

// Fetch all pantry items
export const getPantryItems = async () => {
  try {
    const response = await api.get("/pantry");
    return response.data;
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    throw error;
  }
};

// Add a new pantry item
export const addPantryItem = async (item) => {
  try {
    const response = await api.post("/pantry", item);
    return response.data;
  } catch (error) {
    console.error("Error adding pantry item:", error);
    throw error;
  }
};

// Update an existing pantry item
export const updatePantryItem = async (id, item) => {
  try {
    const response = await api.put(`/pantry/${id}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error updating pantry item ${id}:`, error);
    throw error;
  }
};

// Delete a pantry item
export const deletePantryItem = async (id) => {
  try {
    await api.delete(`/pantry/${id}`);
  } catch (error) {
    console.error(`Error deleting pantry item ${id}:`, error);
    throw error;
  }
};

// Fetch a single pantry item by ID
export const getPantryItemById = async (id) => {
  try {
    const response = await api.get(`/pantry/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pantry item ${id}:`, error);
    throw error;
  }
};

// Export default API instance
export default api;
