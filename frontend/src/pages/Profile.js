// Profile.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        if (!userID) throw new Error("Missing userID in sessionStorage");

        const data = await getUserProfile(userID);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleToggle = (key) => {
    setUser((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const userID = sessionStorage.getItem("userID");
      await updateUserProfile({
        userID: parseInt(userID),
        name: user.name,
        pushNotif: user.pushNotif,
        emailUpdates: user.emailUpdates,
      });      
      alert("Profile updated successfully.");
    } catch (error) {
      alert("Failed to update profile.");
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">Loading...</h1>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6 text-center text-gray-500">
          Loading profile information...
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-6 py-4">
        <button
          onClick={handleBack}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
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
        <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        {/* User Header */}
        <section className="bg-white rounded-lg shadow-sm p-6 mt-6 mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-6">
              <span className="text-3xl font-bold text-gray-500">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">Personal Account</p>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Personal Information
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-4 divide-y divide-gray-200">
            <div className="py-3">
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="py-3">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Notifications
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-4 divide-y divide-gray-200">
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-700">Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={user.pushNotif}
                  onChange={() => handleToggle("pushNotif")}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-700">Email Updates</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={user.emailUpdates}
                  onChange={() => handleToggle("emailUpdates")}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleUpdate}
              className="w-full sm:w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition-colors"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
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
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
