# 📖 Al-Shahin Quran (আল-শাহীন কুরআন)

[![Latest Release](https://img.shields.io/badge/Release-v2.0.1%20Latest-emerald?style=for-the-badge&logo=android)](https://github.com/shahin134053/quran-app/releases/tag/v2.0.1)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-blue?style=for-the-badge)](https://github.com/shahin134053/quran-app/releases/tag/v2.0.1)

---

### 📌 অফিশিয়াল পিন্ড রিলিজ (Latest Official Release v2.0.1):
| প্ল্যাটফর্ম / ফাইল | বিবরণ | সরাসরি ডাউনলোড |
| :--- | :--- | :--- |
| 📲 **Android APK** | সরাসরি ফোনে ইনস্টলযোগ্য সাইনড APK (Direct Install) | [📥 Download APK (v2.0.1)](https://github.com/shahin134053/quran-app/releases/download/v2.0.1/Al-Shahin-Quran-release.apk) |
| 📦 **Google Play Bundle** | প্লে স্টোরে আপলোডের জন্য প্রস্তুত সাইনড AAB ফাইল | [📥 Download AAB (v2.0.1)](https://github.com/shahin134053/quran-app/releases/download/v2.0.1/Al-Shahin-Quran-release.aab) |
| 🍎 **iPhone & Web Bundle** | আইফোন Safari ও অফলাইন ব্যবহারের PWA জিপ ফাইল | [📥 Download iOS WebApp](https://github.com/shahin134053/quran-app/releases/download/v2.0.1/Al-Shahin-Quran-iOS-WebApp.zip) |

🔗 **[সম্পূর্ণ রিলিজ নোটস ও ফাইল দেখুন](https://github.com/shahin134053/quran-app/releases/tag/v2.0.1)**

---

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
