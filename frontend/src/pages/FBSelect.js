import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView"; // Your map component

export default function FBSelect() {
  const navigate = useNavigate();

  // Default center for the map (choose one as default)
  const defaultCenter = { lat: 43.660, lng: -79.414 };

  // State to hold the current map center
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Update map center when a food bank is located
  const handleLocate = (newCenter) => {
    setMapCenter(newCenter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // When a food bank is chosen, navigate to the Donations page and pass the selection via state
  // We now pass an object that includes centerID and name
  const handleChoose = (foodBankObj) => {
    navigate("/donation", { state: { selectedFoodbank: foodBankObj } });
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
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
        <h1 className="text-2xl font-semibold text-gray-800">Select Food Bank</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-6 py-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        {/* Map View */}
        <div className="h-64 rounded-md overflow-hidden mb-8">
          <MapView center={mapCenter} />
        </div>

        {/* Tag Pills */}
        <div className="flex space-x-3 mb-8">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">24/7 Drop-off</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm">Accepts Perishable</span>
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm">Open</span>
        </div>

        {/* Food Bank Listings */}
        <div className="space-y-6">
          {/* Church on a Hill Food Bank */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Church on a Hill Food Bank</h2>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded">Open</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              230 St Clair Ave W<br />
              Toronto, ON M4V 1R5
            </p>
            <button
              onClick={() => handleLocate({ lat: 43.686319, lng: -79.406151 })}
              className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors mb-3"
            >
              Locate
            </button>
            <button
              onClick={() =>
                handleChoose({
                  centerID: 1,
                  name: "Church on a Hill Food Bank",
                })
              }
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Choose This Foodbank
            </button>
          </div>

          {/* Wychwood Open Door */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Wychwood Open Door</h2>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded">Open</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              729 St Clair Ave W<br />
              Toronto, ON M6G 3J4
            </p>
            <button
              onClick={() => handleLocate({ lat: 43.681288, lng: -79.427258 })}
              className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors mb-3"
            >
              Locate
            </button>
            <button
              onClick={() =>
                handleChoose({
                  centerID: 2,
                  name: "Wychwood Open Door",
                })
              }
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Choose This Foodbank
            </button>
          </div>

          {/* Hillcrest Community Food Bank */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Hillcrest Community Food Bank</h2>
              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded">Open</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              2 Vaughan Rd<br />
              Toronto, ON M6G 2N1
            </p>
            <button
              onClick={() => handleLocate({ lat: 43.680994, lng: -79.417969 })}
              className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors mb-3"
            >
              Locate
            </button>
            <button
              onClick={() =>
                handleChoose({
                  centerID: 3,
                  name: "Hillcrest Community Food Bank",
                })
              }
              className="w-full bg-blue-500 text-white font-medium py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Choose This Foodbank
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
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
