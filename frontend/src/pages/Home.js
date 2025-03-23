import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Example user data
  const user = {
    name: "Claude",
  };

  // Example item data
  // status can be "Fresh", "Expiring Soon", or "Expired"
  const items = [
    { name: "Milk", expiryDate: "Mar 15, 2025", status: "Fresh" },
    { name: "Bread", expiryDate: "Mar 14, 2025", status: "Expiring Soon" },
    { name: "Yogurt", expiryDate: "Mar 8, 2025", status: "Expiring Soon" },
    { name: "Chicken Thighs", expiryDate: "Mar 5, 2025", status: "Expired" },
  ];

  // Color-coded status tags
  const getStatusClasses = (status) => {
    switch (status) {
      case "Fresh":
        return "bg-green-100 text-green-600";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-600";
      case "Expired":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome Home, <span className="text-green-500">{user.name}</span>
        </h1>
      </header>

      {/* Main Content */}
      <main
        className="
          flex-1 overflow-y-auto pb-24 px-6 
          w-full mx-auto
          sm:max-w-md md:max-w-xl lg:max-w-2xl
        "
      >
        {/* Add Item & Filter Buttons */}
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

        {/* Items List */}
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col"
            >
              {/* Item Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded ${getStatusClasses(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Expiry Info */}
              {item.status === "Expired" ? (
                <p className="text-sm text-red-500 mb-4">
                  Expired: {item.expiryDate}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  Expires: {item.expiryDate}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {item.status === "Expired" ? (
                  <button
                    onClick={() => alert("Remove clicked")}
                    className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
          {/* Home */}
          <button
            onClick={() => navigate("/home")}
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
            onClick={() => navigate("/donate")}
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
    </div>
  );
}
