'use client';

import React, { useMemo, type ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase, getSdks } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component mounts.
    // We check if the config is valid before initializing
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      const { firebaseApp } = initializeFirebase();
      if (firebaseApp) {
        setServices(getSdks(firebaseApp));
      }
    }
    setIsConfigLoaded(true);
  }, []);

  if (!isConfigLoaded || !services) {
    // While config is loading or services are initializing, show a loading indicator.
    // This prevents children from trying to access Firebase before it's ready.
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
