const tasks = [
  {
    title: 'Finish Next.js UI',
    user: 'Karan',
    status: 'In Progress',
  },
  {
    title: 'Complete API validation',
    user: 'Rahul',
    status: 'Pending',
  },
  {
    title: 'TypeScript practice',
    user: 'Priya',
    status: 'Completed',
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and monitor tasks across all users.
        </p>
      </div>

      <div className="rounded-xl border">
        <div className="grid grid-cols-3 border-b bg-muted/40 px-5 py-3 text-sm font-medium">
          <span>Task</span>
          <span>User</span>
          <span>Status</span>
        </div>

        {tasks.map((task, index) => (
          <div
            key={`${task.title}-${task.user}`}
            className={`grid grid-cols-3 px-5 py-4 text-sm ${
              index !== tasks.length - 1 ? 'border-b' : ''
            }`}
          >
            <span className="font-medium">{task.title}</span>
            <span className="text-muted-foreground">{task.user}</span>
            <span>{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
