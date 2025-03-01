import React, { useContext, useEffect } from "react";
import { PantryContext } from "../context/PantryContext";
import { getPantryItems } from "../api";

const Home = () => {
  const { pantryItems, setPantryItems } = useContext(PantryContext);

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
  }, [setPantryItems]);

  return (
    <div>
      <h1>My Pantry</h1>
      <ul>
        {pantryItems.length > 0 ? (
          pantryItems.map((item) => <li key={item.id}>{item.name}</li>)
        ) : (
          <p>No items found.</p>
        )}
      </ul>
    </div>
  );
};

export default Home;
