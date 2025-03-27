import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Example data structure for categories & items
const CATEGORIES = [
  {
    id: "nonperishable",
    name: "Non-perishable Food",
    icon: (
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5a2 2 0 01-2-2v-4m6 6h4m2 0h2a2 2 0 002-2v-4m0 0l-2-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    items: [
      { name: "Canned Beans", expiry: "Apr 10, 2025" },
      { name: "Canned Tuna", expiry: "Jun 20, 2025" },
    ],
  },
  {
    id: "fresh",
    name: "Fresh Produce",
    icon: (
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 7h18M3 12h18M3 17h18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    items: [
      { name: "Apples", expiry: "Mar 25, 2025" },
      { name: "Carrots", expiry: "Apr 5, 2025" },
    ],
  },
  {
    id: "dairy",
    name: "Dairy Products",
    icon: (
      <svg
        className="w-5 h-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M14 2a2 2 0 012 2v6H8V4a2 2 0 012-2h4zM8 10v10a2 2 0 002 2h4a2 2 0 002-2V10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    items: [
      { name: "Milk", expiry: "Mar 15, 2025" },
      { name: "Cheese", expiry: "Apr 10, 2025" },
    ],
  },
];

export default function Donation() {
  const navigate = useNavigate();
  const location = useLocation();
  // Retrieve the selected food bank name from FBSelect (if any)
  const selectedFoodbank = location.state?.selectedFoodbank || "";

  // Which categories are currently open (allowing multiple open)
  const [openCategories, setOpenCategories] = useState([]);
  
  // Track checkbox states for items
  const [checkedItems, setCheckedItems] = useState(() => {
    const initialState = {};
    CATEGORIES.forEach((cat) => {
      initialState[cat.id] = {};
      cat.items.forEach((item) => {
        initialState[cat.id][item.name] = false;
      });
    });
    return initialState;
  });

  // Toggle category open/closed
  const toggleCategory = (catId) => {
    if (openCategories.includes(catId)) {
      setOpenCategories(openCategories.filter((id) => id !== catId));
    } else {
      setOpenCategories([...openCategories, catId]);
    }
  };

  // Toggle checkbox state
  const handleCheck = (catId, itemName) => {
    setCheckedItems((prev) => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [itemName]: !prev[catId][itemName],
      },
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLocationSelect = () => {
    navigate("/fbselect");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-6 py-4">
        <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Donation</h1>
      </header>

      {/* Main Content */}
      <main
        className="
          flex-1 overflow-y-auto pb-24 px-6 
          w-full mx-auto
          sm:max-w-md md:max-w-xl lg:max-w-2xl
        "
      >
        {/* Select Items to Donate Section */}
        <section className="mb-8 mt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Select Items to Donate
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(cat.id)}
                >
                  <div className="flex items-center space-x-3">
                    {cat.icon}
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${
                      openCategories.includes(cat.id) ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openCategories.includes(cat.id) ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="mt-3 ml-6 space-y-2">
                    {cat.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <label className="flex items-center text-gray-700">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={checkedItems[cat.id][item.name]}
                            onChange={() => handleCheck(cat.id, item.name)}
                          />
                          {item.name}
                        </label>
                        <span className="text-sm text-gray-500">
                          Exp. {item.expiry}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Select Food Bank Location Section */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Select Food Bank Location
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 text-sm mb-4">
              {selectedFoodbank
                ? `Selected Food Bank: ${selectedFoodbank}`
                : "No food bank selected."}
            </p>
            <button
              onClick={handleLocationSelect}
              className="w-full border border-gray-300 text-gray-600 font-medium py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              Select Location
            </button>
          </div>
        </section>

        {/* Donation Summary Section */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Donation Summary
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-3 text-gray-700">
              Selected Items:{" "}
              <span className="font-semibold">
                {Object.values(checkedItems).reduce((catSum, catObj) => {
                  return (
                    catSum +
                    Object.values(catObj).filter((checked) => checked).length
                  );
                }, 0)}
              </span>
            </div>
            <div className="mb-4 text-gray-700">
              Location:{" "}
              <span className="font-semibold">
                {selectedFoodbank || "None"}
              </span>
            </div>
            <button className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors">
              Confirm Donation
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
          {/* Home */}
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0H5a2 2 0 01-2-2v-4m6 6h4m2 0h2a2 2 0 002-2v-4m0 0l-2-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>

          {/* List */}
          <button
            onClick={() => navigate("/itemlist")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 7h18M3 12h18M3 17h18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">List</span>
          </button>

          {/* Donate */}
          <button
            onClick={() => navigate("/donation")}
            className="flex flex-col items-center text-blue-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 2a2 2 0 012 2v6H8V4a2 2 0 012-2h4zM8 10v10a2 2 0 002 2h4a2 2 0 002-2V10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">Donate</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M12 11a4 4 0 100-8 4 4 0 000 8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
