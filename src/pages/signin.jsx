import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Use the useNavigate hook here
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log('handmleSumiu');
    e.preventDefault();
    try {
      // Make a POST request to the server
      const response = await axios.post(
        'http://localhost:3001/login',
        {
          username,
          password
        },
        { withCredentials: true }
      );

      // Handle the response from the server
      //console.log('Server response:', response.data);
      console.log('The response data success:', response);
      //console.log("session", response.data.session);

      if (response.data.isLoggedIn) {
        // Redirect to '/' on successful login
        //localStorage.setItem('token', response.data.token);

        navigate('/');
        console.log('Login successful!', response);
      } else {
        navigate('/login');

        //setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors or display an error message to the user
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="col-md-4">
        <Card>
          <Card.Header className="text-center">
            <h4>
              <img src="/img/sticker.png" width="60" height="60" alt="Logo" /> Portal
            </h4>
          </Card.Header>
          <Card.Body>
            <Form autoComplete="on">
              <Form.Group controlId="username">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="on"
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer className="d-flex align-items-center justify-content-center">
            <Button onClick={handleSubmit} variant="primary" style={{ width: '20vh' }}>
              Login
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
