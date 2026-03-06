import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaviarts.app',
  appName: 'KaviArts',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999",
      splashFullScreen: false,
      splashImmersive: false,
    },
    // ✅ FORCE NATIVE BAR STYLING HERE
    StatusBar: {
      overlaysWebView: false,
      style: "DARK", // Keeps battery text white
      backgroundColor: "#000000",
    }
  },
};

export default config;