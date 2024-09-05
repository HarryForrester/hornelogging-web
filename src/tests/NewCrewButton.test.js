import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewCrewButton from '../components/Button/NewCrewButton';

describe('NewCrewButton', () => {
  const mockHandleClick = jest.fn();  // Mock function

  test('renders correctly', () => {
    render(<NewCrewButton handleClick={mockHandleClick} />); // Pass the mockHandleClick as a prop

    // Check if the button is in the document
    const button = screen.getByRole('button', { name: /New Crew/i });
    expect(button).toBeInTheDocument();
    
    // Check if the button contains the FontAwesome icon (make sure you add a 'data-testid' in the component)
    const icon = screen.getByTestId('fontawesome-icon');  
    expect(icon).toBeInTheDocument();
  });

  test('handles button click', () => {
    render(<NewCrewButton handleClick={mockHandleClick} />);  // Pass the mockHandleClick

    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /New Crew/i }));

    // Verify that the handleClick function was called once when the button was clicked
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});