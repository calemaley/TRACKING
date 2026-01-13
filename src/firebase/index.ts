'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }
  
  // When deployed to App Hosting, these variables are automatically provided.
  // When running locally, they will be loaded from .env.
  const isAppHosting = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  let firebaseApp;
  if (isAppHosting) {
    // If NEXT_PUBLIC_ vars are set (e.g. on Netlify or local .env), use them.
    firebaseApp = initializeApp(firebaseConfig);
  } else {
     // Otherwise, try to initialize with App Hosting's auto-config.
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      console.error("Automatic Firebase initialization failed. Falling back to firebaseConfig.", e);
      // Fallback for cases where auto-init is expected but fails.
      firebaseApp = initializeApp(firebaseConfig);
    }
  }

  return getSdks(firebaseApp);
}


export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';