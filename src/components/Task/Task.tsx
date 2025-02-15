import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { TextField, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TaskIcon from "../../../icons/TaskIcon";
import ListIcon from "../../../icons/ListIcon";
import BoardIcon from "../../../icons/BoardIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import SearchIcon from "../../../icons/SearchIcon";
import BoardView from "../BoardView/BoardView";
import CreateTaskDialog from "./CreateTaskDialog";
import { fetchTasks } from "./task.actions";
import { logout } from "../Login/login.slice";
import { DatePicker } from "@mui/x-date-pickers";
import "./task.css";
import TaskGrid from "../TaskGrid";
import { RootState } from "../../../rootReducer";
import { AppDispatch } from "../../../reduxStore";
import { Task } from "./task.state";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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

const Task: React.FC = () => {
    const user = useSelector((state: RootState) => state.login.user);
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const dispatch = useDispatch<AppDispatch>();
    const [activeView, setActiveView] = useState<"List" |"Board">("List");
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    // Fetch user-specific tasks on component mount
    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => dispatch(logout());

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const tasksArray: Task[] = tasks ? Object.values(tasks) : [];
    const userTasks = tasksArray.filter((task) => task.userId === user?.uid);

    const filteredTasks = userTasks.filter((task) => {
        const isCategoryMatch = categoryFilter === "All" || task.category === categoryFilter;

        const taskDueDate = dayjs(task.dueDate); // Convert task due date to a dayjs object
        const isDateMatch =
            (!dateRange[0] || dateRange[0] === null || taskDueDate.isSameOrAfter(dateRange[0], "day")) &&
            (!dateRange[1] || dateRange[1] === null || taskDueDate.isSameOrBefore(dateRange[1], "day"));

        const isSearchMatch =
            searchQuery === "" ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return isCategoryMatch && isDateMatch && isSearchMatch;
    });

    if (!user) {
        return <Navigate to="/" />;
    }

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
                            <ListIcon style={styles.listIcon} />
                            List
                        </button>
                        <button
                            className={`view-option ${activeView === "Board" ? "active" : ""}`}
                            onClick={() => setActiveView("Board")}
                        >
                            <BoardIcon style={styles.listIcon} />
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

            {isMobile ? (
                <div className="filters">
                    <button className="add-task-button" onClick={handleOpenDialog}>
                        ADD TASK
                    </button>
                    <div className="filter-section">
                        <TextField
                            select
                            label="Category"
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                            variant="outlined"
                            size="small"
                            className="filter-item"
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Work">Work</MenuItem>
                            <MenuItem value="Personal">Personal</MenuItem>
                        </TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Due Date"
                                value={selectedDate}
                                onChange={(newDate) => {
                                    if (newDate) {
                                        setSelectedDate(dayjs(newDate));
                                        setDateRange([dayjs(newDate), dayjs(newDate)]);
                                    } else {
                                        setSelectedDate(null);
                                        setDateRange([null, null]); 
                                    }
                                }}
                            />

                        </LocalizationProvider>
                    </div>

                    <div className="search-create-group">
                        <div className="search-bar">
                            <SearchIcon style={{ opacity: 0.6 }} />
                            <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                        </div>
                    </div>
                </div>

            ) : (
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Due Date"
                                value={selectedDate}
                                onChange={(newDate) => {
                                    if (newDate) {
                                        setSelectedDate(dayjs(newDate));
                                        setDateRange([dayjs(newDate), dayjs(newDate)]);
                                    } else {
                                        setSelectedDate(null);
                                        setDateRange([null, null]);
                                    }
                                }}
                            />

                        </LocalizationProvider>

                    </div>
                    <div className="search-create-group">
                        <div className="search-bar">
                            <SearchIcon style={{ opacity: 0.6 }} />
                            <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchChange} />
                        </div>
                        <button className="add-task-button" onClick={handleOpenDialog}>
                            ADD TASK
                        </button>
                    </div>
                </div>
            )}

            <CreateTaskDialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
            />

            <div className="main-content">
                {activeView === "List" ? (
                    <TaskGrid tasks={filteredTasks} />
                ) : activeView === "Board" ? (
                    <BoardView tasks={filteredTasks} />
                ) : null}
            </div>
        </div>
    );
};

export default Task;
