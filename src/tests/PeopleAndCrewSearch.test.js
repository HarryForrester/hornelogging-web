import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleAndCrewSearch from '../components/Input/PeopleAndCrewSearch';

describe('PeopleAndCrewSearch', () => {
  test('renders correctly', () => {
    render(<PeopleAndCrewSearch />);
    
    // Check if the input element is present in the document
    const inputElement = screen.getByPlaceholderText(/Search/i);
    expect(inputElement).toBeInTheDocument();
    
    // Check if the input element has the correct attributes
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('size', '30');
    expect(inputElement).toHaveAttribute('id', 'search-criteria');
  });

  test('input value handling', () => {
    render(<PeopleAndCrewSearch />);
    
    // Get the input element
    const inputElement = screen.getByPlaceholderText(/Search/i);
    
    // Simulate user typing into the input
    fireEvent.change(inputElement, { target: { value: 'Test' } });
    
    // Verify that the input value has changed
    expect(inputElement.value).toBe('Test');
  });
});
