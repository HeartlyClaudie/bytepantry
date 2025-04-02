import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPantryItems } from "../api";
import api from "../api"; // Axios instance

export default function ItemList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortBy, setSortBy] = useState("expiry");
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  // State for delete confirmation modal
  const [itemToDelete, setItemToDelete] = useState(null);

  // Helper to capitalize each word in the item name
  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchItems = async () => {
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        console.warn("❗ No userID found in sessionStorage");
        return;
      }
      try {
        const data = await getPantryItems(userID);
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch pantry items:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    let updatedItems = [...items];
    if (filterText) {
      updatedItems = updatedItems.filter((item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }
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

  // Delete function using route parameter
  const handleDeleteItem = async () => {
    try {
      // Sends DELETE request to /api/pantry/item/{itemID}
      const response = await api.delete(`/api/pantry/item/${itemToDelete.itemID}`);
      if (response.data && response.data.success) {
        setItems((prev) => prev.filter((i) => i.itemID !== itemToDelete.itemID));
      } else {
        alert("Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item.");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Item List</h1>
        </div>
      </header>

      {/* Filter and Sort Controls */}
      <div className="flex items-center justify-center mt-4 mb-4 space-x-4 px-4 sm:px-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="expiry">Sort by Expiry</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-4 sm:px-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            return (
              <div
                key={item.itemID}
                className="rounded-lg shadow-sm p-4 sm:p-6"
                style={{
                  backgroundImage: `url(/landscape-backgrounds/${item.category.toLowerCase()}.png)`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    {/* Left side: Item Name and Quantity */}
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base sm:text-lg font-semibold bg-white/50 text-gray-800 px-3 py-1 rounded">
                        {capitalizeName(item.name)}
                      </h2>
                      <span className="text-sm bg-white/50 text-gray-800 px-3 py-1 rounded">
                        {item.quantity || 1}
                      </span>
                    </div>
                    {/* Right side: Hamburger Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === item.itemID ? null : item.itemID)
                        }
                        className="p-2"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M4 6h16M4 12h16M4 18h16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {openMenu === item.itemID && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg">
                          <button
                            onClick={() => {
                              setItemToDelete(item);
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {daysUntilExpiry > 0 ? (
                    <span className="text-sm bg-white/50 text-gray-800 px-3 py-1 rounded inline-block mt-2">
                      Expires in {daysUntilExpiry} day(s)
                    </span>
                  ) : (
                    <span className="text-sm bg-white/50 text-gray-800 px-3 py-1 rounded inline-block mt-2">
                      Expired {Math.abs(daysUntilExpiry)} day(s) ago
                    </span>
                  )}
                </div>
                {daysUntilExpiry <= 10 ? (
                  <div className="flex">
                    <button
                      onClick={() => handleUseNow(item)}
                      className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Use Now
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">{capitalizeName(itemToDelete.name)}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                type="button"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center text-gray-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5a2 2 0 01-2-2v-4m6 6h4m2 0h2a2 2 0 002-2v-4m0 0l-2-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => navigate("/itemlist")}
            className="flex flex-col items-center text-blue-500"
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
