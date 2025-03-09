export const msalConfig = {
    auth: {
      clientId: "71a81f6b-6b96-4390-8c99-c7f9caaeb5c4", // ✅ Your Azure AD B2C App ID
      authority: "https://bytepantry.b2clogin.com/bytepantry.onmicrosoft.com/B2C_1_B2C_1A_SIGNUP_SIGNIN", // ✅ Correct User Flow Name
      knownAuthorities: ["bytepantry.b2clogin.com"],
      redirectUri: "http://localhost:3000", // ✅ Make sure this is exactly the same as in Azure AD B2C
      navigateToLoginRequestUrl: false, // ✅ Prevents clearing hash
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: true, // ✅ Prevents losing session in WebView
    },
  };
  
  export const loginRequest = {
    scopes: ["openid", "profile", "email"],
  };

  export const passwordResetRequest = {
    authority: "https://bytepantry.b2clogin.com/bytepantry.onmicrosoft.com/B2C_1_B2C_1A_PASSWORD_RESET", // ✅ Password Reset Policy
    scopes: ["openid", "profile", "email"],
  };
  