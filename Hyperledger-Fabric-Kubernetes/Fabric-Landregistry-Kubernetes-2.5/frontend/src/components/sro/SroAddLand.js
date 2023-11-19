import React, { useState } from "react";
import "./SroHome.css";
import { Button, Stack, Badge, Alert, Form, Table } from "react-bootstrap";
import swal from "sweetalert";
import SroNavbar from "./SroNavbar";
import { landObject } from "../home/landObject";
import { sampleLandData } from "../home/sampleLandObjectData";
import Loading from "../ui/Loading";

function SroAddLand() {
  const [parameter, setparameter] = useState("");
  const [landReference, setlandReference] = useState("");
  const [searchedLandData, setsearchedLandData] = useState([landObject]);
  const [isLoading, setisLoading] = useState(false);
  const [showNoRecordFound, setshowNoRecordFound] = useState(false);
  const [showTable, setshowTable] = useState(false);

  //error
  const [showParameterError, setshowParameterError] = useState(false);
  const [showLandReferenceError, setshowLandReferenceError] = useState(false);

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
    const response = await fetch(`http://localhost:4000/api/findLand`, {
      method: "post",
      body: JSON.stringify(filter),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      setisLoading(false);
      const body = response.json();
      Promise.resolve(body).then((result) => {
        if (result.length > 0) {
          setsearchedLandData(result);
          setshowTable(true);
          setshowNoRecordFound(false);
        } else {
          setshowNoRecordFound(true);
        }
      });
    });
    //office pc commenting end
  };

  const resetButtonHandler = () => {
    setshowTable(false);
    setsearchedLandData("");
  };

  const verifyButtonHandler = async () => {
    // alert("going to blockchain..")
    setisLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/addLand`, {
        method: "post",
        body: JSON.stringify({
          mongoDBId: searchedLandData[0]._id,
          district: searchedLandData[0].district,
          subRegistrarOffice: searchedLandData[0].subRegistrarOffice,
          taluk: searchedLandData[0].taluk,
          village: searchedLandData[0].village,
          blockNo: searchedLandData[0].blockNo,
          resurveyNo: searchedLandData[0].resurveyNo,
          oldSurveyNo: searchedLandData[0].oldSurveyNo,
          areaAcres: searchedLandData[0].areaAcres.toString(),
          areaCent: searchedLandData[0].areaCent.toString(),
          eastBoundary: searchedLandData[0].eastBoundary,
          northBoundary: searchedLandData[0].northBoundary,
          southBoundary: searchedLandData[0].southBoundary,
          westBoundary: searchedLandData[0].westBoundary,
          presentOwner: searchedLandData[0].presentOwner,
          remarks: searchedLandData[0].remarks,
          landId: searchedLandData[0].landId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async function (response) {
        setisLoading(false);
        console.log(response.status);

        if (response.status === 200) {
          swal(
            "Success",
            `Added Land ${searchedLandData[0].landId} to blockchain successfully`,
            "success"
          );
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

  console.log(searchedLandData);
  return (
    <div className="sro-background">
      <SroNavbar page="Add Land Record" />
      <div className="sro-searchbox">
        <Stack gap={3} className="col-md-5 mx-auto">
          <h1>Adding a Land Record to Blockchain</h1>
          <Form.Label className="fw-bold">
            Choose any one of the below parameter & enter that reference no. to{" "}
            <u>search from existing database</u> for addition to Blockchain:{" "}
          </Form.Label>
          <Stack direction="horizontal" gap={3}>
            <Form.Label className="fw-bold parameter">Parameter</Form.Label>
            {/* <Form.Check name="group1" type="radio" label="Land Id" value="landId" onClick={parameterChangeHandler} /> */}
            <Form.Check
              name="group1"
              type="radio"
              label="Re-Survey No"
              value="resurveyNo"
              onClick={parameterChangeHandler}
            />
            <Form.Check
              name="group1"
              type="radio"
              label="Old Survey No"
              value="oldSurveyNo"
              onClick={parameterChangeHandler}
            />
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

          {showNoRecordFound && (
            <Alert variant="warning">No data fetched</Alert>
          )}
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
                <td>{searchedLandData[0].district}</td>
              </tr>

              <tr>
                <td>Sub-Registrar Office</td>
                <td>{searchedLandData[0].subRegistrarOffice}</td>
              </tr>

              <tr>
                <td>Taluk</td>
                <td>{searchedLandData[0].taluk}</td>
              </tr>

              <tr>
                <td>Village</td>
                <td>{searchedLandData[0].village}</td>
              </tr>

              <tr>
                <td>Block No</td>
                <td>{searchedLandData[0].blockNo}</td>
              </tr>

              <tr>
                <td>Re-survey No</td>
                <td>{searchedLandData[0].resurveyNo}</td>
              </tr>

              <tr>
                <td>Old-survey No</td>
                <td>{searchedLandData[0].oldSurveyNo}</td>
              </tr>

              <tr>
                <td>Land Area (Acres)</td>
                <td>{searchedLandData[0].areaAcres}</td>
              </tr>

              <tr>
                <td>Land Area (Cent)</td>
                <td>{searchedLandData[0].areaCent}</td>
              </tr>

              <tr>
                <td>East Boundary</td>
                <td>{searchedLandData[0].eastBoundary}</td>
              </tr>

              <tr>
                <td>North Boundary</td>
                <td>{searchedLandData[0].northBoundary}</td>
              </tr>

              <tr>
                <td>West Boundary</td>
                <td>{searchedLandData[0].westBoundary}</td>
              </tr>

              <tr>
                <td>South Boundary</td>
                <td>{searchedLandData[0].southBoundary}</td>
              </tr>

              <tr>
                <td>Remarks</td>
                <td>{searchedLandData[0].remarks}</td>
              </tr>

              <tr>
                <td>Present Owner</td>
                <td>{searchedLandData[0].presentOwner}</td>
              </tr>

              <tr>
                <td>Land Id</td>
                <td>{searchedLandData[0].landId}</td>
              </tr>

              <tr>
                <td>Mongo DB ID</td>
                <td>{searchedLandData[0]._id}</td>
              </tr>
            </tbody>
          </Table>

          <Stack
            direction="horizontal"
            gap={2}
            className="col-md-15 mx-auto buttons-stack"
          >
            <Button as="a" variant="danger" onClick={resetButtonHandler}>
              Reset
            </Button>
            <Button as="a" variant="success" onClick={verifyButtonHandler}>
              Verify and Add to Blockchain
            </Button>
          </Stack>
        </Stack>
      )}

      {isLoading && <Loading />}
    </div>
  );
}

export default SroAddLand;
