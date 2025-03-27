import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPantryItem } from "../api";

export default function NewItem() {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleScanBarcode = () => {
    alert("Scan Barcode clicked!");
  };

  const handleAddItem = async () => {
    try {
      const userID = sessionStorage.getItem("userID");
      if (!userID) {
        console.warn("User not authenticated.");
        return;
      }

      const item = {
        userID: parseInt(userID),
        foodName,
        category,
        expiryDate,
        quantity,
      };

      console.log("📤 Sending item to backend:", item);
      await addPantryItem(item);
      console.log(" Item successfully added.");
      navigate("/itemlist");

    } catch (error) {
      console.error("❌ Error adding pantry item:", error);
    }
  };    

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-6 py-4">
        <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Add New Food Item</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 w-full mx-auto sm:max-w-md md:max-w-xl lg:max-w-2xl">
        <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center mb-6">
          <span className="text-gray-500">[ Barcode Placeholder ]</span>
        </div>

        <button
          onClick={handleScanBarcode}
          className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors mb-6"
        >
          Scan Barcode
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full px-4 py-2 text-gray-600 text-sm">
            or add manually
          </div>
        </div>

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

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Expiration Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

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
              type="number"
              min="1"
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

        <hr className="border-t border-gray-300 mb-6" />

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
