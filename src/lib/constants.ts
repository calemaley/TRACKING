import { LayoutDashboard, Users, ArrowRightLeft, type LucideIcon } from 'lucide-react';

type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: '/students',
        label: 'Students',
        icon: Users,
    },
    {
        href: '/transactions',
        label: 'Transactions',
        icon: ArrowRightLeft,
    },
];
