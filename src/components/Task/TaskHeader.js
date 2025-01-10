import React from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
} from "@mui/material";

const TaskHeader = () => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{
                        fontWeight: "bold",
                        width: "40%",
                        textAlign: "left",
                        padding: "8px",
                    }}>
                        Task Name
                    </TableCell>
                    <TableCell sx={{
                        fontWeight: "bold",
                        width: "15%",
                        textAlign: "left",
                        padding: "8px",
                    }}>
                        Due On
                    </TableCell>
                    <TableCell sx={{
                        fontWeight: "bold",
                        width: "15%",
                        textAlign: "left",
                        padding: "8px",
                    }}>
                        Status
                    </TableCell>
                    <TableCell sx={{
                        fontWeight: "bold",
                        width: "15%",
                        textAlign: "left",
                        padding: "8px",
                    }}>
                        Category
                    </TableCell>
                </TableRow>
            </TableHead>
        </Table>
    );
};

export default TaskHeader;