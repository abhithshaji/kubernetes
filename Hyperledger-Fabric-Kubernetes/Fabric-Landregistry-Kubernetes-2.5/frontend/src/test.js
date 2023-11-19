import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "Test",
    headerName: "Land Mutated",
    width: 100,
    valueGetter: (params) => {
      console.log(params.row.test1);
      if (
        params.row.test1.Value.isLandMutated == true ||
        params.row.test1.Value.isLandMutated == "true"
      )
        return "Yes";
      else return "No";
    },
  },
];

const rows = [
  {
    id: 1,
    lastName: "Snow",
    firstName: "Jon",
    age: 35,
    test1: { Value: { isLandMutated: "false" } },
  },
];

function Test() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default Test;
