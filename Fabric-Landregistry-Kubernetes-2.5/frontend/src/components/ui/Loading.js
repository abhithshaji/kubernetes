import React from "react";
import Backdrop from "./Backdrop";
import { Spinner } from "react-bootstrap";
import "./Loading.css";

function Loading() {
  return (
    <div>
      <Backdrop />
      <div className="spinner-loading">
        <Spinner animation="border" role="status" variant="secondary">
          Loading.....
        </Spinner>
      </div>
    </div>
  );
}

export default Loading;
