'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import { Logo } from './logo';
import { 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar,
} from './ui/sidebar';

export function MainSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 text-lg font-semibold"
        >
            <Logo className="h-6 w-6" />
            <span className="group-data-[collapsible=icon]:hidden">Scholastic</span>
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
