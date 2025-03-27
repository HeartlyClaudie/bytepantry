// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
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
import { attachTokenInterceptor } from "./api";

const ProtectedRoute = ({ element }) => {
  const { accounts, inProgress } = useMsal();

  if (
    inProgress === InteractionStatus.Startup ||
    inProgress === InteractionStatus.HandleRedirect
  ) {
    return <div>Loading...</div>;
  }

  return accounts.length > 0 ? element : <Navigate to="/login" />;
};

console.log("Here we goooo App!!!!"); // remove later

const LoginRedirectHandler = () => {
  const { accounts, instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        if (accounts.length === 0) {
          console.warn("⚠️ No account returned from MSAL after redirect.");
          return;
        }

        const user = accounts[0];
        console.log("🟢 [MSAL] Logged in: ", user);

        const payload = {
          email: user.username,
          name: user.name || user.username
        };

        console.log("📤 [Frontend] Sending payload to /auth/b2c-login: ", payload);

        const response = await axios.post(
          "https://bytepantry-api-hjbkd7hxfbasg7h8.canadacentral-01.azurewebsites.net/auth/b2c-login",
          payload
        );

        if (response.data.userID) {
          sessionStorage.setItem("userID", response.data.userID);
          console.log("✅ [Frontend] UserID stored:", response.data.userID);
          navigate("/home");
        }
      } catch (error) {
        console.error("❌ [Frontend] Failed to POST to /auth/b2c-login:", error);
      }
    };

    fetchUserID();
  }, [accounts, navigate]);

  return <div>Redirecting...</div>;
};

const App = () => {
  const { accounts, instance } = useMsal();
  console.log("MSAL account info:", accounts[0]);
  console.log("MSAL account info - accounts:", accounts);

  useEffect(() => {
    if (accounts.length > 0 && instance && !window._interceptorAttached) {
      console.log("🔐 Attaching MSAL token interceptor...");
      attachTokenInterceptor(instance, accounts[0]);
      window._interceptorAttached = true;
    }
  }, [accounts, instance]);

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
