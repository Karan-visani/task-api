import { DashboardHeader } from '../../components/ui/layout/dashboard-header';
import { Sidebar } from '@/components/ui/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
