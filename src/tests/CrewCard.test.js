/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import CrewCard from '../components/Card/CrewCard';
// Mock PersonCard and RemoveCrewButton components to simplify testing
jest.mock('../components/Button/RemoveCrewButton', () => () => <div>Remove Crew Button</div>);
jest.mock('../components/Card/PersonCard', () => ({ people }) => <div>{people.length} people</div>);

describe('CrewCard', () => {
  const crew = {
    name: 'Crew A',
    people: [{ firstName: 'John', lastName: 'Doe' }]
  };

  test('renders CrewCard with crew details', () => {
    render(<CrewCard crew={crew} />);
    
    // Check if CrewCard renders crew name
    expect(screen.getByText(/Crew A/i)).toBeInTheDocument();
    
    // Check if RemoveCrewButton is rendered
    expect(screen.getByText(/Remove Crew Button/i)).toBeInTheDocument();
    
    // Check if PersonCard is rendered with correct number of people
    expect(screen.getByText(/1 people/i)).toBeInTheDocument();
  });

  test('does not render RemoveCrewButton for "Unassigned" crew', () => {
    const unassignedCrew = {
      name: 'Unassigned',
      people: []
    };
    
    render(<CrewCard crew={unassignedCrew} />);
    
    // Check if RemoveCrewButton is not rendered
    expect(screen.queryByText(/Remove Crew Button/i)).not.toBeInTheDocument();
    
    // Check if PersonCard is rendered with correct number of people
    expect(screen.getByText(/0 people/i)).toBeInTheDocument();
  });
});
