import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ItemList() {
  const navigate = useNavigate();

  // Example item data
  const items = [
    { name: "Milk", expiryDays: 10, quantity: "1L" },
    { name: "Yogurt", expiryDays: 2, quantity: "500g" },
    { name: "Bread", expiryDays: 9, quantity: "1 loaf" },
  ];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
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
          <h1 className="text-2xl font-semibold text-gray-800">Item List</h1>
        </div>
        {/* Optional Notification Icon */}
        <button className="text-gray-500 hover:text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 00-9.33-4.74
                 1 1 0 01-1.34-1.48A8 8 0 0120 11v3c0 .53.21 1.04.59 1.41L22 17v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1l.59-.59A2.032 2.032 0 014 14v-3a8 8 0 011.047-3.975"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main
        className="
          flex-1 overflow-y-auto pb-24 px-6 
          w-full mx-auto
          sm:max-w-md md:max-w-xl lg:max-w-2xl
        "
      >
        {/* Banner */}
        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-md mt-6 mb-8">
          You have 3 items expiring soon
        </div>

        {/* Item Cards */}
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.name} className="bg-white rounded-lg shadow-sm p-6">
              {/* Top Row: Name & Quantity */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-800 font-semibold text-lg">{item.name}</h2>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded">
                  {item.quantity}
                </span>
              </div>
              {/* Expiry Info */}
              <p className="text-sm text-gray-500 mb-4">
                Expires in {item.expiryDays} days
              </p>
              {/* Action Buttons */}
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

      {/* Footer */}
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

      {/* Use Now Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={closeModal}></div>
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg w-5/6 sm:w-1/2 max-w-sm p-4 z-30">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              How would you like to use this item?
            </h2>
            <div className="border border-gray-200 rounded-md divide-y divide-gray-200 overflow-hidden">
              {/* Consume Now */}
              <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 2a2 2 0 012 2v4c0 .73-.41 1.38-1 1.73v9.27a2 2 0 11-2 0V9.73A2 2 0 012 8V4a2 2 0 012-2zm14 0a2 2 0 00-2 2v4c0 .73.41 1.38 1 1.73v9.27a2 2 0 104 0V9.73A2 2 0 0018 8V4a2 2 0 00-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Consume Now</span>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Plan a Meal */}
              <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 7V3m8 4V3m-9 8h10M3 11a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Plan a Meal</span>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Mark as Used */}
              <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Mark as Used</span>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={closeModal}
              className="mt-4 w-full py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
