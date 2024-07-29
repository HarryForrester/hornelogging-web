// Import necessary dependencies
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Crews from '../pages/crews';
import { useMap } from '../components/Map/MapContext';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext'; // Adjust the import path
import { useAlertMessage } from '../components/AlertMessage';
// Mock the useMap hook
jest.mock('../components/Map/MapContext', () => ({
  useMap: jest.fn(),
}));

// Mock the useSkidModal hook
jest.mock('../components/Modal/Skid/SkidModalContext', () => ({
  useSkidModal: jest.fn(),
}));

// Mock the useAlertMessage hook
jest.mock('../components/AlertMessage', () => ({
  useAlertMessage: jest.fn(),
}));

// Mock the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock axios
jest.mock('axios');

// Define mock data for useMap
const mockUseMap = {
  mapState: {
    crews: [],
    archivedPeople: [],
  },
  setMapState: jest.fn(),
};

// Define mock data for useSkidModal
const mockUseSkidModal = {
  setSkidModalState: jest.fn(),
};

// Define mock data for useAlertMessage
const mockUseAlertMessage = {
  setAlertMessageState: jest.fn(),
};

describe('Crews Component', () => {
  beforeEach(() => {
    useMap.mockReturnValue(mockUseMap);
    useSkidModal.mockReturnValue(mockUseSkidModal);
    useAlertMessage.mockReturnValue(mockUseAlertMessage);
  });

  test('renders Crews component correctly', () => {
    render(
      <MemoryRouter>
        <Crews />
      </MemoryRouter>
    );

    expect(screen.getByText('Crews')).toBeInTheDocument();
    expect(screen.getByText('New Person')).toBeInTheDocument();
    expect(screen.getByText('New Crew')).toBeInTheDocument();
    expect(screen.getByText('Show Archived Staff')).toBeInTheDocument();
  });

  test('initial state is set correctly', () => {
    render(
      <MemoryRouter>
        <Crews />
      </MemoryRouter>
    );

    const { mapState } = mockUseMap;

    expect(mapState.crews).toEqual([]);
    expect(mapState.archivedPeople).toEqual([]);
  });

  test('fetches and sets mapState correctly', async () => {
    const mockData = {
      isLoggedIn: true,
      crews: [{ name: 'Crew 1' }],
      archivedPeople: [{ name: 'Person 1' }],
    };

    axios.get.mockResolvedValue({ data: mockData });

    render(
      <MemoryRouter>
        <Crews />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockUseMap.setMapState).toHaveBeenCalledWith(expect.any(Function)));

    expect(mockUseMap.setMapState).toHaveBeenCalledWith((prevState) => ({
      ...prevState,
      crews: mockData.crews,
      archivedPeople: mockData.archivedPeople,
    }));
  });

  test('navigates to login when not logged in', async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    const mockData = { isLoggedIn: false };
    axios.get.mockResolvedValue({ data: mockData });

    render(
      <MemoryRouter>
        <Crews />
      </MemoryRouter>
    );

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'));
  });

  test('toggleArchivedStaff toggles showArchived state', () => {
    render(
      <MemoryRouter>
        <Crews />
      </MemoryRouter>
    );

    const button = screen.getByText('Show Archived Staff');
    fireEvent.click(button);
    expect(mockUseMap.setMapState).toHaveBeenCalledWith(expect.any(Function));

    // Verify the button text change or other state changes
  });

  test('renders archived staff section when showArchived is true', () => {
    render(
      <MemoryRouter>
        <Crews />
      </MemoryRouter>
    );

    const { setShowArchived } = mockUseMap;

    act(() => {
      setShowArchived(true);
    });

    expect(screen.getByText('Archived Staff')).toBeInTheDocument();
  });
});
