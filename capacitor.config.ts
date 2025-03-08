import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bytepantry.app",
  appName: "BytePantry",
  webDir: "build",
  bundledWebRuntime: false,
  server: {
    cleartext: true, // ✅ Allows local connections on Android
  },
  android: {
    webContentsDebuggingEnabled: true, // ✅ Enable WebView debugging
    allowMixedContent: true, // ✅ Allows HTTP connections if needed
  },
};

export default config;
