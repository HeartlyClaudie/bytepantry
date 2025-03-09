import React, { createContext, useState, useEffect } from "react";
import { getPantryItems } from "../api"; // Import API call

export const PantryContext = createContext();

export const PantryProvider = ({ children }) => {
  const [pantryItems, setPantryItems] = useState([]);

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const items = await getPantryItems();
        setPantryItems(items);
      } catch (error) {
        console.error("Failed to fetch pantry items.");
      }
    };
    fetchPantry();
  }, []);

  return (
    <PantryContext.Provider value={{ pantryItems, setPantryItems }}>
      {children}
    </PantryContext.Provider>
  );
};
