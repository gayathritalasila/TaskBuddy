import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
  Collapse,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTaskDialog from "./EditTaskDialog";
import { modifyTask } from "./task.slice";
import { useDispatch, useSelector } from "react-redux";

const TaskSection = ({
  title,
  tasks,
  onAddTask,
  handleRemoveTask,
  isOpen,
  toggleSection,
  loggedInUserId,
}) => {
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [dropdownAnchor, setDropdownAnchor] = useState({
    status: null,
    category: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    dueDate: "",
    status: "",
    category: "",
    assignedTo: loggedInUserId,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const users = useSelector((state) => state.login?.user);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleSaveEditedTask = () => {
    if (selectedTask) {
      const updatedActivityLog = [
        ...(selectedTask.activityLog || []),
        {
          action: "Task edited",
          timestamp: new Date().toISOString(),
        },
      ];
      const updatedTask = { ...selectedTask, activityLog: updatedActivityLog };
      dispatch(modifyTask({ id: selectedTask.id, updatedTask }));
      setEditDialogOpen(false);
    }
  };

  const handleTaskFieldChange = (field, value) => {
    setSelectedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const openDropdown = (field, event) => {
    setDropdownAnchor((prev) => ({
      ...prev,
      [field]: event.currentTarget,
    }));
  };

  const closeDropdown = (field) => {
    setDropdownAnchor((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleOptionSelect = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
    closeDropdown(field);
  };

  const handleSaveTask = () => {
    const newTaskToAdd = {
      ...newTask,
      assignedTo: loggedInUserId, // Assign task to the current user
    };
    onAddTask(newTaskToAdd, title);
    setShowAddForm(false);
    setNewTask({
      name: "",
      dueDate: "",
      status: "",
      category: "",
      assignedTo: loggedInUserId,
    });
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Filter tasks by logged-in user
  const filteredTasks = tasks.filter((task) => task.assignedTo === loggedInUserId);

  return (
    <Box className="task-section">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={`task-section-header ${title
          .toLowerCase()
          .replace(" ", "-")}`}
        sx={{ backgroundColor: "#f7cbfb", padding: "8px 16px", borderRadius: "8px" }}
      >
        <Typography variant="h5" sx={{ color: "#333" }}>{`${title} (${filteredTasks.length})`}</Typography>
        <IconButton onClick={toggleSection}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box sx={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
          {title === "Todo" && (
            <Box display="flex" justifyContent="flex-start" mb={2}>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  color: "#6200ea",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  padding: "8px 0",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={toggleAddForm}
              >
                <AddIcon
                  sx={{
                    fontSize: "1.2rem",
                    marginRight: "8px",
                  }}
                />
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Add Task
                </Typography>
              </Box>
            </Box>
          )}

          <Table
            className="table"
            sx={{
              borderCollapse: "collapse",
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <TableBody>
              {showAddForm && (
                <TableRow>
                  <TableCell>
                    <input
                      type="text"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="Task Title"
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "0.9rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "0.9rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {newTask.status?(<Typography variant="body2" sx={{ marginRight: 1 }}>
      {newTask.status}
    </Typography>):( <IconButton onClick={(e) => openDropdown("status", e)}>
                      <AddIcon />
                    </IconButton>)}
                  
                   
                    <Menu
                      anchorEl={dropdownAnchor.status}
                      open={Boolean(dropdownAnchor.status)}
                      onClose={() => closeDropdown("status")}
                    >
                      <MenuItem onClick={() => handleOptionSelect("status", "Todo")}>
                        Todo
                      </MenuItem>
                      <MenuItem onClick={() => handleOptionSelect("status", "In-Progress")}>
                        In-Progress
                      </MenuItem>
                      <MenuItem onClick={() => handleOptionSelect("status", "Completed")}>
                        Completed
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell>
                  {newTask.category ?(<Typography variant="body2" sx={{ marginRight: 1 }}>
      {newTask.category}
    </Typography>):( <IconButton onClick={(e) => openDropdown("category", e)}>
                      <AddIcon />
                    </IconButton>)}
                  
                   
                    <Menu
                      anchorEl={dropdownAnchor.category}
                      open={Boolean(dropdownAnchor.category)}
                      onClose={() => closeDropdown("category")}
                    >
                      <MenuItem onClick={() => handleOptionSelect("category", "Work")}>
                        Work
                      </MenuItem>
                      <MenuItem onClick={() => handleOptionSelect("category", "Personal")}>
                        Personal
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell align="center">
                    <Box className="action-buttons">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#6200ea",
                          color: "#fff",
                          borderRadius: "20px",
                          textTransform: "none",
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                        }}
                        onClick={handleSaveTask}
                      >
                        Add
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: "20px",
                          borderColor: "#6200ea",
                          color: "#6200ea",
                          textTransform: "none",
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                        }}
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="textSecondary" align="center">
                      No tasks available.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f3f3f3" } }}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          padding: "4px 8px",
                          borderRadius: "8px",
                          backgroundColor: "#e0e0e0",
                          display: "inline-block",
                        }}
                      >
                        {task.status}
                      </Typography>
                    </TableCell>
                    <TableCell>{task.category}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={openMenu}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                        <MenuItem
                          onClick={() => {
                            handleEditClick(task);
                            closeMenu();
                          }}
                        >
                          <EditIcon fontSize="small" sx={{ marginRight: 1 }} /> Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleRemoveTask(task.id, title);
                            closeMenu();
                          }}
                        >
                          <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} color="error" />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
      <EditTaskDialog
        open={editDialogOpen}
        task={selectedTask}
        onClose={handleEditDialogClose}
        onUpdate={handleSaveEditedTask}
        onFieldChange={handleTaskFieldChange}
      />
    </Box>
  );
};

export default TaskSection;
