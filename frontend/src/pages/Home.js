import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { logout, getPantryItems } from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { accounts } = useMsal();
  const [userName, setUserName] = useState("");
  const [items, setItems] = useState([]);

  // Dummy helper to prevent build error
  const getStatusClasses = (status) => {
    switch (status) {
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Fresh":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome Home, <span className="text-green-500">{userName}</span>
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <div className="flex items-center justify-between mt-6 mb-8">
          <button
            onClick={() => navigate("/newitem")}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            + Add Item
          </button>
          <button
            onClick={() => alert("Filter clicked")}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            Filter
          </button>
        </div>

        <div className="space-y-6">
          {items.map((item) => {
            const daysLeft = getDaysUntilExpiry(item.expiryDate);
            return (
              <div key={item.itemID} className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <span className="text-sm text-gray-500">
                    {daysLeft > 0
                      ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
                      : "Expired"}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-4">Expires: {item.expiryDate}</p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => alert("Edit clicked")}
                    className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert("Donate clicked")}
                    className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Donate
                  </button>
                </div>
              </div>
            );
          })}
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
            className="flex flex-col items-center text-gray-600 hover:text-red-500"
            type="button"
          >
            <img
              src="/icons/donate.png"
              alt="Donate"
              className="w-6 h-6 mb-1"
            />
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
