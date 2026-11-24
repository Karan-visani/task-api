'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { deleteTask } from '@/lib/api';
import { EditTaskDialog } from './edit-task-dialog';

type TaskActionsProps = {
  taskId: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

export function TaskActions({
  taskId,
  title,
  completed,
  priority,
}: TaskActionsProps) {
  const [editOpen, setEditOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
  });

  function handleDelete() {
    deleteTaskMutation.mutate(taskId);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Task actions" />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
            className="text-destructive"
          >
            <Trash2 className="size-4" />
            {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTaskDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        taskId={taskId}
        initialTitle={title}
        initialCompleted={completed}
        initialPriority={priority}
      />
    </>
  );
}
