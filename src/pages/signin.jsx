import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import axios from 'axios';
//import Cookies from 'js-cookie';
import { Form, Button, Card, Alert } from 'react-bootstrap';
//import { set } from 'date-fns';
import PropTypes from 'prop-types';
////import { useAuth } from '../context/AuthContext';
import NoMenu from '../components/NavBar/nomenu';

const LoginPage = () => {
  //const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [message, setMessage] = useState('');

  // Use the useNavigate hook here
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      //await login(username, password);
      //await login(username, password);
      const response = await axios.post(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_URL}/login`,
        { username, password },
        { withCredentials: true }
      );
      console.log('login respsonse:', response.data);
      if (response.status === 200) {
        navigate('/');
      }
    }
  };

  return (
    <>
      <NoMenu />
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
              <Button
                onClick={(e) => handleSubmit(e, username, password)}
                variant="primary"
                style={{ width: '20vh' }}
              >
                Login
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  );
};

LoginPage.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default LoginPage;
