import React from "react";
import { useNavigate } from "react-router-dom";

export default function FBSelect() {
  const navigate = useNavigate();

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-4 py-3">
        <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700">
          {/* Back Arrow Icon */}
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
        <h1 className="text-lg font-semibold text-gray-800">Select Food Bank</h1>
      </header>

      {/* Main Content with Responsive Container */}
      <main
        className="
          flex-1 overflow-y-auto pb-20 px-4 w-full mx-auto
          sm:max-w-md md:max-w-xl lg:max-w-2xl
        "
      >
        {/* Map Placeholder */}
        <div className="bg-gray-300 h-48 rounded-md flex items-center justify-center mb-4">
          <span className="text-gray-600">Interactive Map View</span>
        </div>

        {/* Tag Pills */}
        <div className="flex space-x-2 mb-4">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
            24/7 Drop-off
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
            Accepts Perishable
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">
            Open
          </span>
        </div>

        {/* Food Bank Listings */}
        <div className="space-y-4">
          {/* Food Bank Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-gray-800 font-semibold">Community Food Bank</h2>
              <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded">
                Open
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              0.8 miles away<br />
              123 Main St, City
            </p>
            <button className="bg-green-500 text-white font-medium py-2 w-full rounded hover:bg-green-600 transition-colors">
              Contact
            </button>
          </div>

          {/* Another Food Bank Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-gray-800 font-semibold">Hope Food Pantry</h2>
              <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded">
                Closed
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              1.2 miles away<br />
              456 Oak Ave, City
            </p>
            <button className="bg-green-500 text-white font-medium py-2 w-full rounded hover:bg-green-600 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex justify-between px-6 py-2">
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
            <span className="text-xs">Home</span>
          </button>

          {/* List */}
          <button
            onClick={() => navigate("/list")}
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
            <span className="text-xs font-semibold">Donate</span>
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
