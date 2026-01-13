'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // Check if running on the client and if an app hasn't been initialized yet
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      // Initialize Firebase
      const firebaseApp = initializeApp(firebaseConfig);
      return getSdks(firebaseApp);
    }
    // If already initialized, return the existing instance's SDKs
    return getSdks(getApp());
  }
  // On the server, return null for all services
  return { firebaseApp: null, auth: null, firestore: null };
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
