import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { logout, getPantryItems } from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const [userName, setUserName] = useState("");
  
  //temporary items
  const [items, setItems] = useState([
    { itemID: 1, name: "Milk", expiryDate: "2025-04-04" },
    { itemID: 2, name: "Eggs", expiryDate: "2025-03-29" },
    { itemID: 3, name: "Bread", expiryDate: "2025-03-30" },
    { itemID: 4, name: "Cheese", expiryDate: "2025-04-02" },
  ]);

  useEffect(() => {
    if (accounts.length > 0) {
      const name = accounts[0].name || "User";
      setUserName(name);
    }

    const getItems = async () => {
      try {
        const storedUserID = sessionStorage.getItem("userID");
        if (!storedUserID) return;
        const data = await getPantryItems(storedUserID);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch pantry items:", error);
      }
    };

    getItems();
  }, [accounts]);

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const removeItem = (itemID) => {
    setItems((prevItems) => prevItems.filter((item) => item.itemID !== itemID));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome Home, <span className="text-green-500">{userName}</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <div className="text-center my-6">
          <h2 className="text-xl font-semibold text-gray-700">Expiring Items</h2>
        </div>

        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => {
              const daysLeft = getDaysUntilExpiry(item.expiryDate);
              return (
                <div key={item.itemID} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                  <div>
                    <span className="text-lg font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {daysLeft > 0
                        ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} before expiration`
                        : "Expired"}
                    </span>
                  </div>
                  {daysLeft <= 0 && (
                    <button
                      onClick={() => removeItem(item.itemID)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No expiring items found.</p>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/newitem")}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            + Add Item
          </button>
        </div>
      </main>
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center text-blue-500"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5a2 2 0 01-2-2v-4m6 6h4m2 0h2a2 2 0 002-2v-4m0 0l-2-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => navigate("/itemlist")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">List</span>
          </button>

          <button
            onClick={() => navigate("/donation")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2a2 2 0 012 2v6H8V4a2 2 0 012-2h4zM8 10v10a2 2 0 002 2h4a2 2 0 002-2V10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">Donate</span>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
