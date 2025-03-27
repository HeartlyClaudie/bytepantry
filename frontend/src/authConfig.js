// authConfig.js

export const msalConfig = {
  auth: {
    clientId: "71a81f6b-6b96-4390-8c99-c7f9caaeb5c4", // bytepantry-b2c (frontend)
    authority: "https://bytepantry.b2clogin.com/bytepantry.onmicrosoft.com/B2C_1_B2C_1A_SIGNUP_SIGNIN",
    knownAuthorities: ["bytepantry.b2clogin.com"],
    redirectUri: "https://bytepantry-web-g2gbhufnh7awbmaf.canadacentral-01.azurewebsites.net/authentication/login-callback",
    postLogoutRedirectUri: "https://bytepantry-web-g2gbhufnh7awbmaf.canadacentral-01.azurewebsites.net/login",
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true
  }
};

// Important: Use the backend API’s App ID and the exposed scope `pantry.access`
export const loginRequest = {
  scopes: ["openid", "profile", "email", "https://bytepantry.onmicrosoft.com/f61aec42-a2f3-43a6-ae3c-eb63a94d80e0/pantry.access"]
};

export const passwordResetRequest = {
  authority: "https://bytepantry.b2clogin.com/bytepantry.onmicrosoft.com/B2C_1_B2C_1A_PASSWORD_RESET",
  scopes: ["openid", "profile", "email"]
};
