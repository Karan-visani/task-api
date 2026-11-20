import { TaskActions } from '@/components/tasks/task-actions';
import { TaskDialog } from '@/components/tasks/task-dialog';

const tasks = [
  {
    title: 'Finish Next.js UI',
    description: 'Build the frontend foundation',
    status: 'In Progress',
    date: '20 Nov 2026',
  },
  {
    title: 'Complete API validation',
    description: 'Finish Week 9',
    status: 'Pending',
    date: '21 Nov 2026',
  },
  {
    title: 'TypeScript practice',
    description: 'Review generics and utility types',
    status: 'Completed',
    date: '19 Nov 2026',
  },
];

export default function TasksPage() {
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

      <div className="overflow-hidden rounded-xl border">
        {tasks.map((task, index) => (
          <div
            key={task.title}
            className={`flex items-center justify-between p-5 ${
              index !== tasks.length - 1 ? 'border-b' : ''
            }`}
          >
            <div>
              <h2 className="font-medium">{task.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{task.status}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {task.date}
                </p>
              </div>

              <TaskActions />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
