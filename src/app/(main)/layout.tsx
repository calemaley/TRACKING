import type { ReactNode } from 'react';
import { MainSidebar } from '@/components/main-sidebar';
import { MainHeader } from '@/components/main-header';

export default function MainLayout({ children }: { children: ReactNode }) {
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
