import React, { useState, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams, ModuleRegistry, RowDragModule, RowSelectionModule } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import "./taskgrid.css"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { addTask, deleteTask, fetchTasks, updateTask, updateTaskField } from "./Task/task.actions";
import { AppDispatch } from "../../reduxStore";
import { Task } from "./Task/task.state";
import TaskTitle from "./TaskTitle";
import TaskDueDate from "./TaskDueDate";
import TaskStatus from "./TaskStatus";
import TaskActions from "./TaskActions";
import SelectedTasksPopup from "./SelectedTasksPopup";
import CreateTaskDialog from "./Task/CreateTaskDialog";
import SearchNotFoundIcon from "../../icons/SearchNotFoundIcon";

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule, RowDragModule, RowSelectionModule]);

const TaskGrid: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const gridRef = useRef<AgGridReact<Task>>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const users = useSelector((state: RootState) => state.login.user);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const [addTaskRowExpanded, setAddTaskRowExpanded] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [dropdownAnchor, setDropdownAnchor] = useState({
    status: null,
    category: null,
  });
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [newTaskData, setNewTaskData] = useState<Task>({
    id: "",
    userId: users?.uid || "",
    title: "",
    description: "",
    category: "",
    status: "TO-DO",
    tags: [],
    dueDate: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    position: 0,
    activity: [],
  });
  const [editTaskData, setEditTaskData] = useState<Task>({
    id: "",
    userId: users?.uid || "",
    title: "",
    description: "",
    category: "",
    status: "",
    tags: [],
    dueDate: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    position: 0,
    activity: [],
  });
  const [editingTaskId, setEditingTaskId] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (editingRowIndex !== null) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [editingRowIndex]);

  const onSelectionChanged = () => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    const selectedData: Task[] = selectedNodes?.map(node => node.data).filter((task): task is Task => !!task) || [];
    const selectedIds = selectedData.map(task => task.id);

    setSelectedTasks(selectedData);
    setSelectedTaskIds(selectedIds);
  };

  const onRowDragEnd = (event) => {
    const draggedTask = event.node.data;
    const targetRow = event.overNode ? event.overNode.data : null;

    if (targetRow && draggedTask.status !== targetRow.status) {
      const updatedTask = { ...draggedTask, status: targetRow.status };
      dispatch(updateTask({ id: draggedTask.id, updates: updatedTask }));
    }
  };

  const handleOptionSelect = (field, value, taskId) => {
    setNewTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
    closeDropdown(field);

    dispatch(updateTaskField({ id: taskId, field, value }));
  };

  const openDropdown = (field, event, taskId) => {
    setDropdownAnchor((prev) => ({
      ...prev,
      [field]: event.currentTarget,
    }));
    setEditingTaskId(taskId); // Store the task ID being edited
  };


  const closeDropdown = (field) => {
    setDropdownAnchor((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number, rowData: any) => {
    setMenuRowIndex(rowIndex);
    setEditTaskData({
      id: rowData.id, // Ensure all required properties are included
      userId: rowData.userId,
      title: rowData.title || "",
      dueDate: rowData.dueDate || "",
      status: rowData.status || "",
      category: rowData.category || "",
      createdAt: rowData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: rowData.position,
      completed: rowData.completed,
      activity: rowData.activity
    });
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRowIndex(null);
  };

  const handleAddTask = () => {
    if (!newTaskData.title.trim()) return;

    const taskToAdd: Task = {
      ...newTaskData,
      userId: users?.uid || "",
      dueDate: new Date(newTaskData.dueDate).toISOString(), // Convert to string
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addTask(taskToAdd));
    setNewTaskData({ ...newTaskData, title: "", dueDate: "" });
    setAddTaskRowExpanded(false);
  };

  const handleUpdateTask = (taskId: string, localTitle: string) => {
    const taskToUpdate = tasks && Object.values(tasks).find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      title: localTitle, // Use localTitle directly
      dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate).toISOString() : taskToUpdate.dueDate,
      status: newTaskData.status,
      category: newTaskData.category,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateTask({ id: taskId, updates: updatedTask }));
    setEditingRowIndex(null);
  };


  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const rowData = useMemo(() => {
    if (!tasks) return [];

    const tasksArray = Object.values(tasks);
    const todoTasks = tasksArray.filter((task) => task.status === "TO-DO");
    const inProgressTasks = tasksArray.filter((task) => task.status === "IN-PROGRESS");
    const completedTasks = tasksArray.filter((task) => task.status === "COMPLETED");

    // Placeholder message row for empty sections
    const placeholderRow = (status: string) => ({
      id: `PLACEHOLDER_${status}`,
      userId: "",
      title: `No tasks present in ${status} section`,
      category: "",
      status,
      description: "",
      dueDate: "",
      createdAt: "",
      updatedAt: "",
      completed: status === "COMPLETED",
      position: -1,
    });

    return [
      {
        id: "ADD_TASK",
        userId: "",
        title: "",
        category: "ADD_TASK",
        status: "TO-DO",
        description: "",
        dueDate: "",
        createdAt: "",
        updatedAt: "",
        completed: false,
        position: -1,
      },
      ...(addTaskRowExpanded
        ? [
          {
            id: "NEW_TASK_FORM",
            userId: "",
            title: newTaskData.title,
            category: "",
            status: "TO-DO",
            description: "",
            dueDate: newTaskData.dueDate,
            createdAt: "",
            updatedAt: "",
            completed: false,
            position: -1,
          },
        ]
        : []),
      ...(todoTasks.length > 0 ? todoTasks : [placeholderRow("TO-DO")]),
      ...(inProgressTasks.length > 0 ? inProgressTasks : [placeholderRow("IN-PROGRESS")]),
      ...(completedTasks.length > 0 ? completedTasks : [placeholderRow("COMPLETED")]),
    ];
  }, [tasks, addTaskRowExpanded]);

  const handleEditClick = (rowIndex: number, taskData: Task) => {
    if (!taskData || taskData.id.startsWith("PLACEHOLDER") || taskData.id === "ADD_TASK") return;
    setEditingRowIndex(rowIndex);
    setNewTaskData({
      id: taskData.id,
      userId: taskData.userId,
      title: taskData.title || "",
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split("T")[0] : "",
      status: taskData.status || "",
      category: taskData.category || "",
      createdAt: taskData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: taskData.position,
      completed: taskData.completed,
      activity: taskData.activity,
    });
    closeMenu();
  };

  const columnDefs = useMemo<ColDef[]>(() => {
    return isMobile ? [
      {
        field: "task",
        headerName: "Task Name",
        headerCheckboxSelection: true,
        checkboxSelection: (params) => {
          const rowId = params.data?.id;
          return !(rowId === "NEW_TASK_FORM" || rowId === "ADD_TASK" || rowId.startsWith("PLACEHOLDER"));
        },
        rowDrag: (params) => {
          const rowId = params.data?.id;
          return !(rowId === "NEW_TASK" || rowId === "ADD_TASK" || rowId.startsWith("PLACEHOLDER"));
        },
        width: 350,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <TaskTitle
              params={params}
              editingRowIndex={editingRowIndex}
              setEditingRowIndex={setEditingRowIndex}
              handleUpdateTask={handleUpdateTask}
              handleAddTask={handleAddTask}
              setAddTaskRowExpanded={setAddTaskRowExpanded}
              newTaskData={newTaskData}
              setNewTaskData={setNewTaskData}
            />
          );
        },
      },
      {
        field: "status",
        headerName: "Task Status",
        width: 150,
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        // showRowGroup: "status",
      },
    ] : [
      {
        field: "task",
        headerName: "Task Name",
        headerCheckboxSelection: true,
        checkboxSelection: (params) => {
          const rowId = params.data?.id;
          return !(rowId === "NEW_TASK_FORM" || rowId === "ADD_TASK" || rowId.startsWith("PLACEHOLDER"));
        },
        rowDrag: (params) => {
          const rowId = params.data?.id;
          return !(rowId === "NEW_TASK" || rowId === "ADD_TASK" || rowId === "PLACEHOLDER");
        },
        width: 350,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <TaskTitle
              params={params}
              editingRowIndex={editingRowIndex}
              setEditingRowIndex={setEditingRowIndex}
              handleUpdateTask={handleUpdateTask}
              handleAddTask={handleAddTask}
              setAddTaskRowExpanded={setAddTaskRowExpanded}
              newTaskData={newTaskData}
              setNewTaskData={setNewTaskData}
            />
          );
        },
      },
      {
        field: "dueDate",
        headerName: "Due On",
        width: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <TaskDueDate params={params} editingRowIndex={editingRowIndex} newTaskData={newTaskData} setNewTaskData={setNewTaskData} />
          )
        },
      },
      {
        field: "status",
        headerName: "Task Status",
        width: 150,
        enableRowGroup: true,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <TaskStatus params={params} openDropdown={openDropdown} contentText={params.data.status} editingRowIndex={editingRowIndex} newTaskData={newTaskData} />
          );
        },
        rowGroup: true,
      },
      {
        field: "category",
        headerName: "Task Category",
        width: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return (
            <TaskStatus params={params} openDropdown={openDropdown} contentText={params.data.category} editingRowIndex={editingRowIndex} newTaskData={newTaskData} />
          );
        },
      },
      {
        cellRenderer: (params: ICellRendererParams) => {
          return (<TaskActions params={params} openMenu={openMenu} />)
        },
      },
    ]
  }, [newTaskData, addTaskRowExpanded, selectedTaskIds, editingRowIndex]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.redrawRows();
    }
  }, [rowData, addTaskRowExpanded]);
  const [headerHeight, setHeaderHeight] = useState(window.innerWidth <= 768 ? 0 : 50);

  useEffect(() => {
    const handleResize = () => {
      setHeaderHeight(window.innerWidth <= 768 ? 0 : 50);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredRowData = useMemo(() => {
    if (!tasks) return [];
  
    const tasksArray = Object.values(tasks);
    const realTasks = tasksArray.filter(
      (task) =>
        task.id !== "ADD_TASK" &&
        task.id !== "NEW_TASK_FORM" &&
        !task.id.startsWith("PLACEHOLDER_") // Ignore placeholders
    );
  
    if (realTasks.length === 0) return []; // Hide grid if no real tasks
  
    return isMobile
      ? rowData.filter((task) => task.id !== "ADD_TASK") // Hide ADD_TASK row on mobile
      : rowData;
  }, [tasks, rowData, isMobile]);
  
  const handleRowClick = (event) => {
    if (isMobile && event.data) {
      setSelectedTask(event.data);
      setEditDialogOpen(true);
    }
  };


  return (
    <div style={{ margin: "20px" }}>
        {filteredRowData.length > 0 ?(
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          key="taskGrid"
          ref={gridRef}
          rowData={filteredRowData}
          headerHeight={headerHeight}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            sortable: false,
            filter: false,
            resizable: true,
          }}
          groupDisplayType="groupRows"
          groupRowRenderer="agGroupCellRenderer"
          rowDragMultiRow={true}
          onRowClicked={handleRowClick}
          rowSelection="multiple"
          onSelectionChanged={onSelectionChanged}
          getRowId={(params) => params.data.id}
          onRowDragEnd={onRowDragEnd}
          animateRows={true}
          suppressRowClickSelection={true}
          rowModelType="clientSide"
          modules={[ClientSideRowModelModule, RowGroupingModule]}
          rowHeight={90}
        />
      </div>
        ):(
          <div className="no-tasks-container">
          <SearchNotFoundIcon />
          <p className="no-tasks-text">It looks like we can't find any result that match.</p>
        </div>
        )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#ffe6eb",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            minWidth: "120px",
            padding: "4px 0",
          },
        }}
      >
        <MenuItem onClick={() => {
          if (menuRowIndex !== null) {
            handleEditClick(menuRowIndex, editTaskData);
          }
        }} sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          padding: "6px 12px",
        }}>
          <EditIcon /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteTask(editTaskData.id);
          closeMenu();
        }} sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          padding: "6px 12px",
          color: "red",
          fontWeight: "bold",
        }}>
          <DeleteIcon /> Delete
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={dropdownAnchor.status}
        open={Boolean(dropdownAnchor.status)}
        onClose={() => closeDropdown("status")}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#ffe6eb",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            minWidth: "120px",
            padding: "4px 0",
          },
        }}
      >
        <MenuItem onClick={() => handleOptionSelect("status", "TO-DO", editingTaskId)}>
          Todo
        </MenuItem>
        <MenuItem onClick={() => handleOptionSelect("status", "IN-PROGRESS", editingTaskId)}>
          In-Progress
        </MenuItem>
        <MenuItem onClick={() => handleOptionSelect("status", "COMPLETED", editingTaskId)}>
          Completed
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={dropdownAnchor.category}
        open={Boolean(dropdownAnchor.category)}
        onClose={() => closeDropdown("category")}
      >
        <MenuItem onClick={() => handleOptionSelect("category", "Work", editingTaskId)}>
          Work
        </MenuItem>
        <MenuItem onClick={() => handleOptionSelect("category", "Personal", editingTaskId)}>
          Personal
        </MenuItem>
      </Menu>

      {selectedTaskIds.length > 0 && (
        <SelectedTasksPopup selectedTaskIds={selectedTaskIds} setSelectedTaskIds={setSelectedTaskIds} gridRef={gridRef} />

      )}

      {editDialogOpen && (
        <CreateTaskDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          taskData={selectedTask}
        />
      )}

    </div>
  );
};

export default TaskGrid;