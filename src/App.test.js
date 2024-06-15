import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Crews from '../src/pages/crews';

// Mock axios
jest.mock('axios');

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Crews', () => {
  beforeEach(() => {
    // Reset mock state before each test
    jest.clearAllMocks();
  });

  it('fetches crews and renders them correctly', async () => {
    // Mock axios response
    const mockResponse = {
      data: {
        isLoggedIn: true,
        crews: [
          { name: 'Crew 1' },
          { name: 'Crew 2' },
          // Add more mock crew data as needed
        ],
        archivedPeople: [
          { name: 'Person 1', archived: true },
          { name: 'Person 2', archived: true },
          // Add more mock archived people data as needed
        ],
        username: 'testuser',
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    // Render the component
    render(<Crews />);

    // Wait for data to be fetched and rendered
    await screen.findByText('Crew 1');
    await screen.findByText('Crew 2');

    // Assert that crew cards are rendered
    expect(screen.getByText('Crew 1')).toBeInTheDocument();
    expect(screen.getByText('Crew 2')).toBeInTheDocument();
  });

  // Add more test cases as needed
});
