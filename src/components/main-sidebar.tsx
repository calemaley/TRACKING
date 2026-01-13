'use client';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { NAV_ITEMS } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

export function MainSidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
      {NAV_ITEMS.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                { 'bg-accent text-accent-foreground': pathname === item.href }
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}

export function MainSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
            <Link
                href="/dashboard"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
                <Logo className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Scholastic Finance</span>
            </Link>
            {NAV_ITEMS.map((item) => (
                <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Link
                    href={item.href}
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                        { 'bg-accent text-accent-foreground': usePathname() === item.href }
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
            ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
