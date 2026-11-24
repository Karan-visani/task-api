'use client';

import { getTasks } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function RecentTasks() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tasks', { limit: 5, order: 'desc' }],
    queryFn: () =>
      getTasks({
        limit: 5,
        order: 'desc',
      }),
    staleTime: 30_000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border p-6">
        <h2 className="font-semibold">Recent Tasks</h2>

        <div className="mt-6 space-y-4">
          <div className="h-12 animate-pulse rounded-md bg-muted" />
          <div className="h-12 animate-pulse rounded-md bg-muted" />
          <div className="h-12 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border p-6">
        <h2 className="font-semibold">Recent Tasks</h2>

        <p className="mt-4 text-sm text-destructive">
          Failed to load recent tasks.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {error instanceof Error ? error.message : 'Something went wrong.'}
        </p>
      </div>
    );
  }

  const tasks = data?.data ?? [];

  return (
    <div className="rounded-xl border p-6">
      <div>
        <h2 className="font-semibold">Recent Tasks</h2>

        <p className="mt-1 text-sm text-muted-foreground">Your latest tasks</p>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">No tasks yet</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first task to see it here.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Priority: {task.priority}
                </p>
              </div>

              <span className="text-sm font-medium">
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
