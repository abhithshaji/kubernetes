import React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Stack,
  Badge,
  Alert,
  Form,
  Table,
  Spinner,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import "./Revenue.css";
import image from "../../assets/logo.png";
import Footer from "../home/Footer";

function RevenueNavbar(props) {
  const { page } = props;
  return (
    <div>
      <Navbar
        className="sro-navbar navbar navbar-dark sro-navbar-text"
        bg="dark"
        expand="lg"
      >
        <Container>
          <Navbar.Brand href="#home" className="sro-navbar-text">
            <Box
              className="logo-box"
              component="img"
              sx={{
                height: "4vh",
              }}
              alt="Your logo."
              src={image}
            />
          </Navbar.Brand>

          <Navbar.Brand href="#home" className="sro-navbar-text">
            Blockchain Land Registry Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto sro-navbar-text">
              <Nav.Link href="/revenueSearchLand" className="sro-navbar-text">
                Search Land
              </Nav.Link>

              <Nav.Link href="/revenueMutation" className="sro-navbar-text">
                Land Mutation
              </Nav.Link>
            </Nav>
            <Nav className="sro-navbar-text2">Revenue - {page}</Nav>
            <Nav>
              <Nav.Link className="sro-navbar-text" href="/">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Footer />
    </div>
  );
}

export default RevenueNavbar;
