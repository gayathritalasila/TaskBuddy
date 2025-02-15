import React from "react";
import { IconButton } from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";

const TaskActions = ({ params, openMenu }) => {
  if (!params || !params.data) return null; // Handle missing params

  const { id } = params.data;
  const rowIndex = params.node?.rowIndex;

  if (id === "NEW_TASK_FORM") {
    return null;
  }

  if (id !== "ADD_TASK" && !id.startsWith("PLACEHOLDER") && rowIndex !== null) {
    return (
      <div>
        <IconButton onClick={(event) => openMenu(event, rowIndex, params.data)}>
          <MoreIcon />
        </IconButton>
      </div>
    );
  }

  return null; // Ensure the function always returns something
};

export default TaskActions;
