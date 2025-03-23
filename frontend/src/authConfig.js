export const msalConfig = {
  auth: {
      clientId: "71a81f6b-6b96-4390-8c99-c7f9caaeb5c4", // ✅ Your Azure AD B2C App ID
      authority: "https://bytepantry.b2clogin.com/bytepantry.onmicrosoft.com/B2C_1_B2C_1A_SIGNUP_SIGNIN", // ✅ Correct User Flow Name
      knownAuthorities: ["bytepantry.b2clogin.com"],
      redirectUri: "https://bytepantry-web-g2gbhufnh7awbmaf.canadacentral-01.azurewebsites.net", // ✅ Updated to your Azure Web App
      navigateToLoginRequestUrl: false, // ✅ Prevents clearing hash
      postLogoutRedirectUri: "https://bytepantry-web-g2gbhufnh7awbmaf.canadacentral-01.azurewebsites.net", // ✅ Ensures logout redirection
  },
  cache: {
      cacheLocation: "sessionStorage", // ✅ Prevent storing tokens in localStorage (security best practice)
      storeAuthStateInCookie: true, // ✅ Prevents losing session in WebView (useful for mobile PWA)
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"], // ✅ Request necessary scopes
};

export const passwordResetRequest = {
  authority: "https://bytepantry.b2clogin.com/bytepantry.onmicrosoft.com/B2C_1_B2C_1A_PASSWORD_RESET", // ✅ Password Reset Policy
  scopes: ["openid", "profile", "email"],
};
