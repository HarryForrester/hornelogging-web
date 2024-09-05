import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddCrewModal from '../components/Modal/AddCrewModal';
import { useAlertMessage } from '../components/AlertMessage';
import { useCrews } from '../context/CrewContext';
import { usePeople } from '../context/PeopleContext'

// Mock the necessary contexts
jest.mock('../context/PeopleContext', () => ({
  usePeople: jest.fn()
}));
jest.mock('../context/CrewContext', () => ({
  useCrews: jest.fn()
}));
jest.mock('../components/AlertMessage');
jest.mock('axios');

describe('AddCrewModal', () => {
  const mockAddToast = jest.fn();
  const mockCloseModal = jest.fn();
  const mockSetPeopleState = jest.fn();
  const mockSetCrews = jest.fn();

  beforeEach(() => {
    useAlertMessage.mockReturnValue({
      addToast: mockAddToast,
    }); 

    usePeople.mockReturnValue({
      people: {
        peopleByCrew: [],
        archivedPeople: [],
      },
      setPeople: mockSetPeopleState
    });

    useCrews.mockReturnValue({crews: [{_id: 'crew_id_1', _account: 2, name: 'Crew One'}]})

    // Mock the axios.post method
    axios.post = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

 test('renders the modal and form correctly', () => {
  const mockCloseModal = jest.fn();
  render(<AddCrewModal show={true} closeModal={mockCloseModal} />);
  
  expect(screen.getByText(/Add Crew/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Crew Name/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
});

 test('handles input change', () => {
  const mockCloseModal = jest.fn();
  render(<AddCrewModal show={true} closeModal={mockCloseModal} />);  
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
    const mockCloseModal = jest.fn();
    render(<AddCrewModal show={true} closeModal={mockCloseModal} />);  
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Crew Name/i), { target: { value: 'New Crew' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    // Wait for the results
    await waitFor(() => {
      // Verify setMapState was called with the correct updater function
      const peopleStateUpdater = mockSetPeopleState.mock.calls[0][0];
      const peopleStateInitialState = {
        peopleByCrew: [{ _id: 'new-crew-id', name: 'New Crew', people: [] }],
        archivedPeople: []
      };
  
      // Call the updater function with the initial state
      const peopleStateUpdatedState = peopleStateUpdater(peopleStateInitialState);
  
       // Define the expected state after update
      const expectedPeopleState = {
        peopleByCrew: [{ _id: 'new-crew-id', name: 'New Crew', people: [] }],
        archivedPeople: []
      };
      console.log('poepleStateUpdatedState', peopleStateUpdatedState)
      // Assert that the state was updated correctly
      expect(peopleStateUpdatedState).toEqual(expectedPeopleState);
      expect(mockAddToast).toHaveBeenCalledWith(
        'Add Crew',
        'Success! "New Crew" has been added',
        'success',
        'white'
      );
      expect(mockCloseModal).toHaveBeenCalled();

    });
  }); 
  

 test('shows alert if crew already exists', async () => {
    useCrews.mockReturnValue({crews: [{_id: 'crew_id_1', _account: 2, name: 'Existing Crew'}], setCrews: mockSetCrews})
    render(<AddCrewModal show={true} closeModal={mockCloseModal} />);  
    
    fireEvent.change(screen.getByLabelText(/Crew Name/i), { target: { value: 'Existing Crew' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
    
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        'Add Crew',
        'Error! Crew named "Existing Crew" already exists. Please try another crew name',
        'danger',
        'white'
      );
    });
}); 
 
 test('handles form submission error', async () => {
  axios.post.mockRejectedValueOnce(new Error('Network Error'));
  
  render(<AddCrewModal show={true} closeModal={mockCloseModal} />);  
  
  fireEvent.change(screen.getByLabelText(/Crew Name/i), { target: { value: 'New Crew' } });
  fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
  await waitFor(() => {
    expect(mockAddToast).toHaveBeenCalledWith(
      'Add Crew',
      'Error! An Error occurred while adding "New Crew"',
      'danger',
      'white'
    );
  });
}); 

})