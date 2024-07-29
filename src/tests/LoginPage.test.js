/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginPage from '../pages/signin.jsx';
import NoMenu from '../components/NavBar/nomenu';
import { useNavigate } from 'react-router-dom';

// Mock axios
jest.mock('axios');

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoginPage and elements', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to input username and password', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'test' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('test');
    expect(passwordInput.value).toBe('testpassword');
  });

  test('calls handleSubmit and navigates on successful login', async () => {
    // Mock the axios.post method
    axios.post.mockResolvedValueOnce({ status: 200 });
  
    // Mock the navigate function
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_URL}/login`,
        { username: 'testuser', password: 'password' },
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('does not navigate on failed login', async () => {
    axios.post.mockResolvedValueOnce({ status: 401 });

    const mockNavigate = useNavigate();
    mockNavigate.mockReturnValue(jest.fn());

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_URL}/login`,
        { username: 'testuser', password: 'password' },
        { withCredentials: true }
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
