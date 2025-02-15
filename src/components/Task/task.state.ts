export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    category: string;
    tags?: string[];
    file?: string | File | null;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    completed: boolean;
    position: number;
    status: string;
    activity: { message: string; timestamp: string }[];
}

export interface TasksState {
    tasks: Record<string, Task>;
    loading: boolean;
    error: string | null;
}