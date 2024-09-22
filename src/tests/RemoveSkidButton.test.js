import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RemoveSkidButton from '../components/Button/RemoveSkidButton';

// Mock function for the onClick handler
const mockOnClick = jest.fn();

describe('RemoveSkidButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
  });

  test('renders the button with correct text', () => {
    render(<RemoveSkidButton onClick={mockOnClick} />);
    
    const buttonElement = screen.getByRole('button', { name: /remove/i });
    expect(buttonElement).toBeInTheDocument(); // Verify button is in the document
    expect(buttonElement).toHaveTextContent('Remove'); // Verify button text
  });

  test('calls onClick function when button is clicked', () => {
    render(<RemoveSkidButton onClick={mockOnClick} />);
    
    const buttonElement = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(buttonElement); // Simulate click event
    
    expect(mockOnClick).toHaveBeenCalledTimes(1); // Verify onClick is called once
  });
});