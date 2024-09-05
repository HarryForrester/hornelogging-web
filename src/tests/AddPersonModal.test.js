import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddPersonModal from '../components/Modal/AddPersonModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useAlertMessage } from '../components/AlertMessage';
import { useMap } from '../components/Map/MapContext';
import { usePeople } from '../context/PeopleContext';
import { useCrews } from '../context/CrewContext';
// Mock hooks and axios
jest.mock('axios');
jest.mock('../components/AlertMessage');//
jest.mock('../context/PeopleContext');
jest.mock('../context/CrewContext', () => ({
  useCrews: jest.fn()
}));

// Mocks for the hooks
const mockPeopleState = {
  peopleByCrew: [{ _id: 'crew_id_1', name: 'Crew One', people: [] }, {_id: 'crew_id_2', name: 'Unassigned', unassigned: true, people: []}],
  archivedPeople: [],
}

describe('AddPersonModal', () => {
  const mockCloseModal = jest.fn();
  const mockAddToast = jest.fn();
  const mockSetPeopleState = jest.fn();

  beforeEach(() => {
    useAlertMessage.mockReturnValue({
      addToast: mockAddToast,
    }); 
    
    usePeople.mockReturnValue({
      people: mockPeopleState,
      setPeople: mockSetPeopleState
    });

    useCrews.mockReturnValue({crews: [{_id: 'crew_id_1', _account: 2, name: 'Crew One'}]})

    axios.post = jest.fn();

  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('handles form input changes', () => {
    render(<AddPersonModal show={true} closeModal={mockCloseModal} />);
    
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'Crew A' } });
  
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/Crew/i)).toHaveValue('crew_id_1');
});
 
test('submits form successfully', async () => {
     axios.post.mockResolvedValueOnce({
      status: 200,
      data: { person: {_id: 'person_id_1', name: 'Doe John', crew: 'crew_id_1' } }
    }); 

    render(<AddPersonModal show={true} closeModal={mockCloseModal} />);
  
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'crew_id_1' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    await waitFor(() => {
      
      expect(mockSetPeopleState).toHaveBeenCalledWith(expect.any(Function));
      const peopleStateUpdater = mockSetPeopleState.mock.calls[0][0];
      const updatedPeopleState = peopleStateUpdater(mockPeopleState);
  
      expect(updatedPeopleState.peopleByCrew).toContainEqual({
        _id: 'crew_id_1',
        name: 'Crew One',
        people: [{ _id: 'person_id_1',crew: 'crew_id_1', name: 'Doe John'}]
      });

      expect(mockAddToast).toHaveBeenCalledWith(
        'Add Person',
        'Success! "John Doe" has been added to "Crew One"',
        'success',
        'white'
      );
    });
}); 

test('handles form submission error', async () => {
    // Mock axios.post to simulate a network error
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
  
    // Render the AddPersonModal component
    render(<AddPersonModal show={true} closeModal={mockCloseModal} />);
  
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'crew_id_1' } });
  
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    // Wait for the alert message state to be updated
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        'Add Person',
        'Error! "John Doe" could not be added to "Crew One"',
        'danger',
        'white'
      );
    });
  }); 

test('updates form inputs correctly', () => {
  render(<AddPersonModal show={true} closeModal={mockCloseModal} />);
  
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Crew/i), { target: { value: 'crew_id_1' } });
  
    expect(screen.getByLabelText(/First Name/i).value).toBe('John');
    expect(screen.getByLabelText(/Last Name/i).value).toBe('Doe');
    expect(screen.getByLabelText(/Crew/i).value).toBe('crew_id_1');
  });
 
})

