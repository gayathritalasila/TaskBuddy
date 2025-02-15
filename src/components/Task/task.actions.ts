import { createAsyncThunk } from '@reduxjs/toolkit';
import FirebaseApp from '../../firebase';
import { Task } from './task.state';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import dayjs from 'dayjs';

const db = getFirestore(FirebaseApp);
const storage = getStorage(FirebaseApp);

// Async thunk to fetch tasks from Firebase

export const fetchTasks = createAsyncThunk<Record<string, Task>, void, { rejectValue: string }>(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasks: Record<string, Task> = {}; // Store tasks as an object instead of an array

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Convert Firestore timestamps to JavaScript Date objects
        const convertTimestamp = (timestamp: any) => {
          if (!timestamp) return new Date();
          if (timestamp.toDate) return timestamp.toDate();
          if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
          return new Date(timestamp);
        };

        tasks[doc.id] = {
          id: doc.id,
          title: data.title || "",
          file: data.file,
          userId: data.userId || "",
          category: data.category || "",
          dueDate: convertTimestamp(data.dueDate),
          description: data.description || "",
          status: data.status || "pending",
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
          completed: data.completed ?? false,
          position: data.position ?? 0,
          activity: data.activity || [],
        };
      });

      console.log("Fetched tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTask = createAsyncThunk<
  Task, // Expected return type
  Task, // Input parameter type
  { rejectValue: string }
>(
  "tasks/addTask",
  async (task, { rejectWithValue }) => {
    try {
      let fileUrl: string | null = null;
      let fileUploadMessage: string | null = null;

      // Ensure `task.file` is a valid File object before uploading
      if (task.file && typeof task.file !== "string" && task.file instanceof File) {
        const fileRef = storageRef(storage, `tasks/${task.file.name}`);
        await uploadBytes(fileRef, task.file);
        fileUrl = await getDownloadURL(fileRef);
        fileUploadMessage = `File "${task.file.name}" uploaded on ${dayjs().format("MMM DD, YYYY")}`;
      } else if (typeof task.file === "string") {
        fileUrl = task.file; // Keep existing URL if already uploaded
      }

      // Prevent unnecessary properties from being stored in Firestore
      const { id, file, ...taskData } = task;

      const activity = [
        { message: `Task "${task.title}" created`, timestamp: new Date().toISOString() },
        ...(fileUploadMessage ? [{ message: fileUploadMessage, timestamp: new Date().toISOString() }] : []),
      ];


      // Add task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        file: fileUrl, // Store URL, not File object
        activity,
      });

      return { ...task, id: docRef.id, file: fileUrl, activity };
    } catch (error) {
      console.error("Error adding task:", error);
      return rejectWithValue((error as Error).message) as unknown as Task;
    }
  }
);

export const updateTask = createAsyncThunk<
  { id: string; updates: Partial<Task> },
  { id: string; updates: Partial<Task> },
  { rejectValue: string }
>(
  "tasks/updateTask",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, "tasks", id);
      const taskSnapshot = await getDoc(taskRef);

      if (!taskSnapshot.exists()) {
        return rejectWithValue("Task not found");
      }

      const existingTask = taskSnapshot.data();
      const currentActivity = existingTask.activity || [];
      const previousStatus = existingTask.status || "Not Started";
      const previousFile = existingTask.file;

      console.log("Existing Task Data:", existingTask);
      console.log("Updates Received:", updates);


      const newActivity: { message: string; timestamp: string }[] = [];

      // Status update logging
      if (updates.status && updates.status !== previousStatus) {
        newActivity.push({
          message: `Status changed from ${previousStatus} to ${updates.status}`,
          timestamp: new Date().toISOString(),
        });
      }

      // Ensure file upload is logged **only if a new file is uploaded**
      if (
        updates.file && // Check if file exists
        typeof updates.file === "string" && // Ensure it's a string
        (!existingTask.file || updates.file !== existingTask.file) // Only log if file is NEW
      ) {
        console.log("New file uploaded:", updates.file);
        newActivity.push({
          message: `You have uploaded a file.`,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log("No new file detected. Skipping file upload log.");
      }

      const updatedActivity = [...currentActivity, ...newActivity];

      // Sanitize updates to prevent overriding with undefined values
      const sanitizedUpdates: Partial<Task> = {
        ...updates,
        file: updates.file && typeof updates.file === "string" ? updates.file : existingTask.file, // Keep old file if not updated
        dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : existingTask.dueDate, // Ensure correct format
        activity: updatedActivity,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(taskRef, sanitizedUpdates);

      return { id, updates: sanitizedUpdates };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);



export const updateTaskField = createAsyncThunk<
  { id: string; field: string; value: any },
  { id: string; field: string; value: any },
  { rejectValue: string }
>(
  "tasks/updateTaskField",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, "tasks", id);
      // Add activity log
      const activityMessage = `Updated ${field} to ${value}`;
      const timestamp = new Date().toISOString();

      await updateDoc(taskRef, {
        [field]: value,
        activity: arrayUnion({ message: activityMessage, timestamp }),
        updatedAt: timestamp,
      });

      return { id, field, value };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);


export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, "tasks", id);

      // Add deletion log before deleting
      await updateDoc(taskRef, {
        activity: arrayUnion({ message: "Task deleted", timestamp: new Date().toISOString() }),
      });

      // Proceed with deletion
      await deleteDoc(taskRef);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTasks = createAsyncThunk<string[], string[], { rejectValue: string }>(
  "tasks/deleteTasks",
  async (ids, { rejectWithValue }) => {
    try {
      const deletePromises = ids.map(async (id) => {
        const taskRef = doc(db, "tasks", id);

        // Log deletion before deleting
        await updateDoc(taskRef, {
          activity: arrayUnion({ message: "Task deleted", timestamp: new Date().toISOString() }),
        });

        // Delete the document
        await deleteDoc(taskRef);
        return id;
      });

      const deletedIds = await Promise.all(deletePromises);
      return deletedIds;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
 