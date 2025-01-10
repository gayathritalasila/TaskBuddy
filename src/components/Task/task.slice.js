import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "task",
  initialState: {
    tasks: {
      Todo: [],
      "In-Progress": [],
      Completed: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      const tasks = action.payload;

      Object.keys(tasks).forEach((section) => {
        state.tasks[section] = tasks[section].map((task) => ({
          ...task,
          activityLog: task.activityLog || [], // Ensure activityLog is always an array
        }));
      });
    },
    addTask: (state, action) => {
      const { section, task } = action.payload;

      state.tasks[section].push({
        ...task,
        activityLog: task.activityLog || [], // Ensure activityLog is always an array
      });
    },
    modifyTask: (state, action) => {
      const { id, updatedTask } = action.payload;

      const currentSection = Object.keys(state.tasks).find((section) =>
        state.tasks[section].some((task) => task.id === id)
      );

      if (!currentSection) {
        console.error(`Task with ID "${id}" not found.`);
        return;
      }

      if (!updatedTask.status || !(updatedTask.status in state.tasks)) {
        console.error(`Invalid status "${updatedTask.status}" for task ID "${id}".`);
        return;
      }

      const taskIndex = state.tasks[currentSection].findIndex((task) => task.id === id);
      const task = state.tasks[currentSection][taskIndex];

      const updatedActivityLog = [
        ...(task.activityLog || []),
        {
          action: `Moved to ${updatedTask.status}`,
          timestamp: new Date().toISOString(),
        },
      ];

      const updatedTaskWithDetails = { ...task, ...updatedTask, activityLog: updatedActivityLog };

      if (currentSection !== updatedTask.status) {
        state.tasks[currentSection].splice(taskIndex, 1);
        state.tasks[updatedTask.status].push(updatedTaskWithDetails);
      } else {
        state.tasks[currentSection][taskIndex] = updatedTaskWithDetails;
      }
    },
    removeTask: (state, action) => {
      const { id, section } = action.payload;

      if (!state.tasks[section]) {
        console.error(`Section "${section}" does not exist.`);
        return;
      }

      state.tasks[section] = state.tasks[section].filter((task) => task.id !== id);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTasks, addTask, modifyTask, removeTask, setLoading, setError } =
  tasksSlice.actions;

export const selectTasks = (state) => state.task.tasks;
export const selectLoading = (state) => state.task.loading;
export const selectError = (state) => state.task.error;

export default tasksSlice.reducer;
