import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, TasksState } from "./task.state";
import { addTask, deleteTask, fetchTasks, updateTask, updateTaskField } from "./task.actions";

const initialState: TasksState = {
    tasks: {},
    loading: false,
    error: null,
  };
  
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTasks.pending, (state) => { 
          state.loading = true; 
          state.error = null; 
        })
        .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Record<string, Task>>) => { 
          state.loading = false; 
          state.tasks = action.payload; 
        })
        .addCase(fetchTasks.rejected, (state, action: PayloadAction<string | undefined>) => { 
          state.loading = false; 
          state.error = action.payload || 'Error fetching tasks'; 
        })
        .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => { 
          state.tasks[action.payload.id] = {
            ...action.payload,
            activity: [
              { message: "Task created", timestamp: new Date().toISOString() }
            ]
          }; 
        })
        .addCase(updateTask.fulfilled, (state, action) => {
          const { id, updates } = action.payload;
        
          if (!id || !updates || !state.tasks[id]) {
            console.error(`Update failed: Task with ID ${id} not found or updates are invalid`);
            return;
          }
        
          const task = state.tasks[id];
          const previousStatus = task.status || "Not Started";
          const newActivity = [...(task.activity || [])];
        
          // Log status change
          if (updates.status && updates.status !== previousStatus) {
            newActivity.push({
              message: `Status changed from ${previousStatus} to ${updates.status}`,
              timestamp: new Date().toISOString()
            });
          }
        
          // ✅ Log file upload only if the file is actually new
          if (
            updates.file && 
            typeof updates.file === "string" && 
            (!task.file || updates.file !== task.file)
          ) {
            newActivity.push({
              message: `You have uploaded File`,
              timestamp: new Date().toISOString()
            });
          }
        
          Object.assign(task, updates, { activity: newActivity });
        })        
        .addCase(updateTask.rejected, (state, action) => {
          console.error("Update failed:", action.payload);
        })
        .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => { 
          delete state.tasks[action.payload]; 
        })
        .addCase(updateTaskField.fulfilled, (state, action: PayloadAction<{ id: string; field: string; value: any }>) => {
          const { id, field, value } = action.payload;
          if (state.tasks[id]) {
            if (!state.tasks[id].activity) {
              state.tasks[id].activity = [];  // Ensure activity is not undefined
            }
        
            // ✅ Prevent duplicate file upload logs
            if (field === "file" && typeof value === "string" && state.tasks[id].file !== value) {
              state.tasks[id].activity.push({
                message: `You have uploaded File`,
                timestamp: new Date().toISOString()
              });
            }
        
            state.tasks[id][field] = value;
        
            if (field === "status") {
              state.tasks[id].activity.push({
                message: `Status updated to ${value}`,
                timestamp: new Date().toISOString()
              });
            }
          }
        });        

    },
  });
  
export default taskSlice.reducer;
