import React, { useEffect } from 'react';
import { Navbar, Nav, NavDropdown, OverlayTrigger, Popover } from 'react-bootstrap';

const NoMenu = () => {
  return (
    <>
      {/* Meta tags */}
      <title>Horne Logging - Login</title>
      <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
      <style>
        {`
          body {
            background: url('/img/forestbackground.jpeg') no-repeat center center fixed;
            background-size: cover;
          }
        `}
      </style>

      <Navbar expand="lg" fixed="top" bg="light" variant="light">
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={
                <Popover id="popover-basic">
                  <Popover.Header as="h3">About Us</Popover.Header>
                  <Popover.Body>
                    Welcome to our About Us page. We are a company that does awesome stuff!
                  </Popover.Body>
                </Popover>
              }
            >
              <a className="nav-link" href="#">
                About Us
              </a>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container">{/* Render your body content here */}</div>
    </>
  );
};

export default NoMenu;
