'use client';

import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/lib/api';

export default function AdminPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-tasks'],
    queryFn: () => getTasks({ limit: 100 }),
    staleTime: 30_000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and monitor tasks across all users.
          </p>
        </div>

        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and monitor tasks across all users.
          </p>
        </div>

        <p className="text-destructive">
          {error instanceof Error ? error.message : 'Failed to load tasks.'}
        </p>
      </div>
    );
  }

  const tasks = data?.data ?? [];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and monitor tasks across all users.
        </p>
      </div>

      <div className="rounded-xl border">
        <div className="grid grid-cols-4 border-b bg-muted/40 px-5 py-3 text-sm font-medium">
          <span>Task</span>
          <span>User</span>
          <span>Status</span>
          <span>Priority</span>
        </div>

        {tasks.length === 0 ? (
          <div className="px-5 py-8 text-center text-muted-foreground">
            No tasks found.
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className={`grid grid-cols-4 px-5 py-4 text-sm ${
                index !== tasks.length - 1 ? 'border-b' : ''
              }`}
            >
              <span className="font-medium">{task.title}</span>

              <span className="text-muted-foreground">{task.user.name}</span>

              <span>{task.completed ? 'Completed' : 'Pending'}</span>

              <span className="capitalize">{task.priority}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
