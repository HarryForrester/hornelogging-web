import React from 'react';
import { render, screen } from '@testing-library/react';
import PersonInfoCard from '../components/Card/PersonInfoCard';

describe('PersonInfoCard', () => {
  const mockPerson = {
    crew: 'crew1',
    role: 'Foreman',
    dob: '1990-01-01',
    firstName: 'John',
    lastName: 'Doe',
    phone: '123-456-7890',
    contact: 'Jane Doe',
    contactphone: '987-654-3210',
    startDate: '2022-01-01',
    doctor: 'Dr. Smith',
    medical: 'None',
    imgUrl: { url: '/img/person.jpg' }
  };

  const mockCrews = [
    { _id: 'crew1', name: 'Crew One' },
    { _id: 'crew2', name: 'Crew Two' }
  ];

  test('renders with person and crew data', () => {
    render(<PersonInfoCard person={mockPerson} crews={mockCrews} />);

    // Check if the crew name is rendered correctly
    expect(screen.getByText(/Crew One/i)).toBeInTheDocument();

    // Check if the role is rendered correctly
    expect(screen.getByText(/Foreman/i)).toBeInTheDocument();

    // Check if the contact information is rendered correctly
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/987-654-3210/i)).toBeInTheDocument();

    // Check if the image source is set to the person's image
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', '/img/person.jpg');
  });

  test('falls back to default image if person has no image', () => {
    const personWithoutImage = { ...mockPerson, imgUrl: null };
    render(<PersonInfoCard person={personWithoutImage} crews={mockCrews} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', '/img/default.jpg');
  });
});