import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "react-beautiful-dnd";
import { fetchTasksFromFirebase, updateTaskStatus } from "../Task/task.actions";
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const BoardView = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    dispatch(fetchTasksFromFirebase());
  }, [dispatch]);

  const handleMenuOpen = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setCurrentTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentTaskId(null);
  };

  const handleMenuAction = (action) => {
    console.log(`Action '${action}' selected for task ID: ${currentTaskId}`);
    handleMenuClose();
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a valid destination or no movement occurred
    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    // Update task status based on the new section
    const updatedStatus = destination.droppableId;

    // Dispatch action to update the task's status in the store and database
    dispatch(updateTaskStatus(draggableId, updatedStatus));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box display="flex" gap={3}>
        {["Todo", "In-Progress", "Completed"].map((section) => (
          <Droppable droppableId={section} key={section}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  minWidth: "300px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    backgroundColor:
                      section === "Todo"
                        ? "#E1BEE7"
                        : section === "In-Progress"
                        ? "#B3E5FC"
                        : "#C8E6C9",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: "#000",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  {section.replace("-", " ")}
                </Typography>

                {tasks[section]?.map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          margin: "16px 0",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "16px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" style={{ fontWeight: "bold" }}>
                            {task.name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(event) => handleMenuOpen(event, task.id)}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" style={{ color: "#555" }}>
                            {task.category || "Personal"}
                          </Typography>
                          <Typography variant="body2" style={{ color: "#555" }}>
                            {task.dueDate || "Today"}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}

        {/* Task Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleMenuAction("Edit")}>Edit</MenuItem>
          <MenuItem onClick={() => handleMenuAction("Delete")}>Delete</MenuItem>
        </Menu>
      </Box>
    </DragDropContext>
  );
};

export default BoardView;
