import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewPersonButton from '../components/Button/NewPersonButton';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';

// Mock the useSkidModal hook
jest.mock('../components/Modal/Skid/SkidModalContext');

// Mock the setSkidModalState function
const mockSetSkidModalState = jest.fn();
useSkidModal.mockReturnValue({
  setSkidModalState: mockSetSkidModalState
});

describe('NewPersonButton', () => {
  test('renders correctly', () => {
    render(<NewPersonButton />);
    
    // Check if the button is in the document
    const button = screen.getByRole('button', { name: /New Person/i });
    expect(button).toBeInTheDocument();
    
    // Check if the button contains the FontAwesome icon
    // FontAwesome icons are rendered as SVG elements
    const icon = screen.getByTestId('fontawesome-icon');
    expect(icon).toBeInTheDocument();
  });

  test('calls setSkidModalState with correct arguments on click', () => {
    render(<NewPersonButton />);
    
    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /New Person/i }));
    
    // Ensure setSkidModalState is called with the correct arguments
    expect(mockSetSkidModalState).toHaveBeenCalledWith(expect.any(Function));
    const stateUpdater = mockSetSkidModalState.mock.calls[0][0];
    const updatedState = stateUpdater({ isAddPersonModalVisible: false });

    // Check that the state is updated correctly
    expect(updatedState).toEqual({
      isAddPersonModalVisible: true
    });
  });
});
