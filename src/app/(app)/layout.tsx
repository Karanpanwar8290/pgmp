'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  User,
  BookOpen,
  Settings,
  BarChart2,
  MessageCircle,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { UserProfile } from '@/components/user-profile';
import { Separator } from '@/components/ui/separator';
import { UserNav } from '@/components/user-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold font-headline">Wellbeing Navigator</span>
          </div>
          <div className='md:hidden'>
            <UserNav />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="AI Coach" isActive={pathname === '/chat'}>
                <Link href="/chat">
                  <MessageCircle />
                  <span>AI Coach</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Analytics" isActive={pathname === '/analytics'}>
                <Link href="/analytics">
                  <BarChart2 />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Resources" isActive={pathname === '/resources'}>
                <Link href="/resources">
                  <BookOpen />
                  <span>Resources</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Profile" isActive={pathname === '/profile'}>
                <Link href="/profile">
                  <User />
                  <span>My Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/settings'}>
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <Separator className="my-2" />
          <UserProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
