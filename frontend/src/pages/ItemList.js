import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPantryItems } from "../api";

export default function ItemList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState("expiry");
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        console.warn("❗ No userID found in sessionStorage");
        return;
      }
  
      try {
        const data = await getPantryItems(userID); // 👈 Pass userID
        setItems(data); // Replace dummy data with real data
      } catch (error) {
        console.error("Failed to fetch pantry items:", error);
      }
    };
  
    fetchItems();
  }, []);

  useEffect(() => {
    let updatedItems = [...items];

    // Filter
    if (filterText) {
      updatedItems = updatedItems.filter(item =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sort
    updatedItems.sort((a, b) => {
      const aDays = getDaysUntilExpiry(a.expiryDate);
      const bDays = getDaysUntilExpiry(b.expiryDate);

      if (sortBy === "expiry") return aDays - bDays;
      if (sortBy === "name") return a.name.localeCompare(b.name);

      return 0;
    });

    setFilteredItems(updatedItems);
  }, [items, sortBy, filterText]);

  const handleUseNow = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
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
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Item List</h1>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 00-9.33-4.74 1 1 0 01-1.34-1.48A8 8 0 0120 11v3c0 .53.21 1.04.59 1.41L22 17v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1l.59-.59A2.032 2.032 0 014 14v-3a8 8 0 011.047-3.975" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        {/* Sort and Filter Controls */}
        <div className="flex justify-between items-center mt-6 mb-4">
          <input
            type="text"
            placeholder="Search items..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-1/2"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="expiry">Sort by Expiry</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div key={item.itemID} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-800 font-semibold text-lg">{item.name}</h2>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded">
                  {item.quantity || 1}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Expires in {getDaysUntilExpiry(item.expiryDate)} day(s)
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleUseNow(item)}
                  className="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors"
                >
                  Use Now
                </button>
                <button
                  onClick={() => alert("Donate clicked")}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Donate
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
          <button onClick={() => navigate("/home")} className="flex flex-col items-center text-gray-600 hover:text-blue-500" type="button">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5a2 2 0 01-2-2v-4m6 6h4m2 0h2a2 2 0 002-2v-4m0 0l-2-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button onClick={() => navigate("/itemlist")} className="flex flex-col items-center text-blue-500" type="button">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">List</span>
          </button>
          <button onClick={() => navigate("/donation")} className="flex flex-col items-center text-gray-600 hover:text-blue-500" type="button">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 2a2 2 0 012 2v6H8V4a2 2 0 012-2h4zM8 10v10a2 2 0 002 2h4a2 2 0 002-2V10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">Donate</span>
          </button>
          <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-gray-600 hover:text-blue-500" type="button">
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
