import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NewItem from "./pages/NewItem";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Donation from "./pages/Donation";
import FBSelect from "./pages/FBSelect";
import ItemAdd from "./pages/ItemAdd";
import ItemList from "./pages/ItemList";
import { useMsal } from "@azure/msal-react";

const ProtectedRoute = ({ element }) => {
  const { accounts } = useMsal();
  return accounts.length > 0 ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
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
