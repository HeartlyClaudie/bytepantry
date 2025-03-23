import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: "Claude",
    accountType: "Personal Account",
    fullName: "Claude E.",
    email: "claude@gmail.com",
    subscriptionPlan: "Pro Plan",
    subscriptionStatus: "Active",
    nextBillingDate: "March 15, 2025",
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-4 py-3">
        <button
          onClick={handleBack}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          {/* Simple Back Arrow Icon (Heroicons) */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 max-w-md mx-auto w-full">
        {/* USER HEADER (Avatar, Name, Account Type) */}
        <section className="bg-white rounded-lg shadow-sm p-4 mt-6 mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-gray-500">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.accountType}</p>
            </div>
          </div>
        </section>

        {/* PERSONAL INFO */}
        <section className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            PERSONAL INFORMATION
        </h3>
        {/* Reduced container padding from p-4 to p-3 */}
        <div className="bg-white rounded-lg shadow-sm p-3 divide-y divide-gray-200">
            {/* Full Name (py-2 instead of py-4) */}
            <div className="py-2">
            <label className="block text-gray-700 font-medium mb-1">
                Full Name
            </label>
            <input
                type="text"
                value={user.fullName}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            </div>
            {/* Email */}
            <div className="py-2">
            <label className="block text-gray-700 font-medium mb-1">
                Email
            </label>
            <input
                type="email"
                value={user.email}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            </div>
        </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            NOTIFICATIONS
        </h3>
        <div className="bg-white rounded-lg shadow-sm p-3 divide-y divide-gray-200">
            {/* Push Notifications */}
            <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Push Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-5 
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
                                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
            </div>
            {/* Email Updates */}
            <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Email Updates</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-5 
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
                                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
            </label>
            </div>
        </div>
        </section>
        
        {/* SUBSCRIPTION */}
        <section className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            SUBSCRIPTION
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-semibold">
                {user.subscriptionPlan}
              </span>
              <span className="inline-block bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded">
                {user.subscriptionStatus}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Next billing date: {user.nextBillingDate}
            </p>
            <div className="flex">
              <button className="mx-auto w-3/4 border border-gray-300 text-gray-600 font-medium py-2 rounded-md hover:bg-gray-100 transition-colors">
                Manage Subscription
              </button>
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            APPEARANCE
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-5 
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
                                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Switch between light and dark theme
            </p>
          </div>
        </section>
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
            <span className="text-xs">Donate</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
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
                d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M12 11a4 4 0 100-8 4 4 0 000 8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs font-semibold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
