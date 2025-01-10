import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Box, TextField, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TaskIcon from "../../../icons/TaskIcon";
import ListIcon from "../../../icons/ListIcon";
import BoardIcon from "../../../icons/Boardicon";
import LogoutIcon from "../../../icons/LogoutIcon";
import SearchIcon from "../../../icons/SearchIcon";
import TaskHeader from "./TaskHeader";
import TaskSection from "./TaskSection";
import BoardView from "../BoardView/BoardView";
import CreateTaskDialog from "./CreateTaskDialog";
import {
    addTaskToFirebase,
    fetchTasksFromFirebase,
    editTaskInFirebase,
    removeTaskFromFirebase,
} from "./task.actions";
import { logout } from "../Login/login.slice";
import "./task.css";

const styles = {
    taskIcon: {
        width: "32px",
        height: "32px",
        marginRight: "8px",
    },
    listIcon: {
        marginRight: "8px",
    },
};

const Task = () => {
    const user = useSelector((state) => state.login?.user); // Current logged-in user
    console.log(user);
    const tasks = useSelector((state) => state.task?.tasks);
    const dispatch = useDispatch();

    const [activeView, setActiveView] = useState("List");
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [sectionsOpen, setSectionsOpen] = useState({
        Todo: true,
        "In-Progress": true,
        Completed: true,
    });
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    // Fetch user-specific tasks on component mount
    useEffect(() => {
        if (user) {
            dispatch(fetchTasksFromFirebase(user.uid));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (tasks && Object.keys(tasks).length > 0) {
            filterTasks();
        }
    }, [tasks, categoryFilter, dateRange]);

    const handleCreateTask = (task) => {
        if (user) {
            dispatch(addTaskToFirebase({ ...task, userId: user.uid }, "Todo"));
        }
    };

    const filterTasks = () => {
        if (!tasks || Object.keys(tasks).length === 0) {
            console.log("Tasks are not available for filtering.");
            setFilteredTasks(tasks);
            return;
        }

        let updatedTasks = { ...tasks };

        // Filter by category
        if (categoryFilter !== "All") {
            Object.keys(updatedTasks).forEach((section) => {
                updatedTasks[section] = updatedTasks[section].filter((task) => {
                    const taskCategory = task.category || "Uncategorized";
                    return taskCategory.toLowerCase() === categoryFilter.toLowerCase();
                });
            });
        }

        // Filter by date range
        if (dateRange[0] && dateRange[1]) {
            const fromDate = dateRange[0].startOf("day").toDate();
            const toDate = dateRange[1].endOf("day").toDate();

            Object.keys(updatedTasks).forEach((section) => {
                updatedTasks[section] = updatedTasks[section].filter((task) => {
                    const taskDueDate = new Date(task.dueDate);
                    return taskDueDate >= fromDate && taskDueDate <= toDate;
                });
            });
        }

        setFilteredTasks(updatedTasks);
    };

    const onAddTask = (task, section) => {
        if (user) {
            dispatch(addTaskToFirebase({ ...task, userId: user.uid }, section));
        }
    };

    const handleModifyTask = (taskId, updatedTask, currentSection) => {
        if (user) {
            dispatch(editTaskInFirebase(taskId, updatedTask, currentSection, user.uid));
        }
    };

    const handleRemoveTask = (id, section) => {
        if (user) {
            dispatch(removeTaskFromFirebase(id, section, user.uid));
        }
    };

    const handleLogout = () => dispatch(logout());

    if (!user) {
        return <Navigate to="/" />;
    }

    const toggleSection = (section) => {
        setSectionsOpen((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const toggleDatePicker = () => {
        setIsDatePickerOpen((prev) => !prev);
    };

    return (
        <div className="taskbuddy-container">
            <div className="navbar">
                <div className="navbar-left">
                    <div className="logo-container">
                        <TaskIcon className="task-icon" style={styles.taskIcon} color="#2F2F2F" />
                        <h1 className="logo-text">TaskBuddy</h1>
                    </div>
                    <div className="navbar-middle">
                        <button
                            className={`view-option ${activeView === "List" ? "active" : ""}`}
                            onClick={() => setActiveView("List")}
                        >
                            <ListIcon className="icon" style={styles.listIcon} />
                            List
                        </button>
                        <button
                            className={`view-option ${activeView === "Board" ? "active" : ""}`}
                            onClick={() => setActiveView("Board")}
                        >
                            <BoardIcon className="icon" style={styles.listIcon} />
                            Board
                        </button>
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="user-info">
                        <img src={user?.photoURL} alt="Profile" className="profile-image" />
                        <span className="user-name">{user?.displayName}</span>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        <LogoutIcon className="icon" /> Logout
                    </button>
                </div>
            </div>

            <div className="filters">
                <div className="filter-section">
                    <span className="filter-label">Filter by:</span>
                    <TextField
                        select
                        label="Category"
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                        variant="outlined"
                        size="small"
                        style={{ width: 150, marginRight: 16 }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                    </TextField>
                    <TextField
                        label="Due Date"
                        variant="outlined"
                        size="small"
                        onClick={toggleDatePicker}
                        style={{ width: 150 }}
                        InputProps={{ readOnly: true }}
                    />
                    {isDatePickerOpen && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateRangePicker
                                value={dateRange}
                                onChange={(newRange) => setDateRange(newRange)}
                                onClose={() => setIsDatePickerOpen(false)}
                                renderInput={(startProps, endProps) => (
                                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                        <TextField {...startProps} size="small" />
                                        <TextField {...endProps} size="small" />
                                    </div>
                                )}
                            />
                        </LocalizationProvider>
                    )}
                </div>
                <div className="search-create-group">
                    <div className="search-bar">
                        <SearchIcon style={{ opacity: 0.6 }} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <button className="add-task-button" onClick={handleOpenDialog}>
                        ADD TASK
                    </button>
                </div>
            </div>

            <CreateTaskDialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onCreateTask={handleCreateTask}
            />

            <div className="main-content">
                {activeView === "List" ? (
                    <Box sx={{ padding: 2 }}>
                        <TaskHeader />
                        {Object.keys(filteredTasks).map((section) => (
                            <TaskSection
                                key={section}
                                title={section}
                                tasks={filteredTasks[section]}
                                onAddTask={(task) => onAddTask(task, section)}
                                handleRemoveTask={handleRemoveTask}
                                isOpen={sectionsOpen[section]}
                                toggleSection={() => toggleSection(section)}
                                loggedInUserId={user.uid}
                            />
                        ))}
                    </Box>
                ) : activeView === "Board" ? (
                    <BoardView tasks={filteredTasks} />
                ) : null}
            </div>
        </div>
    );
};

export default Task;
