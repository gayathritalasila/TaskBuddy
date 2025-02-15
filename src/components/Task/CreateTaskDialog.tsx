import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import FirebaseApp from "../../firebase";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Box,
  List, ListItem, ListItemText, Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { addTask, updateTask } from "./task.actions";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { Task } from "./task.state";
import { RootState } from "../../../rootReducer";
import { AppDispatch } from "../../../reduxStore";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  taskData?: Task | null;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ open, onClose, taskData }) => {
  const isEditing = Boolean(taskData);
  const users = useSelector((state: RootState) => state.login.user);
  const [filePreview, setFilePreview] = useState<string | File | null>(null);
  const storage = getStorage(FirebaseApp);
  const theme = useTheme();
  const isMobile = window.innerWidth <= 768;
  const [activeTab, setActiveTab] = useState(0);
  const [newTask, setNewTask] = useState<Task>({
    id: "",
    userId: users?.uid || "",
    title: "",
    description: "",
    category: "",
    status: "TO-DO",
    tags: [],
    file: null,
    dueDate: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    position: 0,
    activity: [],
  });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (taskData) {
      setNewTask({
        ...taskData,
        activity: taskData.activity || [],
      });

      if (taskData.file) {
        // Set file preview for files fetched from the backend
        setFilePreview(taskData.file);
      } else{
        setFilePreview(null);
      }
    }
  }, [taskData]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      handleInputChange("file", uploadedFile);

      // Revoke previous preview URL to prevent memory leaks
      if (typeof filePreview === "string") {
        URL.revokeObjectURL(filePreview);
      }

      // Create new preview URL
      const previewUrl = URL.createObjectURL(uploadedFile);
      setFilePreview(previewUrl);
    }
  };

  const handleRemoveFile = () => {
    handleInputChange("file", null);
    setFilePreview(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: field === "dueDate" && value ? dayjs(value).toISOString() : value,
    }));
  };

  const handleCreateOrUpdateTask = async () => {
    if (!newTask.title.trim()) return;

    let fileURL: string| null = null;

    if (newTask.file instanceof File) {
      const fileRef = ref(storage, `tasks/${newTask.file.name}`);
      await uploadBytes(fileRef, newTask.file);
      fileURL = await getDownloadURL(fileRef);
    }

    const taskToSave: Task = {
      id: newTask.id || "", // Ensure id is always a string
      userId: users?.uid || "",
      title: newTask.title,
      description: newTask.description || "",
      category: newTask.category,
      status: newTask.status,
      tags: newTask.tags || [],
      file: fileURL || (typeof newTask.file === "string" ? newTask.file : null),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : "", 
      createdAt: newTask.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: newTask.completed,
      position: newTask.position,
      activity: newTask.activity || [], // Ensure activity is always an array
    };

    if (newTask.id) {
      // Updating existing task
      dispatch(updateTask({ id: newTask.id, updates: taskToSave }));
    } else {
      // Creating new task
      dispatch(addTask({ ...taskToSave, createdAt: new Date().toISOString() }));
    }

    setNewTask({
      id: "",
      userId: users?.uid || "",
      title: "",
      description: "",
      category: "",
      status: "TO-DO",
      tags: [],
      file: null,
      dueDate: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      position: 0,
      activity: [],
    });

    setFilePreview(null);
    onClose();
  };

  const handleClose = () => {
    setNewTask({
      id: "",
      userId: users?.uid || "",
      title: "",
      description: "",
      category: "",
      status: "TO-DO",
      tags: [],
      file: null,
      dueDate: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      position: 0,
      activity: [],
    });
    setFilePreview(null);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { width: "900px", maxWidth: "90vw" } }}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #E0E0E0",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: "1.1rem",
          px: 3,
          py: 2,
        }}
      >
        {isEditing ? "Edit Task" : "Create Task"}
        <IconButton onClick={handleClose} sx={{ color: "black" }}>
          ✕
        </IconButton>
      </DialogTitle>

{/* Tabs Navigation */}
{isMobile &&(
<Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Details" />
        <Tab label="Activity Log" disabled={!isEditing} />
      </Tabs>
)}
      
      <DialogContent>
        {/* Title */}
        {isMobile ? (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Left Section: Task Form */}
          {activeTab === 0 &&(
          <Box sx={{ flex: 2, minWidth: "60%" }}>
            <TextField
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                sx: { fontSize: "16px", padding: "10px", borderRadius: "8px" },
              }}
            />

            {/* Description */}
            <TextField
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              InputProps={{
                sx: { fontSize: "16px", padding: "10px", borderRadius: "8px" },
              }}
            />
            <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 1 }}>
              {newTask.description?.length}/300 characters
            </Typography>

            {/* Task Category, Due Date, and Status - in one row */}
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              {/* Task Category */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Task Category*</Typography>
                <ToggleButtonGroup
                  value={newTask.category}
                  exclusive
                  onChange={(e, value) => value && handleInputChange("category", value)}
                  sx={{ display: "flex", gap: 1 }}
                >
                  <ToggleButton value="Work" sx={{ textTransform: "none", borderRadius: "20px" }}>
                    Work
                  </ToggleButton>
                  <ToggleButton value="Personal" sx={{ textTransform: "none", borderRadius: "20px" }}>
                    Personal
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Due Date */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Due on*</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={newTask.dueDate ? dayjs(newTask.dueDate) : null}
                    onChange={(date) => handleInputChange("dueDate", date ? date.toISOString() : "")}
                    // renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Box>

              {/* Task Status */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Task Status*</Typography>
                <TextField
                  select
                  value={newTask.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="TO-DO">Todo</MenuItem>
                  <MenuItem value="IN-PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Attachment */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Attachment</Typography>
              <label htmlFor="file-upload">
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8f8f8",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <CloudUploadIcon sx={{ mr: 1, color: "#007BFF" }} />
                  <Typography variant="body2" color="textSecondary">
                    Drop your files here to{" "}
                    <span style={{ color: "#007BFF", cursor: "pointer" }}>Upload</span>
                  </Typography>
                </Box>
              </label>
              <input
                type="file"
                hidden
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*"
              />

              {/* Preview Section */}
              {/* File Preview Section */}
              {filePreview && (
                <Box sx={{ position: "relative", mt: 2 }}>
                  {typeof filePreview === "string" && (filePreview.startsWith("http") || filePreview.startsWith("blob")) ? (
                    filePreview.includes(".png") || filePreview.includes(".jpg") || filePreview.includes(".jpeg") || filePreview.includes(".gif") ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      />
                    )
                  ) : (
                    <Typography variant="body2">{(newTask.file as File)?.name || "Uploaded File"}</Typography>
                  )}

                  {/* Remove File Button */}
                  <IconButton
                    onClick={handleRemoveFile}
                    sx={{
                      position: "absolute",
                      top: "-10px",
                      left: "170px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}


            </Box>
          </Box>
          )}

          {isEditing && activeTab === 1 &&(

            <Box
            sx={{
              flex: 1,
              minWidth: "35%",
              borderLeft: "1px solid #E0E0E0",
              padding: 2,
              backgroundColor: "#F9FAFB",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Activity Log
            </Typography>

            {newTask.activity.length > 0 ? (
              newTask.activity.map((log, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${log.message}`}
                      secondary={dayjs(log.timestamp).format("MMM DD, YYYY - hh:mm A")} />
                  </ListItem>
                  {index < newTask.activity.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
                No activity recorded.
              </Typography>
            )}

          </Box>
        )}
        </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Left Section: Task Form */}
          <Box sx={{ flex: 2, minWidth: "60%" }}>
            <TextField
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                sx: { fontSize: "16px", padding: "10px", borderRadius: "8px" },
              }}
            />

            {/* Description */}
            <TextField
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              InputProps={{
                sx: { fontSize: "16px", padding: "10px", borderRadius: "8px" },
              }}
            />
            <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 1 }}>
              {newTask.description?.length}/300 characters
            </Typography>

            {/* Task Category, Due Date, and Status - in one row */}
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              {/* Task Category */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Task Category*</Typography>
                <ToggleButtonGroup
                  value={newTask.category}
                  exclusive
                  onChange={(e, value) => value && handleInputChange("category", value)}
                  sx={{ display: "flex", gap: 1 }}
                >
                  <ToggleButton value="Work" sx={{ textTransform: "none", borderRadius: "20px" }}>
                    Work
                  </ToggleButton>
                  <ToggleButton value="Personal" sx={{ textTransform: "none", borderRadius: "20px" }}>
                    Personal
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Due Date */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Due on*</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={newTask.dueDate ? dayjs(newTask.dueDate) : null}
                    onChange={(date) => handleInputChange("dueDate", date ? date.toISOString() : "")}
                    // renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Box>

              {/* Task Status */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">Task Status*</Typography>
                <TextField
                  select
                  value={newTask.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="TO-DO">Todo</MenuItem>
                  <MenuItem value="IN-PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Attachment */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Attachment</Typography>
              <label htmlFor="file-upload">
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8f8f8",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <CloudUploadIcon sx={{ mr: 1, color: "#007BFF" }} />
                  <Typography variant="body2" color="textSecondary">
                    Drop your files here to{" "}
                    <span style={{ color: "#007BFF", cursor: "pointer" }}>Upload</span>
                  </Typography>
                </Box>
              </label>
              <input
                type="file"
                hidden
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*"
              />

              {/* Preview Section */}
              {/* File Preview Section */}
              {filePreview && (
                <Box sx={{ position: "relative", mt: 2 }}>
                  {typeof filePreview === "string" && (filePreview.startsWith("http") || filePreview.startsWith("blob")) ? (
                    filePreview.includes(".png") || filePreview.includes(".jpg") || filePreview.includes(".jpeg") || filePreview.includes(".gif") ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <img
                        src={filePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                        }}
                      />
                    )
                  ) : (
                    <Typography variant="body2">{(newTask.file as File)?.name || "Uploaded File"}</Typography>
                  )}

                  {/* Remove File Button */}
                  <IconButton
                    onClick={handleRemoveFile}
                    sx={{
                      position: "absolute",
                      top: "-10px",
                      left: "170px",
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}


            </Box>
          </Box>

          {isEditing && (

            <Box
            sx={{
              flex: 1,
              minWidth: "35%",
              borderLeft: "1px solid #E0E0E0",
              padding: 2,
              backgroundColor: "#F9FAFB",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Activity Log
            </Typography>

            {newTask.activity.length > 0 ? (
              newTask.activity.map((log, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${log.message}`}
                      secondary={dayjs(log.timestamp).format("MMM DD, YYYY - hh:mm A")} />
                  </ListItem>
                  {index < newTask.activity.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
                No activity recorded.
              </Typography>
            )}

          </Box>
        )}
        </Box>
        )}
      </DialogContent>


      <DialogActions sx={{ justifyContent: "flex-end", p: 2, bgcolor: "#F5F5F5" }}>
        {/* Cancel Button */}
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            fontWeight: "bold",
            border: "1px solid #D3D3D3",
            color: "#000",
            px: 3, // Padding on X-axis
            py: 1, // Padding on Y-axis
            "&:hover": { backgroundColor: "#EDEDED" },
          }}
        >
          Cancel
        </Button>

        {/* Create Button */}
        <Button
          onClick={handleCreateOrUpdateTask}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#C084FC",
            color: "#fff",
            borderRadius: "20px",
            fontWeight: "bold",
            ml: 2, // Margin to separate from Cancel button
            px: 3, // Padding on X-axis
            py: 1, // Padding on Y-axis
            "&:hover": { backgroundColor: "#B075E6" },
          }}
        >
          {isEditing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
