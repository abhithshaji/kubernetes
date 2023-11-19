import React, { useState } from "react";
import SroNavbar from "./SroNavbar";
import { Button, Stack, Form, Table } from "react-bootstrap";
import swal from "sweetalert";
import { landObject } from "../home/landObject";
import Loading from "../ui/Loading";
import { sampleLandData } from "../home/sampleLandObjectData";

function SroDeleteLand() {
  //state variables
  const [parameter, setparameter] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [landReference, setlandReference] = useState("");
  const [searchedLandData, setsearchedLandData] = useState(landObject);
  const [showTable, setshowTable] = useState(false);
  //error
  const [showParameterError, setshowParameterError] = useState(false);
  const [showLandReferenceError, setshowLandReferenceError] = useState(false);

  //functions
  const resetButtonHandler = () => {
    setshowTable(false);
    setsearchedLandData("");
  };

  const parameterChangeHandler = (e) => {
    setparameter(e.target.value);
  };

  const landReferenceChangeHandler = (e) => {
    setlandReference(e.target.value);
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
    //office pc commenting start
  };

  const deleteButtonHandler = async () => {
    setisLoading(true);
    let filter = {};
    filter[parameter] = landReference;
    try {
      const response = await fetch(
        `http://localhost:4000/api/blockChainDeleteLand`,
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
          const result = await response.json();
          swal("Success", result.message, "success");
          resetButtonHandler();
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

  return (
    <div className="sro-background">
      <SroNavbar page="Delete Land Record" />
      <div className="sro-searchbox">
        <Stack gap={3} className="col-md-5 mx-auto">
          <h1>Deleting a Land Record from Blockchain</h1>
          <Form.Label className="fw-bold">
            Choose the parameter & enter that reference no. to{" "}
            <u>search from blockchain</u> for deletion:{" "}
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
          <Table bordered size="sm" className="fetched-land-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>District</td>
                <td>{searchedLandData.district}</td>
              </tr>

              <tr>
                <td>Sub-Registrar Office</td>
                <td>{searchedLandData.subRegistrarOffice}</td>
              </tr>

              <tr>
                <td>Taluk</td>
                <td>{searchedLandData.taluk}</td>
              </tr>

              <tr>
                <td>Village</td>
                <td>{searchedLandData.village}</td>
              </tr>

              <tr>
                <td>Block No</td>
                <td>{searchedLandData.blockNo}</td>
              </tr>

              <tr>
                <td>Re-survey No</td>
                <td>{searchedLandData.resurveyNo}</td>
              </tr>

              <tr>
                <td>Old-survey No</td>
                <td>{searchedLandData.oldsurveyNo}</td>
              </tr>

              <tr>
                <td>Land Area (Acres)</td>
                <td>{searchedLandData.areaAcres}</td>
              </tr>

              <tr>
                <td>Land Area (Cent)</td>
                <td>{searchedLandData.areaCent}</td>
              </tr>

              <tr>
                <td>East Boundary</td>
                <td>{searchedLandData.eastBoundary}</td>
              </tr>

              <tr>
                <td>North Boundary</td>
                <td>{searchedLandData.northBoundary}</td>
              </tr>

              <tr>
                <td>West Boundary</td>
                <td>{searchedLandData.westBoundary}</td>
              </tr>

              <tr>
                <td>South Boundary</td>
                <td>{searchedLandData.southBoundary}</td>
              </tr>

              <tr>
                <td>Remarks</td>
                <td>{searchedLandData.remarks}</td>
              </tr>

              <tr>
                <td>Present Owner</td>
                <td>{searchedLandData.presentOwner}</td>
              </tr>

              <tr>
                <td>Land Mutated</td>
                <td>
                  {searchedLandData.isLandMutated == true ||
                  searchedLandData.isLandMutated == "true"
                    ? "Yes"
                    : "No"}
                </td>
              </tr>

              <tr>
                <td>Land Mortgaged</td>
                <td>
                  {searchedLandData.isLandMortgaged == true ||
                  searchedLandData.isLandMortgaged == "true"
                    ? "Yes"
                    : "No"}
                </td>
              </tr>

              <tr>
                <td>Status</td>
                <td>{searchedLandData.status}</td>
              </tr>

              <tr>
                <td>Old Database ID</td>
                <td>{searchedLandData.mongoDBId}</td>
              </tr>
            </tbody>
          </Table>

          <Stack
            direction="horizontal"
            gap={2}
            className="col-md-15 mx-auto buttons-stack"
          >
            <Button as="a" variant="warning" onClick={resetButtonHandler}>
              Reset
            </Button>
            <Button as="a" variant="danger" onClick={deleteButtonHandler}>
              Verify and Delete from Blockchain
            </Button>
          </Stack>
        </Stack>
      )}

      {isLoading && <Loading />}
    </div>
  );
}

export default SroDeleteLand;
