import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddPersonModal from '../components/Modal/AddPersonModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useAlertMessage } from '../components/AlertMessage';
import { useMap } from '../components/Map/MapContext';

// Mock hooks and axios
jest.mock('axios');
jest.mock('../components/Modal/Skid/SkidModalContext');
jest.mock('../components/AlertMessage');
jest.mock('../components/Map/MapContext');

// Mocks for the hooks
const mockSetSkidModalState = jest.fn();
const mockSetAlertMessageState = jest.fn();
const mockSetMapState = jest.fn();
const mockMapState = {
  crews: [
    { name: 'Crew A', people: [] },
    { name: 'Crew B', people: [] }
  ]
};

useSkidModal.mockReturnValue({
  skidModalState: { isAddPersonModalVisible: true },
  setSkidModalState: mockSetSkidModalState
});

useAlertMessage.mockReturnValue({
  alertMessageState: { toasts: [] },
  setAlertMessageState: mockSetAlertMessageState
});

useMap.mockReturnValue({
  mapState: mockMapState,
  setMapState: mockSetMapState
});

test('handles form input changes', () => {
    render(<AddPersonModal />);
    
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'Crew A' } });
  
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/Crew/i)).toHaveValue('Crew A');
});
 
test('submits form successfully', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { person: { firstName: 'John', lastName: 'Doe', crew: 'Crew A' } }
    });
  
    render(<AddPersonModal />);
  
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'Crew A' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    await waitFor(() => {
      // Check if setMapState was called with a function
      expect(mockSetMapState).toHaveBeenCalledWith(expect.any(Function));
      const mapStateUpdater = mockSetMapState.mock.calls[0][0];
      const updatedMapState = mapStateUpdater(mockMapState);
  
      // Check the updated map state
      expect(updatedMapState.crews).toContainEqual({
        name: 'Crew A',
        people: [{ firstName: 'John', lastName: 'Doe', crew: 'Crew A' }]
      });
  
      // Check if setAlertMessageState was called with the correct arguments
      expect(mockSetAlertMessageState).toHaveBeenCalledWith(expect.any(Function));
      const alertMessageUpdater = mockSetAlertMessageState.mock.calls[0][0];
      const alertMessageInitialState = { toasts: [] };
      const alertMessageUpdatedState = alertMessageUpdater(alertMessageInitialState);
  
      expect(alertMessageUpdatedState.toasts).toContainEqual({
        id: expect.any(Number),
        heading: 'Add Crew',
        show: true,
        message: 'Success! John Doe has been added to Crew A',
        background: 'success',
        color: 'white'
      });
    });
});
test('handles form submission error', async () => {
    // Mock axios.post to simulate a network error
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
  
    // Render the AddPersonModal component
    render(<AddPersonModal />);
  
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'Crew A' } });
  
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    // Wait for the alert message state to be updated
    await waitFor(() => {
      // Ensure setAlertMessageState was called
      expect(mockSetAlertMessageState).toHaveBeenCalledWith(expect.any(Function));
      
      // Get the state updater function
      const alertMessageUpdater = mockSetAlertMessageState.mock.calls[0][0];
      const alertMessageInitialState = { toasts: [] };
      const alertMessageUpdatedState = alertMessageUpdater(alertMessageInitialState);
  
      // Check that the toast with error message is present
      expect(alertMessageUpdatedState.toasts).toContainEqual({
        id: expect.any(Number),
        heading: 'Add Person',
        show: true,
        message: 'Error! adding John Doe to Crew A',
        background: 'danger',
        color: 'white'
      });
    });
  });
  
  

  test('updates form inputs correctly', () => {
    render(<AddPersonModal />);
  
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'Crew A' } });
  
    expect(screen.getByLabelText(/First Name/i).value).toBe('John');
    expect(screen.getByLabelText(/Last Name/i).value).toBe('Doe');
    expect(screen.getByLabelText(/Crew/i).value).toBe('Crew A');
  });
