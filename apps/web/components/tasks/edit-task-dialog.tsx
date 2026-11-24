'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTask } from '@/lib/api';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type EditTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  initialTitle: string;
  initialCompleted: boolean;
  initialPriority: 'low' | 'medium' | 'high';
};

export function EditTaskDialog({
  open,
  onOpenChange,
  taskId,
  initialTitle,
  initialCompleted,
  initialPriority,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [completed, setCompleted] = useState(initialCompleted);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialPriority,
  );

  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });

      onOpenChange(false);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    updateTaskMutation.mutate({
      id: taskId,
      input: {
        title: title.trim(),
        completed,
        priority,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor={`edit-title-${taskId}`}
              className="text-sm font-medium"
            >
              Task title
            </label>

            <Input
              id={`edit-title-${taskId}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={updateTaskMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`edit-priority-${taskId}`}
              className="text-sm font-medium"
            >
              Priority
            </label>

            <select
              id={`edit-priority-${taskId}`}
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as 'low' | 'medium' | 'high')
              }
              disabled={updateTaskMutation.isPending}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) => setCompleted(event.target.checked)}
              disabled={updateTaskMutation.isPending}
            />
            Completed
          </label>

          {updateTaskMutation.isError && (
            <p className="text-sm text-destructive">
              {updateTaskMutation.error instanceof Error
                ? updateTaskMutation.error.message
                : 'Failed to update task.'}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!title.trim() || updateTaskMutation.isPending}
          >
            {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
