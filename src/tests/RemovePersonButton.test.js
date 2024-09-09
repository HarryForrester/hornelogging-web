import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import RemovePersonButton from '../components/Button/RemovePersonButton';
import { useConfirmationModal } from '../components/ConfirmationModalContext';
import { useNavigate } from 'react-router-dom';
import { useAlertMessage } from '../components/AlertMessage';
import axios from 'axios';
import { useCrews } from '../context/CrewContext';
import { deletePresignedUrl } from '../hooks/useFileDelete';
jest.mock('../components/ConfirmationModalContext');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../components/AlertMessage');
jest.mock('../context/CrewContext');
jest.mock('axios');
jest.mock('../hooks/useFileDelete');

describe('RemovePersonButton', () => {
  const mockSetConfirmationModalState = jest.fn();
  const mockAddToast = jest.fn();
  const mockNavigate = jest.fn();
  const mockPerson = { _id: '1', name: 'John Doe', crew: 'crew1' };
  const mockAccount = 1;

  beforeEach(() => {
    useConfirmationModal.mockReturnValue({
      confirmationModalState: { confirmed: false },
      setConfirmationModalState: mockSetConfirmationModalState,
    });
    useAlertMessage.mockReturnValue({ addToast: mockAddToast });
    useCrews.mockReturnValue({ crews: [{ _id: 'crew1', name: 'Alpha Team' }] });
    useNavigate.mockReturnValue(mockNavigate);
    deletePresignedUrl.mockResolvedValue();
    axios.delete.mockResolvedValue({ status: 200 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the delete button', () => {
    const { getByText } = render(<RemovePersonButton person={mockPerson} _account={mockAccount} />);
    expect(getByText('Delete')).toBeInTheDocument();
  });

    test('opens the confirmation modal when delete is clicked', () => {
        const { getByText } = render(<RemovePersonButton person={mockPerson} _account={mockAccount} />);
        
        fireEvent.click(getByText('Delete'));
    
        // Mock the function that will be passed into setConfirmationModalState
        expect(mockSetConfirmationModalState).toHaveBeenCalledWith(expect.any(Function));
    
        // Execute the passed function to verify the final state
        const stateUpdater = mockSetConfirmationModalState.mock.calls[0][0];
        const prevState = { show: false, confirmed: false, label: '', message: '' };
        const newState = stateUpdater(prevState);
    
        // Verify the message contains the correct dynamic content
        const expectedMessage = (
            <>
            Are you sure you want to remove crew member: <strong>{mockPerson.name}</strong>
            </>
        );

        expect(newState).toEqual(expect.objectContaining({
            show: true,
            label: 'Remove Person',
            message: expectedMessage,
        }));
    });

    test('delete the person when confirmed', async () => {
        useConfirmationModal.mockReturnValueOnce({
            confirmationModalState: { confirmed: true },
            setConfirmationModalState: mockSetConfirmationModalState,
        });
      
          const { getByText } = render(<RemovePersonButton person={mockPerson} _account={mockAccount} />);
      
          fireEvent.click(getByText('Delete'));
      
          await waitFor(() => {
            expect(deletePresignedUrl).toHaveBeenCalledWith([`${mockAccount}/person/${mockPerson._id}/`]);
            // eslint-disable-next-line no-undef
            expect(axios.delete).toHaveBeenCalledWith(`${process.env.REACT_APP_URL}/deleteperson/${mockPerson._id}`, {
              withCredentials: true,
            });
            expect(mockAddToast).toHaveBeenCalledWith(
              'Person Removed!',
              'John Doe has been removed from Alpha Team successfully',
              'success',
              'white'
            );
            expect(mockNavigate).toHaveBeenCalledWith('/');
          });
    });

    test('shows an error toast if deletion fails', async () => {
        // Mock axios.delete to reject the promise
        axios.delete.mockRejectedValueOnce(new Error('Deletion failed'));
      
        // Mock useConfirmationModal to return the state with confirmed: true
        useConfirmationModal.mockReturnValueOnce({
          confirmationModalState: { confirmed: true },
          setConfirmationModalState: mockSetConfirmationModalState,
        });
      
        // Render the component
        const { getByText } = render(<RemovePersonButton person={mockPerson} _account={mockAccount} />);
      
        // Simulate clicking the delete button
        fireEvent.click(getByText('Delete'));
      
        // Wait for async actions to complete
        await waitFor(() => {
          // Check that the error toast was shown
          expect(mockAddToast).toHaveBeenCalledWith(
            'Error!',
            'An error occurred removing John Doe from Alpha Team',
            'danger',
            'white'
          );
      
          // Capture the function that was called with setConfirmationModalState
          const stateUpdater = mockSetConfirmationModalState.mock.calls[0][0];
      
          // Execute the state updater function to check the updated state
          const prevState = { confirmed: true };
          const newState = stateUpdater(prevState);
      
          // Verify that the confirmed field was reset to false
          expect(newState).toEqual(expect.objectContaining({
            confirmed: false,
          }));
        });
      });

      test('resets confirmationModalState after deletion', async () => {
        useConfirmationModal.mockReturnValueOnce({
          confirmationModalState: { confirmed: true },
          setConfirmationModalState: mockSetConfirmationModalState,
        });
      
        const { getByText } = render(<RemovePersonButton person={mockPerson} _account={mockAccount} />);
      
        fireEvent.click(getByText('Delete'));
      
        await waitFor(() => {
          // Capture the function passed to setConfirmationModalState
          const stateUpdater = mockSetConfirmationModalState.mock.calls[0][0];
      
          // Simulate the previous state
          const prevState = { confirmed: true };
      
          // Call the updater function with the previous state to get the new state
          const newState = stateUpdater(prevState);
      
          // Verify that the new state contains confirmed: false
          expect(newState).toEqual(expect.objectContaining({
            confirmed: false,
          }));
        });
      });

  
  
});