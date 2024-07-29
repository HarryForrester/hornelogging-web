import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';  // Use MemoryRouter for testing routing
import PersonCard from '../components/Card/PersonCard';  // Update the path to your component

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe('PersonCard Component', () => {
  const people = [
    { _id: '1', name: 'John Doe', imgUrl: { url: 'http://example.com/johndoe.jpg' } },
    { _id: '2', name: 'Jane Doe', imgUrl: { url: 'http://example.com/janedoe.jpg' } }
  ];

  test('renders PersonCard with correct data', () => {
    render(
      <MemoryRouter>
        <PersonCard people={people} />
      </MemoryRouter>
    );

    // Check if the images and names are rendered correctly
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  test('handles image URL correctly', () => {
    render(
      <MemoryRouter>
        <PersonCard people={[{ _id: '3', name: 'Default Image', imgUrl: {} }]} />
      </MemoryRouter>
    );

    // Check if the default image URL is used
    const image = screen.getByAltText('Default Image');
    expect(image.src).toContain('/img/default.jpg');
  });

 
  test('navigates to the correct person detail page on click', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <PersonCard people={people} />
      </MemoryRouter>
    );

    // Click on the first person's image
    fireEvent.click(screen.getByAltText('John Doe'));

    // Check if navigate was called with the correct URL
    expect(navigate).toHaveBeenCalledWith('/person/1');
  });
});