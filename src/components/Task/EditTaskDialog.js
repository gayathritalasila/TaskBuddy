import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const EditTaskDialog = ({ open, task, onClose, onUpdate }) => {
  const [updatedTask, setUpdatedTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "IN-PROGRESS",
    category: "Personal",
    activityLog: [],
    attachments: [],
  });

  useEffect(() => {
    if (task) {
      setUpdatedTask({
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        category: task.category,
        activityLog: task.activityLog || [],
        attachments: task.attachments || [],
      });
    }
  }, [task]);

  const handleFieldChange = (field, value) => {
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUpdatedTask((prevTask) => ({
        ...prevTask,
        attachments: [...prevTask.attachments, { fileUrl, name: file.name }],
      }));
    }
  };

  const handleRemoveAttachment = (index) => {
    setUpdatedTask((prevTask) => {
      const updatedAttachments = [...prevTask.attachments];
      updatedAttachments.splice(index, 1);
      return { ...prevTask, attachments: updatedAttachments };
    });
  };

  const handleUpdate = () => {
    onUpdate(updatedTask);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ padding: "34px 24px", borderBottom: "1px solid #0000001A" }}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: "6.5%", right: "16px", transform: "translateY(-50%)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "19px" }}>
        <Box sx={{ display: "flex", gap: "20px" }}>
          {/* Left Section */}
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              placeholder="Task Name"
              value={updatedTask.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              margin="normal"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  "& input": {
                    padding: "10px",
                  },
                },
              }}
            />
            <Box sx={{ position: "relative", marginTop: "20px" }}>
              <TextField
                fullWidth
                placeholder="Task Description"
                value={updatedTask.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "14px",
                    "& textarea": {
                      padding: "10px",
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  position: "absolute",
                  bottom: "5px",
                  right: "10px",
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                {(updatedTask.description || "").length}/300 characters
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "20px", marginTop: "20px", alignItems: "center" }}>
              {/* Task Category */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Task Category*
                </Typography>
                <Box sx={{ display: "flex", gap: "10px", width: "100%" }}>
                  <Button
                    className={`category-button ${
                      updatedTask.category === "Work" ? "active" : "inactive"
                    }`}
                    onClick={() => handleFieldChange("category", "Work")}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      padding: "8px 12px",
                      border: "1px solid #7B1984", /* Add border for all buttons */
                      color: "#7B1984", /* Set default text color */
                      backgroundColor: updatedTask.category === "Work" ? "#7B1984" : "transparent", 
                      color: updatedTask.category === "Work" ? "#fff" : "#7B1984", 
                    }}
                  >
                    Work
                  </Button>
                  <Button
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      padding: "px 12px",
                      border: "1px solid #7B1984", /* Add border for all buttons */
                      color: "#7B1984", /* Set default text color */
                      backgroundColor: updatedTask.category === "Personal" ? "#7B1984" : "transparent", 
                      color: updatedTask.category === "Personal" ? "#fff" : "#7B1984", 
                    }}
                    onClick={() => handleFieldChange("category", "Personal")}
                  >
                    Personal
                  </Button>
                </Box>
              </Box>

              {/* Due Date */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Due on*
                </Typography>
                <TextField
                  type="date"
                  value={updatedTask.dueDate || ""}
                  onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                  InputProps={{
                    sx: { borderRadius: "8px", backgroundColor: "#f5f5f5" },
                  }}
                  fullWidth
                />
              </Box>

              {/* Task Status */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Task Status*
                </Typography>
                <TextField
                  select
                  value={updatedTask.status || ""}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                  SelectProps={{ native: true }}
                  InputProps={{
                    sx: { borderRadius: "8px", backgroundColor: "#f5f5f5" ,width:"100%"},
                  }}
                  fullWidth
                >
                  <option value="Todo">Todo</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </TextField>
              </Box>
            </Box>
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                Attachment
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  backgroundColor: "#f1f1f1",
                }}
              >
                <input type="file" onChange={handleFileUpload} />
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                {updatedTask.attachments.map((attachment, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      marginRight: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <img
                      src={attachment.fileUrl}
                      alt={attachment.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        backgroundColor: "#fff",
                      }}
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          {/* Right Section */}
          <Box
            sx={{
              flex: 1,
              borderLeft: "1px solid #e0e0e0",
              paddingLeft: "20px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: "bold" }}>
              Activity
            </Typography>
            {updatedTask.activityLog.map((log, index) => (
              <Box key={index} sx={{ marginBottom: "10px" }}>
                <Typography variant="body2" color="textSecondary">
                  {log.action}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(log.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{padding:"16px 24px", borderTop: "1px solid #00000021"}}>
        <Button
          onClick={onClose}
          sx={{
            fontWeight: "bold",
            color: "#666",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          sx={{
            backgroundColor: "#6a1b9a",
            color: "#fff",
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;