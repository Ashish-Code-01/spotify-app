import React from 'react';
import Main from './Main.jsx';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file',
  );
}

// Token Cache Implementation for Clerk
const tokenCache = {
  async getToken(key) {
    try {
      const token = await SecureStore.getItemAsync(key);
      if (token) {
        console.log(`Token retrieved for key "${key}":`, token);
      } else {
        console.warn(`No token found under key "${key}".`);
      }
      return token;
    } catch (error) {
      console.error(`Error retrieving token from SecureStore for key "${key}":`, error);
      return null; // Return null if retrieval fails
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Token saved under key "${key}".`);
    } catch (error) {
      console.error(`Error saving token to SecureStore for key "${key}":`, error);
    }
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Main />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
