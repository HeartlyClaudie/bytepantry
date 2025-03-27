import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest, passwordResetRequest } from "../authConfig";

console.log("Here we goooo Login!!!!"); // remove later

export default function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const handlePasswordReset = () => {
    instance.loginRedirect(passwordResetRequest);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Card Container */}
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login with Azure AD B2C
        </h2>
        <button
          onClick={handleLogin}
          className="w-full py-2 mb-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <button
          onClick={handlePasswordReset}
          className="w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
