import axios from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";

const API_URL = "http://localhost:3000"; // Replace with your actual API URL

const msalInstance = new PublicClientApplication(msalConfig);

// Get JWT Token from MSAL
const getToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) return null;

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.idToken;
  } catch (error) {
    console.error("Error acquiring token:", error);
    return null;
  }
};

// Axios instance with JWT authentication
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to fetch pantry items
export const getPantryItems = async () => {
  try {
    const response = await api.get("/api/pantry");
    return response.data;
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    throw error;
  }
};

// Function to log out from Azure AD B2C
export const logout = () => {
  msalInstance.logoutPopup()
    .then(() => {
      localStorage.removeItem("jwtToken");
      window.location.href = "/login"; // Redirect to login page
    })
    .catch(error => {
      console.error("Logout failed:", error);
    });
};

export default api;
