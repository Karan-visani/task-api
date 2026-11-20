const stats = [
  {
    title: 'Total Tasks',
    value: '12',
    description: 'All tasks',
  },
  {
    title: 'Pending',
    value: '7',
    description: 'Tasks to complete',
  },
  {
    title: 'Completed',
    value: '5',
    description: 'Tasks finished',
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <p className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </p>

          <p className="mt-2 text-3xl font-bold">{stat.value}</p>

          <p className="mt-1 text-xs text-muted-foreground">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
