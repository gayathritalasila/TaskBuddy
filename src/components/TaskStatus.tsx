import React from "react";
import { IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const TaskStatus = ({ params, contentText, openDropdown, editingRowIndex, newTaskData }) => {
  if (!params || !params.data) return null; // Handle missing params

  const { id, category, status } = params.data;
  const isEditing = id === "NEW_TASK_FORM" || editingRowIndex === params.node.rowIndex;

  if (id.startsWith("PLACEHOLDER") || id === "ADD_TASK") {
    return null;
  }

  // Handle category dropdown if contentText is for category
  if (isEditing && contentText === category) {
    return (
      <IconButton onClick={(e) => openDropdown("category", e, id)}>
        {newTaskData?.category ? (
          <Typography variant="body2" sx={{ marginRight: 1 }}>
            {newTaskData.category}
          </Typography>
        ) : (
          <AddIcon />
        )}
      </IconButton>
    );
  } else if(contentText === category){
    return(
     <Typography variant="body2" sx={{ marginRight: 1 }}>
                {category}
              </Typography>
    )
  }

  // Handle status dropdown if contentText is for status
  return (
    <IconButton onClick={(e) => openDropdown("status", e, id)}>
      {contentText === status ? (
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          {status}
        </Typography>
      ) : (
        <AddIcon />
      )}
    </IconButton>
  );
};

export default TaskStatus;
