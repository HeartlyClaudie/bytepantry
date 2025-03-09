import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest, passwordResetRequest } from "../authConfig";

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest); // ✅ Normal Sign-In Flow
  };

  const handlePasswordReset = () => {
    instance.loginRedirect(passwordResetRequest); // ✅ Redirect to Password Reset Flow
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Login with Azure AD B2C</h2>
      <button onClick={handleLogin}>Login</button>
      <br />
      <button onClick={handlePasswordReset} style={{ marginTop: "10px" }}>
        Forgot Password?
      </button>
    </div>
  );
};

export default Login;
