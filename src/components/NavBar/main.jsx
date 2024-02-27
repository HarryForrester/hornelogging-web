import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

import { Link } from 'react-router-dom';

const NavBar = ({ username, children }) => {
  return (
    <>
      <Navbar expand="lg" fixed="top" bg="light" variant="light">
      <Container style={{ maxWidth: '1140px' }}>
        <Link className="navbar-brand" to="/">
          <img src="/img/sticker.png" alt="Portal" width="30" height="30" className="d-inline-block align-top" />
          Portal
        </Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">People & Crews</Nav.Link>
            <Nav.Link as={Link} to="/maps">Jobs</Nav.Link>
            <Nav.Link as={Link} to="/hazards">Hazards</Nav.Link>
            <Nav.Link as={Link} to="/forms">Forms</Nav.Link>
            <Nav.Link as={Link} to="/library">Library</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            {/* Add other navigation links as needed */}
            <Nav.Link as={Link} to="/login">Logout ({username})</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <div className="container" style={{ marginTop: '3.5rem', maxWidth: '1140px' }}>
        {children}
      </div>
    </>
  );
};

export default NavBar;
