import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import "./SroHome.css";
import { Button, Stack, Form } from "react-bootstrap";
import swal from "sweetalert";
import SroNavbar from "./SroNavbar";
import { landObject } from "../home/landObject";
import Loading from "../ui/Loading";

function SroSearchLand() {
  const [parameter, setparameter] = useState("");
  const [landReference, setlandReference] = useState("");
  const [searchedLandData, setsearchedLandData] = useState(landObject);
  const [showTable, setshowTable] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  //error
  const [showParameterError, setshowParameterError] = useState(false);
  const [showLandReferenceError, setshowLandReferenceError] = useState(false);

  const parameterChangeHandler = (e) => {
    setparameter(e.target.value);
  };

  const landReferenceChangeHandler = (e) => {
    setlandReference(e.target.value);
  };

  const resetButtonHandler = () => {
    setshowTable(false);
    setsearchedLandData("");
  };

  const searchButtonHandler = async () => {
    if (parameter.length === 0) {
      setshowParameterError(true);
      return;
    } else {
      setshowParameterError(false);
    }

    if (landReference.trim().length === 0) {
      setshowLandReferenceError(true);
      return;
    } else {
      setshowLandReferenceError(false);
    }

    setisLoading(true);
    let filter = {};
    filter[parameter] = landReference;
    try {
      const response = await fetch(
        `http://localhost:4000/api/historyfindLand`,
        {
          method: "post",
          body: JSON.stringify(filter),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(async function (response) {
        setisLoading(false);

        if (response.status === 200) {
          const body = await response.json();
          setsearchedLandData(body);
          setshowTable(true);
          // console.log(body);
        } else {
          const error = await response.json();
          swal(error.error, error.message, "error");
        }
      });
    } catch (error) {
      setisLoading(false);
      swal("Error", `${error.message}`, "error");
    }
  };

  console.log(searchedLandData);

  // searchedLandData[0].Timestamp.seconds && console.log(new Date(Number(searchedLandData[0].Timestamp.seconds) * 1000))

  const columns = [
    {
      field: "seconds",
      headerName: "Time Stamp",
      width: 180,
      valueGetter: (params) => {
        return moment(
          new Date(Number(params.row.Timestamp.seconds) * 1000)
        ).format("DD-MM-YYYY|h:mm:ss a");
      },
    },

    {
      field: "district",
      headerName: "District",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.district;
      },
    },

    {
      field: "subRegistrarOffice",
      headerName: "Sub-Registrar Office",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.subRegistrarOffice;
      },
    },

    {
      field: "taluk",
      headerName: "Taluk",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.taluk;
      },
    },

    {
      field: "village",
      headerName: "Village",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.village;
      },
    },

    {
      field: "blockNo",
      headerName: "Block No",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.blockNo;
      },
    },

    {
      field: "resurveyNo",
      headerName: "Re-survey No",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.resurveyNo;
      },
    },

    {
      field: "oldsurveyNo",
      headerName: "Old-survey No",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.oldsurveyNo;
      },
    },

    {
      field: "areaAcres",
      headerName: "Land Area (Acres)",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.areaAcres;
      },
    },

    {
      field: "areaCent",
      headerName: "Land Area (Cent)",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.areaCent;
      },
    },

    {
      field: "eastBoundary",
      headerName: "East Boundary",
      width: 150,
      valueGetter: (params) => {
        return params.row.Value.eastBoundary;
      },
    },

    {
      field: "northBoundary",
      headerName: "North Boundary",
      width: 150,
      valueGetter: (params) => {
        return params.row.Value.northBoundary;
      },
    },

    {
      field: "westBoundary",
      headerName: "West Boundary",
      width: 150,
      valueGetter: (params) => {
        return params.row.Value.westBoundary;
      },
    },

    {
      field: "southBoundary",
      headerName: "South Boundary",
      width: 150,
      valueGetter: (params) => {
        return params.row.Value.southBoundary;
      },
    },

    {
      field: "remarks",
      headerName: "Remarks",
      width: 100,
      valueGetter: (params) => {
        return params.row.Value.remarks;
      },
    },

    {
      field: "presentOwner",
      headerName: "Present Owner",
      width: 150,
      valueGetter: (params) => {
        return params.row.Value.presentOwner;
      },
    },

    {
      field: "isLandMutated",
      headerName: "Land Mutated",
      width: 100,
      valueGetter: (params) => {
        if (
          params.row.Value.isLandMutated == true ||
          params.row.Value.isLandMutated == "true"
        )
          return "Yes";
        else return "No";
      },
    },

    {
      field: "isLandMortgaged",
      headerName: "Land Mortgaged",
      width: 100,
      valueGetter: (params) => {
        if (
          params.row.Value.isLandMortgaged == true ||
          params.row.Value.isLandMortgaged == "true"
        )
          return "Yes";
        else return "No";
      },
    },

    {
      field: "mongoDBId",
      headerName: "Old Database ID",
      width: 210,
      valueGetter: (params) => {
        return params.row.Value.mongoDBId;
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 550,
      valueGetter: (params) => {
        return params.row.Value.status;
      },
    },
  ];

  return (
    <div className="sro-background">
      <SroNavbar page="Search Land Record" />
      <div className="sro-searchbox">
        <Stack gap={3} className="col-md-5 mx-auto">
          <h1>Searching a Land Record from Blockchain</h1>
          <Form.Label className="fw-bold">
            Choose the parameter & enter that reference no. to{" "}
            <u>search from blockchain</u>:{" "}
          </Form.Label>
          <Stack direction="horizontal" gap={3}>
            <Form.Label className="fw-bold parameter">Parameter</Form.Label>
            <Form.Check
              name="group1"
              type="radio"
              label="Land Id"
              value="landId"
              onClick={parameterChangeHandler}
            />
            {/* <Form.Check
              name="group1"
              type="radio"
              label="Re-Survey No"
              value="resurveyNo"
              disabled
              onClick={parameterChangeHandler}
            />
            <Form.Check
              name="group1"
              type="radio"
              label="Old Survey No"
              value="oldsurveyNo"
              disabled
              onClick={parameterChangeHandler}
            /> */}
          </Stack>
          {showParameterError && <p className="errorMessage">*Parameter</p>}

          <Form.Control
            type="userid"
            placeholder="Land reference no"
            onChange={landReferenceChangeHandler}
          />
          {showLandReferenceError && (
            <p className="errorMessage">*Land Reference Number</p>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={showTable}
            onClick={searchButtonHandler}
          >
            Search
          </Button>
        </Stack>
      </div>

      {showTable && (
        <Stack gap={3} className="col-md-11 mx-auto fetched-land-div">
          <DataGrid
            rows={searchedLandData}
            columns={columns}
            getRowId={(row) => row.Timestamp.seconds}
            sx={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: "bold",
              fontSize: 14,
              textAlign: "center",
            }}
            autoHeight
            hideFooterPagination
            hideFooter
          />

          <Stack
            direction="horizontal"
            gap={2}
            className="col-md-15 mx-auto buttons-stack"
          >
            <Button as="a" variant="danger" onClick={resetButtonHandler}>
              Reset
            </Button>
          </Stack>
        </Stack>
      )}

      {isLoading && <Loading />}
    </div>
  );
}

export default SroSearchLand;
