# Task Management Application

## Overview
The **Task Management Application** is a responsive React-based platform that allows users to efficiently create, organize, and track their tasks. The application integrates with Firebase for user authentication and provides features such as task categorization, drag-and-drop organization, sorting by due dates, and multiple views (board and list).

## Features
### 1. User Authentication
- **Sign in with Google**: Users can log in securely using their Google account via Firebase Authentication.

### 2. Task Management
- **Create Tasks**: Add new tasks with a title, description, category (work or personal), due date, and status.
- **Edit Tasks**: Modify existing task details.
- **Delete Tasks**: Remove tasks permanently.
- **Categorization**: Tasks can be categorized as `Work` or `Personal`.
- **Due Dates**: Set due dates for tasks to stay on schedule.

### 3. Task Organization
- **Drag-and-Drop**: Organize tasks seamlessly across different sections (Todo, In-Progress, Completed).
- **Sorting**: Sort tasks based on due dates.
- **Board/List Views**: Switch between board view and list view for different task management experiences.

### 4. Responsive Design
- Fully responsive interface that adapts to various screen sizes for desktop, tablet, and mobile devices.

## Technology Stack
- **Frontend**: React, Material-UI for UI components.
- **Backend**: Firebase for authentication and real-time database.
- **State Management**: React Query.
- **Drag-and-Drop**: `react-beautiful-dnd` library.
- **Date Management**: `dayjs` for handling dates.

## Installation

### Prerequisites
- Node.js and npm installed.
- Firebase account.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/gayathritalasila/TaskBuddy.git
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a new project in Firebase.
   - Enable Google Authentication in Firebase Authentication.
   - Set up a Firestore database.
   - Copy your Firebase configuration and replace the placeholder values in the `.env` file:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

4. Start the application:
   ```bash
   npm start
   ```

## Usage

### Creating Tasks
- Open the "Create Task" dialog by clicking the "Add Task" button.
- Fill in the required fields (title, category, due date, and status) and submit.

### Managing Tasks
- **Edit**: Use the "More" menu (`...`) on a task to select the Edit option.
- **Delete**: Select Delete from the same menu.

### Organizing Tasks
- Drag and drop tasks across sections (Todo, In-Progress, Completed) to update their status.
- Sort tasks by due dates using the sort feature.

### Switching Views
- Toggle between board and list views for better task visualization.

## Project Structure
```
/src
|-- /components
|   |-- CreateTaskDialog.jsx   // Dialog for creating and editing tasks
|   |-- BoardView.jsx          // Board view with drag-and-drop
|   |-- TaskListView.jsx       // List view for tasks
|
|-- /redux
|   |-- task.actions.js        // Task-related actions
|   |-- task.reducer.js        // Task-related reducer
|
|-- App.js                    // Main application component
|-- index.js                  // Entry point
```

## Acknowledgments
- Material-UI for design components.
- `react-beautiful-dnd` for drag-and-drop functionality.
- Firebase for backend and authentication support.

