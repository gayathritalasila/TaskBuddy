import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import {
  fetchTasks,
  updateTask,
  deleteTask,
} from "../Task/task.actions";
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "../../../icons/EditIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import CreateTaskDialog from "../Task/CreateTaskDialog";
import { Task } from "../Task/task.state";
import { AppDispatch } from "../../../reduxStore";
import SearchNotFoundIcon from "../../../icons/SearchNotFoundIcon";

interface BoardViewProps {
  tasks: Task[];
}

const BoardView: React.FC<BoardViewProps> = ({ tasks }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    userId: "",
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const categorizedTasks = {
    "TO-DO": [],
    "IN-PROGRESS": [],
    COMPLETED: [],
  };

  Object.values(tasks || {}).forEach((task) => {
    if (categorizedTasks[task.status]) {
      categorizedTasks[task.status].push(task);
    }
  });

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setCurrentTaskId(task.id);
    setCurrentTask({
      id: task.id,
      userId: task.userId,
      title: task.title,
      description: task.description,
      category: task.category,
      status: task.status,
      tags: task.tags || [],
      file: task.file,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completed: task.completed || false,
      position: task.position || 0,
      activity: task.activity || [],
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentTaskId(null);
  };

  const handleEditClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteTask = () => {
    if (currentTaskId) {
      dispatch(deleteTask(currentTaskId));
    }
    handleMenuClose();
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    dispatch(updateTask({ id: draggableId, updates: { status: destination.droppableId } }));
  };

  const allTasksEmpty = Object.values(categorizedTasks).every((tasks) => tasks.length === 0);

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        {allTasksEmpty ? (
          <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "50px", color: "#888", textAlign: "center" }}
        >
          <SearchNotFoundIcon style={{ fontSize: 80 }} />
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            No tasks found
          </Typography>
        </Box>
        ): (
        <Box display="flex" gap={3}>
          {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((section) => (
            <Droppable droppableId={section} key={section}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    minWidth: "300px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    padding: "16px",
                    minHeight: "250px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      backgroundColor:
                        section === "TO-DO"
                          ? "#FAC3FF"
                          : section === "IN-PROGRESS"
                            ? "#85D9F1"
                            : "#CEFFCC",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      color: "#000",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {section.replace("-", " ")}
                  </Typography>

                  {categorizedTasks[section]?.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#888",
                        marginTop: "20px",
                        // fontStyle: "italic",
                      }}
                    >
                      {categorizedTasks[section] === "COMPLETED" ? `No ${section} Tasks` : `No Tasks in ${section.replace("-", " ")}`}
                    </Typography>
                  ) : (
                    categorizedTasks[section].map((task, index) => (
                      <Draggable draggableId={task.id} index={index} key={task.id}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              margin: "16px 0",
                              backgroundColor: "#fff",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              padding: "16px",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              minHeight: "100px",
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="h6" sx={{ fontWeight: "bold", textDecoration: task.status === "COMPLETED" ? "line-through" : "none", }}>
                                {task.title}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={(event) => handleMenuOpen(event, task)}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginTop: "8px" }}>
                              <Typography variant="body2" sx={{ color: "#555" }}>
                                {task.category}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#555" }}>
                                {new Date(task.dueDate).toDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
          <Menu anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#ffe6eb",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                minWidth: "120px",
                padding: "4px 0",
              },
            }}>
            <MenuItem onClick={handleEditClick} sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              padding: "6px 12px",
            }}>
              <EditIcon /> Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteTask} sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              padding: "6px 12px",
              color: "red",
              fontWeight: "bold",
            }}> <DeleteIcon style={{ fontSize: "18px", color: "red" }} /> Delete</MenuItem>
          </Menu>
        </Box>
        )}
      </DragDropContext>
      {openDialog && (
        <CreateTaskDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          taskData={currentTask}
        />
      )}
    </Box>
  );
};

export default BoardView;
