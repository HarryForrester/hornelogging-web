// App.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
//import { AlertMessageProvider } from '../components/AlertMessage';
import { BrowserRouter as Router } from 'react-router-dom';
jest.mock('../components/AlertMessage', () => ({
    useAlertMessage: jest.fn(() => ({
        alertMessageState: null,
        setAlertMessageState: jest.fn()
    }))
}));

test('renders login page', () => {
  render(
      <App />
  );

  // Check if elements are present on the login page
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  expect(screen.getByText(/no menu/i)).toBeInTheDocument();
});
