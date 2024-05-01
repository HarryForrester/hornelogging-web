import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function NotFound() {
  return (
    <Container className="not-found-container">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="not-found-content text-center">
          <h1 className="text-danger">404 - Not Found</h1>
          <p>Oops! It seems like you&apos;ve reached a page that doesn&apos;t exist.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
