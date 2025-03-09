import React, { useEffect, useState } from "react";
import { getPantryItems } from "../api"; // ✅ Ensure correct import
import { useNavigate } from "react-router-dom";
import { logout } from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    fetchPantryItems();
  }, []);

  const fetchPantryItems = async () => {
    try {
      const items = await getPantryItems();
      setPantryItems(items);
    } catch (error) {
      alert("Failed to fetch pantry items. Please log in again.");
      logout();
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Welcome to BytePantry</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Your Pantry Items:</h3>
      <ul>
        {pantryItems.map((item) => (
          <li key={item.itemID}>
            {item.name} - {item.expiryDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
