const tasks = [
  {
    title: 'Finish Next.js UI',
    status: 'In Progress',
  },
  {
    title: 'Review API documentation',
    status: 'Pending',
  },
  {
    title: 'Complete TypeScript practice',
    status: 'Completed',
  },
];

export function RecentTasks() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Recent Tasks</h2>
        <p className="text-sm text-muted-foreground">
          Your latest tasks at a glance.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        {tasks.map((task, index) => (
          <div
            key={task.title}
            className={`flex items-center justify-between p-4 ${
              index !== tasks.length - 1 ? 'border-b' : ''
            }`}
          >
            <p className="text-sm font-medium">{task.title}</p>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
