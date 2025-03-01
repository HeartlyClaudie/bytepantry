import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bytepantry.app",
  appName: "BytePantry",
  webDir: "build",
  bundledWebRuntime: false,
  server: {
    androidScheme: "file" // Prevents WebView from using `https://localhost`
  },
  android: {
    allowMixedContent: true, // Allow HTTP & HTTPS content
    webContentsDebuggingEnabled: true
  }
};

export default config;
