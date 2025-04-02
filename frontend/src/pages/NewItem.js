import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { addPantryItem } from "../api";
import Quagga from "quagga"; // Barcode scanner library

export default function NewItem() {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState(""); // State for success message
  const videoRef = useRef(null);
  const scannerContainerRef = useRef(null);
  let mediaStream = null;
  let lastScanned = "";

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Fetch food name using an API call
  const fetchFoodNameFromBarcode = async (barcode) => {
    try {
      const response = await fetch('https://world.openfoodfacts.org/api/v0/product/${barcode}.json');
      const data = await response.json();
      if (data.product && data.product.product_name) {
        setFoodName(data.product.product_name);
        setScanSuccessMessage("Item Scanned Successfully!"); // Show success message
      } else {
        setFoodName("Unknown Product");
        setScanSuccessMessage(""); // Clear success message if product is unknown
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setFoodName("Error fetching product");
      setScanSuccessMessage(""); // Clear success message if there's an error
    }
  };

  // Barcode scanning logic
  const startCamera = async () => {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        scannerContainerRef.current.style.display = "block";
      }

      setIsScanning(true);
      startBarcodeScanner();
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop(); // Stop each track (audio and video)
      });
      mediaStream = null; // Clear the media stream reference
    }
    Quagga.stop();
    if (scannerContainerRef.current) scannerContainerRef.current.style.display = "none";
    setIsScanning(false);

    // Clear the foodName field and the success message when stopping the camera
    setFoodName(""); 
    setScanSuccessMessage(""); // Reset the success message
  };

  const startBarcodeScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: videoRef.current,
        },
        decoder: { readers: ["ean_reader", "upc_reader"] },
        locate: true,
      },
      (err) => {
        if (!err) {
          Quagga.start();
        } else {
          console.error("QuaggaJS error:", err);
        }
      }
    );

    Quagga.onDetected(async (result) => {
      let scannedBarcode = result.codeResult.code;
      if (scannedBarcode === lastScanned) return;
      lastScanned = scannedBarcode;
      await fetchFoodNameFromBarcode(scannedBarcode);

      // If the food name is valid, stop scanning and close the camera
      if (foodName && foodName !== "Unknown Product") {
        stopCamera();
      }
    });
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
        <div ref={scannerContainerRef} className="relative w-full max-w-md h-96 mx-auto overflow-hidden border-4 border-gray-800 rounded-lg bg-black hidden">
          <video ref={videoRef} autoPlay className="w-full h-full object-cover"></video>
        </div>

        <button onClick={isScanning ? stopCamera : startCamera} className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors mb-6">
          {isScanning ? "Stop Scanning" : "Start Scanning"}
        </button>

        {/* Add Food Form */}
        <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">Food Name</label>
  <div className="relative">
    <input
      type="text"
      value={foodName}
      onChange={(e) => setFoodName(e.target.value)}
      placeholder="Enter food name"
      className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
    />
    {foodName && (
      <button
        onClick={() => setFoodName("")}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )}
  </div>
</div>


        {/* Display success message after scanning */}
        {scanSuccessMessage && (
          <div className="text-green-600 mb-4 font-semibold">
            {scanSuccessMessage}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option value="Beverages">Beverages</option>
            <option value="Canned">Canned Goods</option>
            <option value="Condiments">Condiments</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat">Meat</option>
            <option value="Grains">Grains</option>
            <option value="Produce">Produce</option>
            <option value="Snacks">Snacks</option>
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

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Quantity</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button onClick={handleMinus} className="w-12 h-12 text-gray-700 hover:bg-gray-100 flex items-center justify-center">-</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full text-center border-l border-r border-gray-300 py-2 focus:outline-none"
            />
            <button onClick={handlePlus} className="w-12 h-12 text-gray-700 hover:bg-gray-100 flex items-center justify-center">+</button>
          </div>
        </div>

        {/* Add Item Button */}
        <button onClick={handleAddItem} className="w-full bg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors">
          Add to Inventory
        </button>
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