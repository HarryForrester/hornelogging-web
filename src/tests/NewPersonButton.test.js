import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewPersonButton from '../components/Button/NewPersonButton';

describe('NewPersonButton', () => {
  const mockHandleClick = jest.fn();  // Mock function

  test('renders correctly', () => {
    render(<NewPersonButton handleClick={mockHandleClick} />);
    
    // Check if the button is in the document
    const button = screen.getByRole('button', { name: /New Person/i });
    expect(button).toBeInTheDocument();
    
    // Check if the button contains the FontAwesome icon (assuming you're using FontAwesome)
    const icon = screen.getByTestId('fontawesome-icon');  // Ensure that you add 'data-testid' to the icon in the component
    expect(icon).toBeInTheDocument();
  });

  test('calls handleClick when the button is clicked', () => {
    render(<NewPersonButton handleClick={mockHandleClick} />);
    
    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /New Person/i }));
    
    // Verify that the handleClick function was called on click
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});