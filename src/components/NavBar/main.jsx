import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';

const NavBar = ({ username }) => {
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <>
      <Navbar expand="lg" fixed="top" bg="light" variant="light">
        <Container>
          <Link className="navbar-brand" to="/">
            <img
              src="/img/sticker.png"
              alt="Portal"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            Portal
          </Link>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/">
                People & Crews
              </Nav.Link>
              <Nav.Link as={Link} to="/maps">
                Jobs
              </Nav.Link>
              <Nav.Link as={Link} to="/hazards">
                Hazards
              </Nav.Link>
              <Nav.Link as={Link} to="/forms">
                Forms
              </Nav.Link>
              <Nav.Link as={Link} to="/library">
                Library
              </Nav.Link>
              <Nav.Link as={Link} to="/training">
                Training
              </Nav.Link>
              <Nav.Link as={Link} to="/tasks">
                Tasks
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
              {/* Add other navigation links as needed */}
              <Nav.Link as={Link} to="/login" onClick={logout}>
                Logout ({user})
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet context={{ user, isLoggedIn }} />
    </>
  );
};

NavBar.propTypes = {
  username: PropTypes.string.isRequired
};

export default NavBar;
