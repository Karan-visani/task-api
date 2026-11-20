import { RecentTasks } from '../../../components/dashboard/recent-tasks';
import { StatsCards } from '../../../components/dashboard/stats-cards';

export default function Home() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-semibold">Good morning, Karan 👋</h2>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what&apos;s happening with your tasks.
        </p>
      </div>

      <StatsCards />

      <RecentTasks />
    </div>
  );
}
