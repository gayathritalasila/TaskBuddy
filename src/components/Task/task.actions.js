import { collection, getDoc, updateDoc, doc, getFirestore,setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "firebase/auth";
import FirebaseApp from '../../firebase';
import { setTasks, addTask, modifyTask, removeTask, setLoading, setError } from './task.slice';

const db = getFirestore(FirebaseApp);
const tasksCollection = collection(db, 'task');

export const fetchTasksFromFirebase = () => async (dispatch) => {
  dispatch(setLoading(true)); // Set loading to true before starting the fetch
  try {
    const auth = getAuth(); // Get the Firebase Auth instance
    const user = auth.currentUser; // Get the current user
    if (!user) {
      throw new Error("User not authenticated");
    }

    const tasksRef = doc(db, "tasks", "taskData"); // Reference the tasks document
    const docSnapshot = await getDoc(tasksRef); // Fetch the document

    if (docSnapshot.exists()) {
      const tasksData = docSnapshot.data(); // Get the tasks data
      const filteredTasks = {};

      // Filter tasks for the current user
      Object.keys(tasksData).forEach((section) => {
        filteredTasks[section] = tasksData[section].filter(
          (task) => task.userId === user.uid
        );
      });

      dispatch(setTasks(filteredTasks)); // Dispatch filtered tasks to Redux
    } else {
      console.log("No tasks found in Firebase.");
    }
  } catch (error) {
    dispatch(setError(error.message)); // Set error if the operation fails
    console.error("Error fetching tasks from Firebase: ", error);
  } finally {
    dispatch(setLoading(false)); // Set loading to false when fetch is complete
  }
};


export const addTaskToFirebase = (task, section) => async (dispatch) => {
  console.log(task, section);
  dispatch(setLoading(true)); // Set loading to true while adding a task
  try {
    const auth = getAuth(); // Get the Firebase Auth instance
    const user = auth.currentUser; // Get the current user
    if (!user) {
      throw new Error("User not authenticated");
    }

    const newTask = { ...task, id: uuidv4(), userId: user.uid }; // Add userId to the task
    const tasksRef = doc(db, "tasks", "taskData"); // Referencing the taskData document
    const docSnapshot = await getDoc(tasksRef); // Fetch the document

    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      currentData[section] = currentData[section] || [];
      currentData[section].push(newTask);
      await updateDoc(tasksRef, currentData); // Update Firestore
      dispatch(addTask({ section, task: newTask })); // Update Redux store
    } else {
      const initialData = {
        [section]: [newTask], // Initialize with the new task
      };
      await setDoc(tasksRef, initialData); // Set Firestore data
      dispatch(addTask({ section, task: newTask })); // Update Redux store
    }
  } catch (error) {
    dispatch(setError(error.message)); // Set error if the operation fails
    console.error("Error adding task to Firebase: ", error);
  } finally {
    dispatch(setLoading(false)); // Set loading to false when the operation completes
  }
};

export const removeTaskFromFirebase = (id, section) => async (dispatch) => {
  dispatch(setLoading(true)); // Show loading indicator during deletion
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const tasksRef = doc(db, "tasks", "taskData");
    const docSnapshot = await getDoc(tasksRef);

    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();

      if (!currentData[section] || !Array.isArray(currentData[section])) {
        throw new Error(`Section "${section}" does not exist.`);
      }

      const taskToDelete = currentData[section].find((task) => task.id === id);

      // Check if the task belongs to the logged-in user
      if (!taskToDelete || taskToDelete.userId !== user.uid) {
        throw new Error("Unauthorized action. You can only delete your own tasks.");
      }

      // Remove the task from the current section
      await updateDoc(tasksRef, {
        [`${section}`]: arrayRemove(taskToDelete),
      });

      dispatch(removeTask({ id, section })); // Update Redux store
    } else {
      throw new Error("Task document does not exist.");
    }
  } catch (error) {
    dispatch(setError(error.message)); // Handle errors gracefully
    console.error("Error deleting task from Firebase: ", error);
  } finally {
    dispatch(setLoading(false)); // Hide loading indicator
  }
};

export const editTaskInFirebase = (id, updatedTask, currentSection) => async (dispatch) => {
  dispatch(setLoading(true)); // Show loading indicator during the update operation
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const tasksRef = doc(db, "tasks", "taskData");
    const docSnapshot = await getDoc(tasksRef);

    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();
      const newSection = updatedTask.status;

      // Ensure the current section exists
      if (!currentData[currentSection] || !Array.isArray(currentData[currentSection])) {
        throw new Error(`Section "${currentSection}" does not exist.`);
      }

      const taskToEdit = currentData[currentSection].find((task) => task.id === id);

      // Check if the task belongs to the logged-in user
      if (!taskToEdit || taskToEdit.userId !== user.uid) {
        throw new Error("Unauthorized action. You can only edit your own tasks.");
      }

      if (currentSection !== newSection) {
        // Remove the task from the current section
        await updateDoc(tasksRef, {
          [`${currentSection}`]: arrayRemove(taskToEdit),
        });

        // Add the updated task to the new section
        await updateDoc(tasksRef, {
          [`${newSection}`]: arrayUnion({ ...taskToEdit, ...updatedTask }),
        });
      } else {
        // Update the task within the same section
        const updatedSection = currentData[currentSection].map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        );

        await updateDoc(tasksRef, {
          [currentSection]: updatedSection,
        });
      }

      dispatch(modifyTask({ id, updatedTask, section: newSection })); // Update Redux
    } else {
      throw new Error("Task document does not exist.");
    }
  } catch (error) {
    dispatch(setError(error.message)); // Handle errors gracefully
    console.error("Error editing task in Firebase: ", error);
  } finally {
    dispatch(setLoading(false)); // Hide loading indicator
  }
};


export const updateTaskStatus = (taskId, status) => async (dispatch, getState) => {
  dispatch(setLoading(true)); // Start the loading indicator
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    dispatch(setError("User not authenticated"));
    dispatch(setLoading(false));
    return;
  }

  const state = getState();
  const task = Object.values(state.task.tasks || {})
    .flat()
    .find((t) => t.id === taskId);

  if (!task || task.userId !== user.uid) {
    dispatch(setError("Unauthorized action. You can only update your own tasks."));
    dispatch(setLoading(false));
    return;
  }

  const currentSection = task.status;
  const updatedTask = { ...task, status };

  const tasksRef = doc(db, "tasks", "taskData");

  try {
    await updateDoc(tasksRef, {
      [`${currentSection}`]: arrayRemove(task), // Remove task from current section
      [`${status}`]: arrayUnion(updatedTask), // Add task to new section
    });

    dispatch(modifyTask({ id: taskId, updatedTask, section: status })); // Update Redux store
  } catch (error) {
    console.error("Error updating task status in Firebase:", error);
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false)); // End the loading indicator
  }
};
