import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Maps from '../pages/maps';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom'; // For components using useNavigate
import { mockLibraryFiles, mockPersonFiles, mockMapState, mockCrewsState } from './test-data';
jest.mock('axios'); // Mock axios

// Mock the context hooks used in Maps component
jest.mock('../components/Map/MapContext.js', () => ({
  useMap: () => ({
    mapState: mockMapState,
    setMapState: jest.fn()
  })
}));

jest.mock('../components/ConfirmationModalContext.js', () => ({
  useConfirmationModal: () => ({
    confirmationModalState: { confirmed: false },
    setConfirmationModalState: jest.fn()
  })
}));

jest.mock('../components/AlertMessage.js', () => ({
  useAlertMessage: () => ({
    addToast: jest.fn()
  })
}));

jest.mock('../context/PersonFileContext', () => ({
    usePersonFile: () => ({
        personFiles: mockPersonFiles,
        setPersonFiles: jest.fn()
    })
}));

jest.mock('../context/LibraryFileContext', () => ({
    useLibraryFile: () => ({
        libraryFiles: mockLibraryFiles,
        setLibraryFiles: jest.fn()
    })
}));

jest.mock('../context/CrewContext.js', () => ({
    useCrews: () => ({
        crews: mockCrewsState,
        setCrews: jest.fn()
    })
}))


// Additional mocks for other context providers and hooks...

describe('Maps Component', () => {
  // Before each test, reset mock implementations and setup mock data
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        isLoggedIn: true,
        _account: 'test-account',
        libraryFileTypes: [],
        libraryFiles: [],
        personFileTypes: [],
        personFiles: [],
        crews: [],
        maps: [{ _id: '1', name: 'Test Map', points: [], map: { key: 'test-map-key' } }],
        hazards: [],
        people: [],
        generalHazards: []
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders component and fetches data', async () => {
    render(
      <MemoryRouter>
        <Maps />
      </MemoryRouter>
    );

    // Check that loading spinner is shown initially (if applicable)
    //expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for the fetch call to complete
    await waitFor(() => {
      expect(screen.getByText('Test Map')).toBeInTheDocument();
    });

    // Check that the fetched data is displayed correctly
    expect(screen.getByText('Test Map')).toBeInTheDocument();
  });


  // Additional test cases for different interactions and conditions
});