import { Platform } from 'react-native';

// In Expo/React Native, localhost points to the device itself.
// On Android emulator use 10.0.2.2; on web/iOS use localhost.
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();
