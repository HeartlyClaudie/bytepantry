import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewItem() {
  const navigate = useNavigate();

  // Form states
  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Handlers for quantity
  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  // Navigation
  const handleBack = () => {
    navigate(-1);
  };

  const handleScanBarcode = () => {
    alert("Scan Barcode clicked!");
  };

  const handleAddItem = () => {
    alert("Item added to inventory!");
    // Actual submission logic goes here.
  };

  // Focus the date input when calendar icon is clicked
  const focusDateInput = () => {
    const dateInput = document.getElementById("expirationDateInput");
    if (dateInput) dateInput.focus();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-6 py-4">
        <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Add New Food Item</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        {/* Barcode Placeholder */}
        <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center mb-6">
          <span className="text-gray-500">[ Barcode Placeholder ]</span>
        </div>

        {/* Scan Barcode Button */}
        <button
          onClick={handleScanBarcode}
          className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              d="M3 7h2l2-2h6l2 2h2
                 a2 2 0 012 2v9
                 a2 2 0 01-2 2H5
                 a2 2 0 01-2-2V9
                 a2 2 0 012-2z
                 M12 11.5a2.5 2.5 0 100 5
                 2.5 2.5 0 000-5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Scan Barcode
        </button>

        {/* "or add manually" Bubble */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full px-4 py-2 text-gray-600 text-sm">
            or add manually
          </div>
        </div>

        {/* Food Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Food Name</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name"
            className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Produce">Produce</option>
            <option value="Grains">Grains</option>
          </select>
        </div>

        {/* Expiration Date (Text Input) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Expiration Date</label>
          <div className="relative">
            <input
              id="expirationDateInput"
              type="text"
              placeholder="mm/dd/yyyy"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {/* Custom Calendar Icon */}
            <button
              type="button"
              onClick={focusDateInput}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 7V3m8 4V3m-9 8h10
                     M3 11a2 2 0 012-2h14
                     a2 2 0 012 2v8
                     a2 2 0 01-2 2H5
                     a2 2 0 01-2-2v-8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Quantity with Single Rounded Container */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Quantity</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={handleMinus}
              className="w-12 h-12 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full text-center border-l border-r border-gray-300 py-2 focus:outline-none"
            />
            <button
              onClick={handlePlus}
              className="w-12 h-12 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-t border-gray-300 mb-6" />

        {/* Add to Inventory Button */}
        <button
          onClick={handleAddItem}
          className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors"
        >
          Add to Inventory
        </button>
      </main>
    </div>
  );
}
