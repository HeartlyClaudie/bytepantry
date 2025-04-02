import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPantryItems } from "../api";
import api from "../api"; // Axios instance

// Helper to capitalize the first letter
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper to get the icon path for a category
function getCategoryIcon(category) {
  // Assuming your icons are named exactly as the lowercased category (e.g., "meat.png", "vegetables.png")
  const formattedCategory = category.toLowerCase().trim();
  return `/icons/${formattedCategory}.png`;
}

// Helper to calculate days until expiry
function getDaysUntilExpiry(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Donation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Expecting an object like { centerID, name } from FBSelect
  const selectedFoodbank = location.state?.selectedFoodbank || {};
  const { centerID, name: foodBankName } = selectedFoodbank;

  // State for grouped pantry items
  const [categoriesData, setCategoriesData] = useState({});
  // To manage collapsible groups
  const [openCategories, setOpenCategories] = useState([]);
  // Track the donation quantity for each item (keyed by itemID)
  const [donationQuantities, setDonationQuantities] = useState({});
  // Past donations for this user
  const [pastDonations, setPastDonations] = useState([]);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Disable background scrolling when modals are open
  useEffect(() => {
    document.body.style.overflow = showConfirmModal || showSuccessModal ? "hidden" : "auto";
  }, [showConfirmModal, showSuccessModal]);

  // Fetch the user's pantry items and filter eligible ones (expiration >= 10 days)
  const fetchPantryItems = async () => {
    const userID = sessionStorage.getItem("userID");
    if (!userID) {
      console.warn("No userID found in sessionStorage");
      return;
    }
    try {
      const items = await getPantryItems(userID);
      // Filter out items that are expiring in less than 10 days
      const eligibleItems = items.filter(item => getDaysUntilExpiry(item.expiryDate) >= 10);
      
      const grouped = {};
      eligibleItems.forEach((item) => {
        let catName =
          item.category && item.category.trim()
            ? capitalize(item.category)
            : "Non-categorized";
        if (!grouped[catName]) grouped[catName] = [];
        grouped[catName].push(item);
      });
      setCategoriesData(grouped);

      // Reset donation quantities for eligible items only
      const initialQuantities = {};
      eligibleItems.forEach((item) => {
        initialQuantities[item.itemID] = 0;
      });
      setDonationQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching pantry items:", error);
    }
  };

  // Fetch the user's past donations
  const fetchPastDonations = async () => {
    const userID = sessionStorage.getItem("userID");
    if (!userID) {
      console.warn("No userID found in sessionStorage");
      return;
    }
    try {
      const response = await api.get(`/api/donation?userID=${userID}`);
      // Sort donations in descending order by donationID (most recent first)
      const sortedDonations = response.data.sort((a, b) => b.donationID - a.donationID);
      setPastDonations(sortedDonations);
    } catch (error) {
      console.error("Error fetching past donations:", error);
    }
  };

  // On mount, load pantry items and past donations
  useEffect(() => {
    fetchPantryItems();
    fetchPastDonations();
  }, []);

  // Toggle collapse for category
  const toggleCategory = (category) => {
    if (openCategories.includes(category)) {
      setOpenCategories(openCategories.filter((c) => c !== category));
    } else {
      setOpenCategories([...openCategories, category]);
    }
  };

  // Increment/decrement donation quantity
  const incrementQuantity = (itemID, maxQuantity) => {
    setDonationQuantities((prev) => ({
      ...prev,
      [itemID]: Math.min(prev[itemID] + 1, maxQuantity),
    }));
  };
  const decrementQuantity = (itemID) => {
    setDonationQuantities((prev) => ({
      ...prev,
      [itemID]: Math.max(prev[itemID] - 1, 0),
    }));
  };

  // Calculate total donation quantity
  const totalDonation = Object.values(donationQuantities).reduce((sum, qty) => sum + qty, 0);
  const isDonationDisabled = totalDonation === 0 || !centerID;

  // Navigation handlers
  const handleBack = () => navigate(-1);
  const handleLocationSelect = () => navigate("/fbselect");

  // Prepare donation items
  const donationItems = Object.entries(donationQuantities)
    .map(([itemID, donationQuantity]) => ({
      itemID: parseInt(itemID, 10),
      donationQuantity,
    }))
    .filter((item) => item.donationQuantity > 0);

  // Open the confirmation modal
  const openConfirmDonationModal = () => {
    setShowConfirmModal(true);
  };

  // Submit donation
  const submitDonation = async () => {
    console.log("submitDonation called", { donationItems, userID: sessionStorage.getItem("userID") });
    try {
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        console.warn("No userID found in sessionStorage");
        return;
      }
      const response = await api.post("/api/donation", {
        userID: parseInt(userID, 10),
        donationCenterID: centerID,
        donationItems,
      });
      if (response.data && response.data.success) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        fetchPantryItems();
        fetchPastDonations();
      } else {
        alert("Donation failed.");
      }
    } catch (error) {
      console.error("Error confirming donation:", error);
      alert("Error confirming donation.");
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-6 py-4">
        <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700" type="button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Donation</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        {/* Select Items Section */}
        <section className="mt-6 mb-2">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Select Items to Donate
          </h3>
          <div className="bg-white rounded-lg shadow-sm pt-6 px-6 pb-2">
            {Object.keys(categoriesData).length === 0 ? (
              <p>No eligible items found in your pantry.</p>
            ) : (
              Object.keys(categoriesData).map((category) => (
                <div key={category} className="mb-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={getCategoryIcon(category)}
                        alt={category}
                        className="w-5 h-5"
                      />
                      <span className="text-gray-700 font-medium">{category}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${
                        openCategories.includes(category) ? "rotate-90" : ""
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
                      openCategories.includes(category) ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="mt-3 ml-6 space-y-2">
                      {categoriesData[category].map((item) => (
                        <div key={item.itemID} className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-700 font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Exp. {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Available: {item.quantity || 1}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => decrementQuantity(item.itemID)}
                              disabled={donationQuantities[item.itemID] === 0}
                              className="px-2 py-1 border border-gray-300 rounded-l disabled:opacity-50"
                              type="button"
                            >
                              -
                            </button>
                            <div className="px-3 py-1 border-t border-b border-gray-300">
                              {donationQuantities[item.itemID]}
                            </div>
                            <button
                              onClick={() => incrementQuantity(item.itemID, item.quantity || 1)}
                              disabled={donationQuantities[item.itemID] >= (item.quantity || 1)}
                              className="px-2 py-1 border border-gray-300 rounded-r disabled:opacity-50"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Food Bank Location Section */}
        <section className="mt-6 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Select Food Bank Location
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-700 text-sm mb-4">
              {foodBankName ? `Selected Food Bank: ${foodBankName}` : "No food bank selected."}
            </p>
            <button
              onClick={handleLocationSelect}
              className="w-full border border-gray-300 text-gray-600 font-medium py-3 rounded-md hover:bg-gray-100 transition-colors"
              type="button"
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
              Selected Items: <span className="font-semibold">{totalDonation}</span>
            </div>
            <div className="mb-4 text-gray-700">
              Location: <span className="font-semibold">{foodBankName || "None"}</span>
            </div>
            <button
              onClick={openConfirmDonationModal}
              className={`w-full bg-green-500 text-white font-medium py-3 rounded-md transition-colors ${
                isDonationDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
              }`}
              disabled={isDonationDisabled}
              type="button"
            >
              Confirm Donation
            </button>
          </div>
        </section>

        {/* Past Donations Section */}
        <section className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Past Donations
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-h-80 overflow-y-auto">
            {pastDonations.length === 0 ? (
              <p>No past donations found.</p>
            ) : (
              pastDonations.map((donation) => {
                let items = [];
                try {
                  items = JSON.parse(donation.foodItems);
                } catch (e) {
                  console.error("Error parsing donation foodItems:", e);
                }
                return (
                  <div key={donation.donationID} className="border p-3 rounded">
                    <p className="text-sm text-gray-600">
                      Date: {new Date(donation.donationDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Center: {donation.donationCenterName}
                    </p>
                    <ul className="mb-2">
                      {items.map((it, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {it.itemName}: {it.donationQuantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Donation</h2>
            <p className="mb-4">
              Are you sure you want to donate the following items to <span className="font-bold">{foodBankName}</span>?
            </p>
            <ul className="mb-4">
              {donationItems.map((item) => {
                let itemDetails = null;
                for (let cat in categoriesData) {
                  itemDetails = categoriesData[cat].find((i) => i.itemID === item.itemID);
                  if (itemDetails) break;
                }
                return (
                  <li key={item.itemID} className="mb-1">
                    {itemDetails ? itemDetails.name : "Item"}: {item.donationQuantity}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={submitDonation}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                type="button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Donation Successful</h2>
            <p className="mb-4">
              Donation notification sent to <span className="font-bold">{foodBankName}</span>. Thank you!
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                type="button"
              >
                You're Welcome!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
            type="button"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
            type="button"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs">List</span>
          </button>
          <button
            onClick={() => navigate("/donation")}
            className="flex flex-col items-center text-red-500"
            type="button"
          >
            <img src="/icons/donate.png" alt="Donate" className="w-6 h-6 mb-1" />
            <span className="text-xs">Donate</span>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
            type="button"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
