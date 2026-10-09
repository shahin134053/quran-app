import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.almuneer.quran',
  appName: 'Al Muneer Quran',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
