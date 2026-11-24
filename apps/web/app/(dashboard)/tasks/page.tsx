'use client';

import { TaskActions } from '@/components/tasks/task-actions';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { Button } from '@/components/ui/button';
import { getTasks } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function TasksPage() {
  const [cursor, setCursor] = useState<number | undefined>();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tasks', { cursor }],
    queryFn: () =>
      getTasks({
        cursor,
        limit: 10,
      }),
    staleTime: 30_000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading tasks...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-8">
        <p>Failed to load tasks.</p>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const tasks = data?.data;
  const nextCursor = data?.nextCursor;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your tasks and stay organized.
          </p>
        </div>

        <TaskDialog />
      </div>

      {tasks?.length === 0 && (
        <div className="p-10 text-center">
          <h2 className="font-medium">No tasks yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first task to get started.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border">
        {tasks?.map((task, index) => (
          <div
            key={task.title}
            className={`flex items-center justify-between p-5 ${
              index !== tasks.length - 1 ? 'border-b' : ''
            }`}
          >
            <h2 className="font-medium">{task.title}</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Priority: {task.priority}
            </p>

            <p className="text-sm font-medium">
              {task.completed ? 'Completed' : 'Pending'}
            </p>
            <TaskActions
              taskId={task.id}
              title={task.title}
              completed={task.completed}
              priority={task.priority}
            />
          </div>
        ))}

        {nextCursor != null && (
          <div className="flex justify-center p-4">
            <Button type="button" onClick={() => setCursor(nextCursor)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
