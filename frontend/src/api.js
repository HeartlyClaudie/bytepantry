// api.js
import axios from "axios";
import { loginRequest } from "./authConfig";

const API_URL = "https://bytepantry-api-hjbkd7hxfbasg7h8.canadacentral-01.azurewebsites.net";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach MSAL token to all outgoing requests
export const attachTokenInterceptor = (msalInstance, account) => {
  api.interceptors.request.use(async (config) => {
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      console.log("🔐 acquireTokenSilent response:", response);

      if (response && response.accessToken) {
        console.log("🛡️ Attaching access token:", response.accessToken); // <--- add this
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } else {
        console.warn("⚠️ No access token returned.");
      }
    } catch (error) {
      console.error("❌ Failed to acquire token silently:", error);
    }

    return config;
  });
};

// Fetch pantry items
export const getPantryItems = async (userID) => {
  try {
    const response = await api.get(`/api/pantry?userID=${userID}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching pantry items:", error);
    throw error;
  }
};

// Delete pantry item
export const deletePantryItem = async (itemID) => {
  try {
    const response = await api.delete(`/api/pantry/${itemID}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting pantry item:", error);
    throw error;
  }
};


// Add new item to pantry
export const addPantryItem = async (itemData) => {
  try {
    const response = await api.post("/api/pantry/add", itemData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding pantry item:", error);
    throw error;
  }
};

// fetch profile
export const getUserProfile = async (userID) => {
  try {
    const response = await api.get(`/api/user/profile?userID=${userID}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    throw error;
  }
};

// Update profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/api/user/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
};

// Optional logout utility
export const logout = (msalInstance) => {
  msalInstance.logoutPopup()
    .then(() => {
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error("❌ Logout failed:", error);
    });
};

export default api;
