import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddCrewModal from '../components/Modal/AddCrewModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useMap } from '../components/Map/MapContext';
import { useAlertMessage } from '../components/AlertMessage';

// Mock the necessary contexts
jest.mock('../components/Modal/Skid/SkidModalContext', () => ({
  useSkidModal: jest.fn()
}));
jest.mock('../components/Map/MapContext', () => ({
  useMap: jest.fn()
}));
jest.mock('../components/AlertMessage', () => ({
  useAlertMessage: jest.fn()
}));
jest.mock('axios');

const mockSetSkidModalState = jest.fn();
const mockSetMapState = jest.fn();
const mockSetAlertMessageState = jest.fn();

beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  
    // Provide mock implementations for the contexts
    useSkidModal.mockReturnValue({
      skidModalState: { isAddCrewModalVisible: true },
      setSkidModalState: mockSetSkidModalState
    });
  
    useMap.mockReturnValue({
      mapState: {
        crews: [{ _id: '65d52471b65bd4722609c12e', name: '123', people: [] }],
        archivedPeople: []
      },
      setMapState: mockSetMapState
    });
  
    useAlertMessage.mockReturnValue({
      setAlertMessageState: mockSetAlertMessageState
    });
  
    // Mock the axios.post method
    axios.post = jest.fn();
  });

 test('renders the modal and form correctly', () => {
  render(<AddCrewModal />);
  
  expect(screen.getByText(/Add Crew/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Crew Name/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
});

test('handles input change', () => {
  render(<AddCrewModal />);
  
  const input = screen.getByLabelText(/Crew Name/i);
  fireEvent.change(input, { target: { value: 'New Crew' } });
  
  expect(input.value).toBe('New Crew');
}); 

test('submits form with new crew', async () => {
    // Mock the API response
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        crews: [{ _id: 'new-crew-id', name: 'New Crew', people: [] }],
        archivedPeople: []
      }
    });
  
    // Render the component
    render(<AddCrewModal />);
  
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Crew Name/i), { target: { value: 'New Crew' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    // Wait for the results
    await waitFor(() => {
      // Verify setMapState was called with the correct updater function
      const mapStateUpdater = mockSetMapState.mock.calls[0][0];
      const mapStateInitialState = {
        crews: [{ _id: '65d52471b65bd4722609c12e', name: '123', people: [] }],
        archivedPeople: []
      };
  
      // Call the updater function with the initial state
      const mapStateUpdatedState = mapStateUpdater(mapStateInitialState);
  
      // Define the expected state after update
      const expectedMapState = {
        crews: [{ _id: 'new-crew-id', name: 'New Crew', people: [] }],
        archivedPeople: []
      };
  
      // Assert that the state was updated correctly
      expect(mapStateUpdatedState).toEqual(expectedMapState);
  
      // Verify setSkidModalState was called with the correct updater function
      expect(mockSetSkidModalState).toHaveBeenCalled();
      const skidModalStateUpdater = mockSetSkidModalState.mock.calls[0][0];
      const skidModalInitialState = { isAddCrewModalVisible: true };
      const skidModalUpdatedState = skidModalStateUpdater(skidModalInitialState);
  
      // Assert that the modal state is updated correctly
      expect(skidModalUpdatedState).toEqual({ isAddCrewModalVisible: false });
  
      // Verify setAlertMessageState was called with the correct state
      expect(mockSetAlertMessageState).toHaveBeenCalled();
      const alertMessageStateUpdater = mockSetAlertMessageState.mock.calls[0][0];
      const alertMessageInitialState = { toasts: [] };
      const alertMessageUpdatedState = alertMessageStateUpdater(alertMessageInitialState);
      // Assert that the alert message state includes the success message
      expect(alertMessageUpdatedState.toasts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          heading: 'Add Person',
          show: true,
          message: 'Success! New Crew has been added',
          background: 'success',
          color: 'white'
        })
      ])
    );
    });
  });
  

 test('shows alert if crew already exists', async () => {
  useMap.mockReturnValueOnce({
    mapState: { crews: [{ name: 'Existing Crew' }] },
    setMapState: mockSetMapState
  });
  
  render(<AddCrewModal />);
  
  fireEvent.change(screen.getByLabelText(/Crew Name/i), { target: { value: 'Existing Crew' } });
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
  await waitFor(() => {
    
    const alertMessageStateUpdater = mockSetAlertMessageState.mock.calls[0][0];
    const alertMessageInitialState = { toasts: [] };
    const alertMessageUpdatedState = alertMessageStateUpdater(alertMessageInitialState);
    expect(alertMessageUpdatedState.toasts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            heading: 'Add Crew',
            show: true,
            message: 'Error! An Error has occurred adding crew',
            background: 'danger',
            color: 'white'
          })
        ])
      );
  });
});
 
 test('handles form submission error', async () => {
  axios.post.mockRejectedValueOnce(new Error('Network Error'));
  
  render(<AddCrewModal />);
  
  fireEvent.change(screen.getByLabelText(/Crew Name/i), { target: { value: 'New Crew' } });
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
  await waitFor(() => {
    const alertMessageStateUpdater = mockSetAlertMessageState.mock.calls[0][0];
    const alertMessageInitialState = { toasts: [] };
    const alertMessageUpdatedState = alertMessageStateUpdater(alertMessageInitialState);
        expect(alertMessageUpdatedState.toasts).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                heading: 'Add Crew',
                show: true,
                message: 'Error! An Error has occurred adding crew',
                background: 'danger',
                color: 'white'
              })
        ])
      );
    
  });
});
 