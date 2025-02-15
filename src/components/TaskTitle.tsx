import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import EnterIcon from "../../icons/EnterIcon";
import GreenMaskIcon from "../../icons/GreenMaskIcon";
import MaskIcon from "../../icons/MaskIcon";

const TaskTitle = ({
    params,
    editingRowIndex,
    setEditingRowIndex,
    handleUpdateTask,
    handleAddTask,
    setAddTaskRowExpanded,
    newTaskData,
    setNewTaskData,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [localTitle, setLocalTitle] = useState(newTaskData?.title || "");

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setEditingRowIndex(null);
                setAddTaskRowExpanded(false);
            }
        }

        if (editingRowIndex !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingRowIndex]);

    // Sync local state with global state when editing starts
    useEffect(() => {
        if (editingRowIndex !== null) {
            setLocalTitle(newTaskData?.title || "");
        }
    }, [editingRowIndex, newTaskData]);

    useEffect(() => {
        if (editingRowIndex !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingRowIndex]);

    if (!params?.data) {
        return (
            <span style={{ color: "gray", fontStyle: "italic" }}>No task data</span>
        );
    }

    if (params.data.id.startsWith("PLACEHOLDER")) {
        return (
            <span style={{ color: "gray", fontStyle: "italic", fontWeight: "bold" }}>
                {params.data.title}
            </span>
        );
    }

    if (params.data.id === "ADD_TASK") {
        return (
            <Button
                variant="text"
                style={{
                    color: "#a300b8",
                    fontWeight: "bold",
                    textTransform: "none",
                    marginLeft: "10px",
                }}
                onClick={() => {setAddTaskRowExpanded(true)}}
            >
                + ADD TASK
            </Button>
        );
    }

    const rowIndex = params.node.rowIndex;
    const taskId = params.data?.id;
    const isEditing = editingRowIndex === rowIndex;
    const isNewTask = taskId === "NEW_TASK_FORM";

    if (isNewTask || isEditing) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "8px",
                    width: "100%",
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    placeholder="Task Title"
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => {
                        setTimeout(() => {
                            const activeElement = document.activeElement;
                            
                            // Prevent blur if clicking on related elements
                            if (activeElement?.classList.contains("calendar-input") || 
                                activeElement?.tagName === "BUTTON") {
                                return; 
                            }
                    
                            if (isEditing) {
                                handleUpdateTask(taskId, localTitle);
                                setEditingRowIndex(null); // Exit edit mode if editing
                            } else {
                                // Prevent exiting if input has data
                                if (!localTitle.trim()) {
                                    setAddTaskRowExpanded(false); // Close form only if input is empty
                                } else {
                                    setNewTaskData((prev) => ({ ...prev, title: localTitle })); // Persist data before closing
                                }
                                
                            }
                        }, 0);
                    }}                    
                    
                    style={{
                        flex: "1",
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "0.9rem",
                    }}
                />

                <div style={{ display: "flex", width: "100%", gap: "10px" }}>
                    <Button
                        variant="contained"
                        onClick={() =>{
                            setNewTaskData((prev) => ({ ...prev, title: localTitle }));
                            isEditing ? handleUpdateTask(taskId, localTitle) : handleAddTask();
                        }
                        }
                        style={{
                            backgroundColor: "#6A1B9A", // Purple shade
                            color: "#fff",
                            textTransform: "none",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            minWidth: "80px",
                        }}
                    >
                        {isEditing ? "Update" : "Add"}
                        <EnterIcon
                            style={{
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        />
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() =>{
                            setLocalTitle(""); 
                            setNewTaskData({ title: "" });
                            isEditing ? setEditingRowIndex(null) : setAddTaskRowExpanded(false)
                        }}
                        style={{
                            borderColor: "#6A1B9A", // Same purple shade for border
                            color: "#000",
                            textTransform: "none",
                            borderRadius: "20px",
                            fontWeight: "bold",
                            padding: "8px 16px",
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <span style={{ 
            display: "flex", 
            alignItems: "center", 
            textDecoration: params.data?.status === "COMPLETED" ? "line-through" : "none",
            color: params.data?.status === "COMPLETED" ? "gray" : "inherit"
        }}>
            {params.data?.status === "COMPLETED" ? <GreenMaskIcon /> : <MaskIcon />}
            {params.data.title}
        </span>
    );
};

export default TaskTitle;
