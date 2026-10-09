# Al Muneer Quran - Mobile App

This project is configured to be built as a Progressive Web App (PWA) and a native Android app using Capacitor.

## Prerequisites

- Node.js and npm
- Android Studio (for building the APK)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize Capacitor (if not already done):
   ```bash
   npx cap add android
   ```

## Building the Android App

1. Build the web app and sync with Capacitor:
   ```bash
   npm run cap:sync
   ```

2. Open the project in Android Studio:
   ```bash
   npm run cap:open
   ```

3. In Android Studio, wait for the project to sync, then click the "Run" button (green play icon) to run on an emulator or connected device.

4. To build a signed APK for the Play Store:
   - Go to **Build > Generate Signed Bundle / APK**.
   - Select **Android App Bundle** or **APK**.
   - Follow the wizard to create a keystore and sign your app.

## PWA Features

The app is configured as a PWA. It can be installed directly from the browser on mobile devices.

- **Manifest:** `vite-plugin-pwa` automatically generates `manifest.json`.
- **Service Worker:** Included for offline capabilities.
- **Icons:** Uses `public/icon.svg` as the app icon.

## Troubleshooting

- If you encounter issues with `npx cap open android`, ensure Android Studio is installed and the `ANDROID_HOME` environment variable is set correctly.
- If the build fails, check the console output for errors.
