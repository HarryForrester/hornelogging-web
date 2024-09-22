import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditSkidButton from '../components/Button/EditSkidButton';

const mockOnClick = jest.fn();

describe('EditSkidButton Component', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear any previous mock data
    });
  
    test('renders the button with correct text', () => {
      render(<EditSkidButton onClick={mockOnClick} />);
      
      const buttonElement = screen.getByRole('button', { name: /edit/i });
      expect(buttonElement).toBeInTheDocument(); // Verify button is in the document
      expect(buttonElement).toHaveTextContent('Edit'); // Verify button text
    });
  
    test('calls onClick function when button is clicked', () => {
      render(<EditSkidButton onClick={mockOnClick} />);
      
      const buttonElement = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(buttonElement); // Simulate click event
      
      expect(mockOnClick).toHaveBeenCalledTimes(1); // Verify onClick is called once
    });
  
  });