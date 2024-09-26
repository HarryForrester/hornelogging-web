import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCrewList from '../components/AddFormElements/AddCrewList';

describe('AddCrewList Component', () => {
  const mockProps = {
    label: 'Test Label',
    value: 'Test Value',
    onChange: jest.fn(),
    onRemove: jest.fn(),
    isRequired: false,
    attributes: {},
    listeners: {}
  };

  test('renders without crashing', () => {
    render(<AddCrewList {...mockProps} />);
    expect(screen.getByText('Test Value List')).toBeInTheDocument();
  });

  test('displays the correct title based on value', () => {
    render(<AddCrewList {...mockProps} />);
    expect(screen.getByText('Test Value List')).toBeInTheDocument();
  });

  test('displays "All List" when value is "All"', () => {
    render(<AddCrewList {...mockProps} value="All" />);
    expect(screen.getByText('All List')).toBeInTheDocument();
  });

  test('calls onChange when input changes', () => {
    render(<AddCrewList {...mockProps} />);
    fireEvent.change(screen.getByPlaceholderText('E.g. Select a employee from the crew list'), {
      target: { value: 'New Label' }
    });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  test('calls onRemove when remove button is clicked', () => {
    render(<AddCrewList {...mockProps} />);
    fireEvent.click(screen.getByTestId('remove-freeform'));
    expect(mockProps.onRemove).toHaveBeenCalled();
  });

  test('displays invalid feedback when label is empty', () => {
    render(<AddCrewList {...mockProps} label="" />);
    fireEvent.change(screen.getByPlaceholderText('E.g. Select a employee from the crew list'), {
      target: { value: '' }
    });
    expect(screen.getByText('Crew List title is required')).toBeInTheDocument();
  });

  test('checkbox toggles required state', () => {
    render(<AddCrewList {...mockProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockProps.onChange).toHaveBeenCalled();
  });
});
