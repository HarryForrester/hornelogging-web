import React, { useState } from 'react';
import './styles.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    // You can use the 'username' and 'password' state values
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h4 className="text-center">
              <img src="/img/sticker.png" width="60" height="60" alt="Logo" />
              Portal
            </h4>
          </div>
          <div className="card-body">
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Email Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
