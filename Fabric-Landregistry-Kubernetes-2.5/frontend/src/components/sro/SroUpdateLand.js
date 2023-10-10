import React, { useState } from "react";
import "./SroHome.css";
import { Button, Stack, Badge, Alert, Form, Spinner } from "react-bootstrap";
import swal from "sweetalert";
import SroNavbar from "./SroNavbar";
import { landObject } from "../home/landObject";
import { sampleLandData } from "../home/sampleLandObjectData";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import Loading from "../ui/Loading";

function SroUpdateLand() {
  const [parameter, setparameter] = useState("");
  const [landReference, setlandReference] = useState("");
  const [searchedLandData, setsearchedLandData] = useState(landObject);
  const [updatedLandData, setupdatedLandData] = useState({});
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

  //updateDataofTable
  const districtChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      district: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      district: e.target.value,
    }));
    // updatedLandData.district = e.target.value;
  };

  const subRegistrarOfficeChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      subRegistrarOffice: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      subRegistrarOffice: e.target.value,
    }));
  };

  const talukChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      taluk: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      taluk: e.target.value,
    }));
  };

  const villageChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      village: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      village: e.target.value,
    }));
  };

  const blockNoChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      blockNo: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      blockNo: e.target.value,
    }));
  };

  const oldsurveyNoChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      oldsurveyNo: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      oldsurveyNo: e.target.value,
    }));
  };

  const resurveyNoChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      resurveyNo: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      resurveyNo: e.target.value,
    }));
  };

  const areaAcresChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      areaAcres: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      areaAcres: e.target.value,
    }));
  };

  const areaCentChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      areaCent: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      areaCent: e.target.value,
    }));
  };

  const eastBoundaryChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      eastBoundary: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      eastBoundary: e.target.value,
    }));
  };

  const northBoundaryChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      northBoundary: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      northBoundary: e.target.value,
    }));
  };

  const westBoundaryChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      westBoundary: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      westBoundary: e.target.value,
    }));
  };

  const southBoundaryChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      southBoundary: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      southBoundary: e.target.value,
    }));
  };

  const remarksChangeHandler = (e) => {
    setsearchedLandData((searchedLandData) => ({
      ...searchedLandData,
      remarks: e.target.value,
    }));
    setupdatedLandData((updatedLandData) => ({
      ...updatedLandData,
      remarks: e.target.value,
    }));
  };

  console.log(updatedLandData);
  console.log(searchedLandData);

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
    setupdatedLandData({});
    let filter = {};
    filter[parameter] = landReference;

    try {
      const response = await fetch(
        `http://localhost:4000/api/blockChainfindLand`,
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
          console.log(body);
        } else {
          const error = await response.json();
          swal(error.error, error.message, "error");
        }
      });
    } catch (error) {
      setisLoading(false);
      swal("Error", `${error.message}`, "error");
    }
    //office pc commenting end
  };

  const verifyButtonHandler = async () => {
    const landID = landReference;
    console.log(landID);
    console.log(searchedLandData);
    console.log(updatedLandData);

    if (
      Object.keys(updatedLandData).length === 0 &&
      updatedLandData.constructor === Object
    ) {
      swal(
        "Error",
        `No values are changed for updation in Blockchain`,
        "error"
      );
    } else {
      setisLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/blockChainUpdateLand`,
          {
            method: "post",
            body: JSON.stringify({
              landId: landID,
              searchedLandData,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then(async function (response) {
          setisLoading(false);
          console.log(response.status);

          if (response.status === 200) {
            swal(
              "Success",
              `Updated Land ${landReference} to blockchain successfully`,
              "success"
            );
            resetButtonHandler();
          } else {
            const error = await response.json();
            swal(error.error, error.message, "error");
            setshowTable(false);
          }
        });
      } catch (error) {
        setisLoading(false);
        swal("Error", `${error.message}`, "error");
      }
    }
  };

  return (
    <div className="sro-background">
      <SroNavbar page="Search Land Record" />
      <div className="sro-searchbox">
        <Stack gap={3} className="col-md-5 mx-auto">
          <h1>Updating a Land Record from Blockchain</h1>
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
        <Stack gap={3} className="col-md-5 mx-auto fetched-land-div">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    District
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.district}
                      size="small"
                      onChange={districtChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Sub-Registrar Office
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.subRegistrarOffice}
                      size="small"
                      onChange={subRegistrarOfficeChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Taluk
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.taluk}
                      size="small"
                      onChange={talukChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Village
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.village}
                      size="small"
                      onChange={villageChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Block No
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.blockNo}
                      size="small"
                      onChange={blockNoChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Re-survey No
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.resurveyNo}
                      size="small"
                      onChange={resurveyNoChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Old-survey No
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.oldsurveyNo}
                      size="small"
                      onChange={oldsurveyNoChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Area (Acres)
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.areaAcres}
                      size="small"
                      onChange={areaAcresChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Area (Cent)
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.areaCent}
                      size="small"
                      onChange={areaCentChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    East Boundary
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.eastBoundary}
                      size="small"
                      onChange={eastBoundaryChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    North Boundary
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.northBoundary}
                      size="small"
                      onChange={northBoundaryChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    West Boundary
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.westBoundary}
                      size="small"
                      onChange={westBoundaryChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    South Boundary
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.southBoundary}
                      size="small"
                      onChange={southBoundaryChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Remarks
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      defaultValue={searchedLandData.remarks}
                      size="small"
                      onChange={remarksChangeHandler}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Present Owner
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.presentOwner}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Mutated
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.isLandMutated == true ||
                    searchedLandData.isLandMutated == "true"
                      ? "Yes"
                      : "No"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Mortgaged
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.isLandMutated == true ||
                    searchedLandData.isLandMutated == "true"
                      ? "Yes"
                      : "No"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Status
                  </TableCell>
                  <TableCell align="right">{searchedLandData.status}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Old databse ID
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.mongoDBId}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="horizontal"
            gap={2}
            className="col-md-15 mx-auto buttons-stack"
          >
            <Button as="a" variant="danger" onClick={resetButtonHandler}>
              Reset
            </Button>

            <Button as="a" variant="success" onClick={verifyButtonHandler}>
              Verify and Update to Blockchain
            </Button>
          </Stack>
        </Stack>
      )}

      {isLoading && <Loading />}
    </div>
  );
}

export default SroUpdateLand;
