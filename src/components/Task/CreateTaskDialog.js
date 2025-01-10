import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CreateTaskDialog = ({ open, onClose, onCreateTask }) => {
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: null,
    category: "Work",
    status: "",
    attachment: null,
  });

  const handleInputChange = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateTask = () => {
    const task = {
      ...newTask,
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : null,
      id: Date.now().toString(), // Unique ID
    };
    onCreateTask(task);
    onClose(); // Close dialog after task creation
    setNewTask({
      name: "",
      description: "",
      dueDate: null,
      category: "Work",
      status: "",
      attachment: null,
    }); 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
        Create Task
      </DialogTitle>
      <DialogContent>
        {/* Title Field */}
        <TextField
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              fontSize: "16px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />

        {/* Description Field */}
        <TextField
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          InputProps={{
            style: {
              fontSize: "16px",
              padding: "10px",
              borderRadius: "8px",
            },
          }}
        />
        <Typography
          variant="caption"
          color="textSecondary"
          style={{ display: "block", textAlign: "right", marginTop: "4px" }}
        >
          0/300 characters
        </Typography>

        {/* Category Buttons */}
        <div style={{ marginTop: "16px" }}>
          <Typography variant="subtitle2" gutterBottom>
            Task Category*
          </Typography>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant={newTask.category === "Work" ? "contained" : "outlined"}
              onClick={() => handleInputChange("category", "Work")}
              style={{
                textTransform: "none",
                borderRadius: "20px",
                padding: "6px 16px",
              }}
            >
              Work
            </Button>
            <Button
              variant={newTask.category === "Personal" ? "contained" : "outlined"}
              onClick={() => handleInputChange("category", "Personal")}
              style={{
                textTransform: "none",
                borderRadius: "20px",
                padding: "6px 16px",
              }}
            >
              Personal
            </Button>
          </div>
        </div>

        {/* Due Date */}
        <div style={{ marginTop: "16px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due on*"
              value={newTask.dueDate}
              onChange={(date) => handleInputChange("dueDate", date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { fontSize: "16px", padding: "10px" },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </div>

        {/* Task Status Dropdown */}
        <TextField
          select
          label="Task Status*"
          value={newTask.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: { fontSize: "16px", padding: "10px" },
          }}
        >
          <MenuItem value="Todo">Todo</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        {/* Attachment Section */}
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Typography variant="subtitle2" gutterBottom>
            Attachment
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ cursor: "pointer" }}
          >
            Drop your files here or{" "}
            <Button
              variant="text"
              color="primary"
              size="small"
              style={{ textTransform: "none", padding: 0 }}
            >
              Update
            </Button>
          </Typography>
        </div>
      </DialogContent>

      <DialogActions style={{ justifyContent: "space-between", padding: "16px" }}>
        <Button
          onClick={onClose}
          style={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateTask}
          variant="contained"
          style={{
            textTransform: "none",
            backgroundColor: "#C084FC",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
