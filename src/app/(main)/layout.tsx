'use client';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MainSidebar } from '@/components/main-sidebar';
import { MainHeader } from '@/components/main-header';
import { useUser } from '@/firebase';
import { useEffect } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If auth state is not loading and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // While loading or if no user, show a loading state or nothing to prevent content flash.
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <MainSidebar />
      <div className="flex flex-1 flex-col sm:ml-14">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
