import React from "react";

const TaskDueDate = ({ params, editingRowIndex, newTaskData, setNewTaskData }) => {
  if (!params || !params.data) return null; // Handle missing params gracefully

  if (params.data.id === "NEW_TASK_FORM" || editingRowIndex === params.node.rowIndex) {
    return (
      <input
        type="date"
        value={newTaskData?.dueDate || ""}
        onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "0.9rem",
        }}
      />
    );
  }

  if (params.data.id !== "ADD_TASK" && !params.data.id.startsWith("PLACEHOLDER")) {
    const dateStr = typeof params.value === "string" ? params.value : new Date(params.value).toISOString();
    return <span>{new Date(dateStr).toLocaleDateString()}</span>;
  }

  return null;
};

export default TaskDueDate;
