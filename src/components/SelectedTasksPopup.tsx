import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import SelectAllIcon from "../../icons/SelectAllIcon";
import "./taskgrid.css";
import { useDispatch } from "react-redux";
import { deleteTasks, fetchTasks, updateTask } from "./Task/task.actions";
import { AppDispatch } from "../../reduxStore";

const SelectedTasksPopup = ({ selectedTaskIds, setSelectedTaskIds, gridRef }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("STATUS");


  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status) => {
    if (selectedTaskIds.length > 0) {
      const updates = selectedTaskIds.map((taskId) => ({
        id: taskId,
        updates: { status, updatedAt: new Date().toISOString() },
      }));
  
      Promise.all(updates.map(update => dispatch(updateTask(update))))
        .then(() => {
          setSelectedTaskIds([]); // Clear selection
          dispatch(fetchTasks()); // Refetch updated tasks
          if (gridRef.current?.api) {
            gridRef.current.api.deselectAll(); // Uncheck all tasks in Ag-Grid
          }
          setSelectedStatus(status); // ✅ Update the button text
        })
        .catch((error) => console.error("Failed to update tasks:", error));
  
      handleCloseMenu();
    }
  };  
  
  
  const handleClose = () =>{
    setSelectedTaskIds([])
    if (gridRef.current?.api) {
      gridRef.current.api.deselectAll(); // Uncheck all tasks in Ag-Grid
    }
  }
  

  const handleDelete = () => {
    if (selectedTaskIds.length > 0) {
      dispatch(deleteTasks(selectedTaskIds))
        .then(() => {
          setSelectedTaskIds([]);
          dispatch(fetchTasks()); // Refetch updated task list
        })
        .catch((error) => console.error("Failed to delete tasks:", error));
    }
  };
  

  return (
    <div className="selected-tasks-popup">
      <div className="selected-task-info">
        <button className="task-count-btn">
          {selectedTaskIds.length} Tasks Selected
          <span className="close-btn" onClick={handleClose}>✖</span>
        </button>
        <div className="checkbox-icon">
          <SelectAllIcon />
        </div>
      </div>

      <div className="selected-tasks-actions">
        {/* Status Dropdown */}
        <Button className="status-btn" onClick={handleOpenMenu}>
        {selectedStatus}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={() => handleStatusChange("TO-DO")}>To-Do</MenuItem>
          <MenuItem onClick={() => handleStatusChange("IN-PROGRESS")}>In-Progress</MenuItem>
          <MenuItem onClick={() => handleStatusChange("COMPLETED")}>Completed</MenuItem>
        </Menu>

        {/* Delete Button */}
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default SelectedTasksPopup;
