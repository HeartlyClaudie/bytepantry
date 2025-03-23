import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import NewItem from "./pages/NewItem";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Donation from "./pages/Donation";
import FBSelect from "./pages/FBSelect";
import ItemAdd from "./pages/ItemAdd";
import ItemList from "./pages/ItemList";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import axios from "axios";

const ProtectedRoute = ({ element }) => {
  const { accounts, inProgress } = useMsal();

  // If authentication is in progress, wait
  if (inProgress === InteractionStatus.Startup || inProgress === InteractionStatus.HandleRedirect) {
    return <div>Loading...</div>; // Show a loading screen while handling login
  }

  // Redirect to login if not authenticated
  return accounts.length > 0 ? element : <Navigate to="/login" />;
};

const LoginRedirectHandler = () => {
  const { accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserID = async () => {
      if (accounts.length > 0) {
        const user = accounts[0];
        try {
          const response = await axios.post(
            "https://bytepantry-api-hjbkd7hxfbasg7h8.canadacentral-01.azurewebsites.net/auth/b2c-login",
            { email: user.username, name: user.name }
          );

          if (response.data.userID) {
            localStorage.setItem("userID", response.data.userID);
            navigate("/home"); // Redirect user to home page after login
          }
        } catch (error) {
          console.error("❌ Error retrieving userID:", error);
        }
      }
    };

    fetchUserID();
  }, [accounts, navigate]);

  return <div>Redirecting...</div>; // Temporary UI while redirecting
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authentication/login-callback" element={<LoginRedirectHandler />} />
        <Route path="/home" element={<Home />} />
        <Route path="/newitem" element={<NewItem />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/fbselect" element={<FBSelect />} />
        <Route path="/itemadd" element={<ItemAdd />} />
        <Route path="/itemlist" element={<ItemList />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
