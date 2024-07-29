import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewCrewButton from '../components/Button/NewCrewButton';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';

// Mock the useSkidModal hook
jest.mock('../components/Modal/Skid/SkidModalContext');

// Mock the setSkidModalState function
const mockSetSkidModalState = jest.fn();
useSkidModal.mockReturnValue({
  setSkidModalState: mockSetSkidModalState
});

describe('NewCrewButton', () => {
  test('renders correctly', () => {
    render(<NewCrewButton />);

    // Check if the button is in the document
    const button = screen.getByRole('button', { name: /New Crew/i });
    expect(button).toBeInTheDocument();
    
    // Check if the button contains the FontAwesome icon
    const icon = screen.getByTestId('fontawesome-icon');
    expect(icon).toBeInTheDocument();
  });

  test('handles button click', () => {
    render(<NewCrewButton />);

    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /New Crew/i }));

    // Ensure setSkidModalState was called with the correct arguments
    expect(mockSetSkidModalState).toHaveBeenCalledWith(expect.any(Function));
    const stateUpdater = mockSetSkidModalState.mock.calls[0][0];
    const updatedState = stateUpdater({});
    
    expect(updatedState.isAddCrewModalVisible).toBe(true);
  });
});
