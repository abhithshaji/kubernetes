import React, { useState } from "react";
import BankNavbar from "./BankNavbar";
import { landObject } from "../home/landObject";
import swal from "sweetalert";
import { Button, Stack, Form } from "react-bootstrap";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import Loading from "../ui/Loading";
import { sampleLandData } from "../home/sampleLandObjectData";

function BankMortgage() {
  const [parameter, setparameter] = useState("");
  const [landReference, setlandReference] = useState("");
  const [searchedLandData, setsearchedLandData] = useState(landObject);
  const [mortgageStatus, setmortgageStatus] = useState("");
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
    setmortgageStatus("");
  };

  //updateMortgage Status
  const mortgageStatusChangeHandler = (e) => {
    setmortgageStatus(e.target.value);
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
    //commenting for office pc
  };

  const verifyButtonHandler = async () => {
    if (mortgageStatus) {
      let mortgageObject = {};
      if (mortgageStatus === "mortgageDone") {
        mortgageObject["mortgageStatusUpdate"] = true;
      } else if (mortgageStatus === "mortgageRemoved") {
        mortgageObject["mortgageStatusUpdate"] = false;
      }
      mortgageObject.landId = landReference;

      setisLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/updateMortgageStatus`,
          {
            method: "post",
            body: JSON.stringify(mortgageObject),
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
              `Updated Land  ${landReference} Mortgage Status to blockchain successfully`,
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
    } else {
      swal("Error", `Please update the mortgage status`, "error");
    }
  };

  return (
    <div className="sro-background">
      <BankNavbar page="Mortgage Land Record" />
      <div className="sro-searchbox">
        <Stack gap={3} className="col-md-5 mx-auto">
          <h1>Add Land Mortgage in Blockchain</h1>
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
                    {searchedLandData.district}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Sub-Registrar Office
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.subRegistrarOffice}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Taluk
                  </TableCell>
                  <TableCell align="right">{searchedLandData.taluk}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Village
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.village}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Block No
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.blockNo}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Re-survey No
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.resurveyNo}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Old-survey No
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.oldsurveyNo}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Area (Acres)
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.areaAcres}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Area (Cent)
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.areaCent}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    East Boundary
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.eastBoundary}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    North Boundary
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.northBoundary}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    West Boundary
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.westBoundary}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    South Boundary
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.southBoundary}
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
                    Status
                  </TableCell>
                  <TableCell align="right">{searchedLandData.status}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Existing Owner
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.presentOwner}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Existing Remarks
                  </TableCell>
                  <TableCell align="right">
                    {searchedLandData.remarks}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Land Mortgaged
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      select
                      size="small"
                      onChange={mortgageStatusChangeHandler}
                    >
                      <MenuItem value={"mortgageDone"}>
                        Land is Under Mortgage
                      </MenuItem>
                      <MenuItem value={"mortgageRemoved"}>
                        Land Mortgage Removed
                      </MenuItem>
                    </TextField>
                  </TableCell>
                </TableRow>
                {/* //TODO: */}
                {/* <TableRow>
            <TableCell component="th" scope="row">
              New Owner Aadhaar no.
            </TableCell>
            <TableCell align="right">
              <TextField
                size="small"
                onChange={newOwnerAadhaarChangeHandler}
              />
            </TableCell>
          </TableRow> */}
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

export default BankMortgage;
