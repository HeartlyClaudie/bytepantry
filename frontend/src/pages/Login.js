import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest, passwordResetRequest } from "../authConfig";

export default function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const handlePasswordReset = () => {
    instance.loginRedirect(passwordResetRequest);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Welcome to BytePantry
        </h2>
        <button
          onClick={handleLogin}
          className="w-full py-3 mb-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <button
          onClick={handlePasswordReset}
          className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
