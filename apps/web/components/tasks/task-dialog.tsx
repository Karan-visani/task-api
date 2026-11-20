'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function TaskDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>+ New Task</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
          <DialogDescription>
            Add a task to your task list. You can edit it later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" placeholder="e.g. Finish Next.js UI" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea id="description" placeholder="Describe the task..." />
          </div>
        </div>

        <DialogFooter>
          <Button type="button">Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
