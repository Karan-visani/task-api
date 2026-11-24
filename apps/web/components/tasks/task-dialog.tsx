'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createTask } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function TaskDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });

      setTitle('');
      setPriority('medium');
      setOpen(false);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    createTaskMutation.mutate({
      title: title.trim(),
      completed: false,
      priority,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ Add Task</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Task title
            </label>

            <Input
              id="title"
              placeholder="e.g. Complete Week 10 TanStack Query Integration"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={createTaskMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as 'low' | 'medium' | 'high')
              }
              disabled={createTaskMutation.isPending}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {createTaskMutation.isError && (
            <p className="text-sm text-destructive">
              {createTaskMutation.error instanceof Error
                ? createTaskMutation.error.message
                : 'Failed to create task.'}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!title.trim() || createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? 'Creating...' : 'Add Task'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
