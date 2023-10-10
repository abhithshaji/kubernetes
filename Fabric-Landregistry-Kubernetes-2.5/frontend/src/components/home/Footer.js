import React from "react";
import { Stack, Nav, Navbar } from "react-bootstrap";
import packageJson from "../../../package.json";

function Footer() {
  return (
    <Stack className="text-center">
      <Navbar
        bg="secondary"
        expand="lg"
        fixed="bottom"
        className="sro-navbar-bottom m-auto"
      >
        <Nav className="m-auto">
          ©2023 | KBA Project | v{packageJson.version}
        </Nav>
      </Navbar>
    </Stack>
  );
}

export default Footer;
