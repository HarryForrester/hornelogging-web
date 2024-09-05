import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoCard from '../components/Card/InfoCard';

describe('InfoCard', () => {
  const mockData = [
    { label: 'Crew', value: 'Crew One' },
    { label: 'Role', value: 'Foreman' },
    { label: 'Contact', value: 'John Doe (123-456-7890)' }
  ];

  const mockImageSrc = '/img/person.jpg';

  test('renders the card with the correct data', () => {
    render(<InfoCard data={mockData} imageSrc={mockImageSrc} />);

    // Check if the labels and values are rendered correctly
    mockData.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    // Check if the card header is present
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  test('renders the image with the correct src', () => {
    render(<InfoCard data={mockData} imageSrc={mockImageSrc} />);

    // Check if the image is rendered with the correct src
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', mockImageSrc);

    // Check if the image has correct styles
    expect(imgElement).toHaveStyle({
      width: '150px',
      border: '1px solid #000',
      borderRadius: '10%'
    });
  });

  test('renders the correct number of rows in the table', () => {
    render(<InfoCard data={mockData} imageSrc={mockImageSrc} />);

    // Check if the correct number of rows are rendered in the table
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(mockData.length);
  });
});