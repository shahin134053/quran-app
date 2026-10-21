import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alshahin.quranapp',
  appName: 'Al-Shahin Quran',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
