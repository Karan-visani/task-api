import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-8">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Karan</p>
          <p className="text-xs text-muted-foreground">User</p>
        </div>

        <Avatar>
          <AvatarFallback>KV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
