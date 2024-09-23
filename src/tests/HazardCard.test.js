import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HazardCard from '../components/Card/HazardCard';
describe('HazardCard Component', () => {
  const mockHazard = {
    _id: '1',
    color: '#FF0000',
    id: 'HZ01',
    title: 'Test Hazard',
    cat: 'Category 1',
    harms: {
      Harm1: ['Risk 1', 'Risk 2'],
      Harm2: ['Risk 3'],
    },
    reviewDate: '2023-09-22',
    reviewReason: 'Annual Review',
  };

  const handleHazardChangeMock = jest.fn();

  const setup = (selectAll = false) => {
    render(
      <HazardCard
        hazard={mockHazard}
        selectAll={selectAll}
        handleHazardChange={handleHazardChangeMock}
      />
    );
  };

  test('renders the hazard card with correct details', () => {
    setup();
    // Check for Hazard ID and Title
    expect(screen.getByText(/Test Hazard/i)).toBeInTheDocument();

    // Check for Category
    expect(screen.getByText(/Category 1/i)).toBeInTheDocument();

    // Check for harms
    expect(screen.getByText('Harm1')).toBeInTheDocument();
    expect(screen.getByText('Harm2')).toBeInTheDocument();
    expect(screen.getByText('Risk 1')).toBeInTheDocument();
    expect(screen.getByText('Risk 2')).toBeInTheDocument();
    expect(screen.getByText('Risk 3')).toBeInTheDocument();

    // Check for Review Date and Reason
    expect(screen.getByText('Reviewed: 2023-09-22 (Annual Review)')).toBeInTheDocument();
  });

  test('checkbox is checked when selectAll is true', () => {
    setup(true);
    const checkbox = screen.getByRole('checkbox', { name: /HZ01/i });
    expect(checkbox).toBeChecked();
  });

  test('checkbox is unchecked when selectAll is false', () => {
    setup(false);
    const checkbox = screen.getByRole('checkbox', { name: /HZ01/i });
    expect(checkbox).not.toBeChecked();
  });

  test('calls handleHazardChange with the hazard id when checkbox is clicked', () => {
    setup();
    const checkbox = screen.getByRole('checkbox', { name: /HZ01/i });
    fireEvent.click(checkbox);
    expect(handleHazardChangeMock).toHaveBeenCalledTimes(1);
    expect(handleHazardChangeMock).toHaveBeenCalledWith('1');
  });
});