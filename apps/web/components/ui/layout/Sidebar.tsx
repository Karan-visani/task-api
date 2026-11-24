'use client';
import {
  LayoutDashboard,
  CheckSquare,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../button';
import { getMe, logout } from '@/lib/api';
import { useEffect, useState } from 'react';
const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: ShieldCheck,
  },
];

export const Sidebar = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getMe()
      .then((user) => {
        setIsAdmin(user.role === 'admin');
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  }
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-semibold">
          TaskFlow
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          if (item.href === '/admin' && !isAdmin) {
            return null;
          }

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
