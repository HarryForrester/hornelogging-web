import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddImage from '../components/AddFormElements/AddImage';

describe('AddImage Component', () => {
  const mockOnChange = jest.fn();
  const mockOnRemove = jest.fn();
  const defaultProps = {
    labelValue: '',
    onChange: mockOnChange,
    onRemove: mockOnRemove,
    isRequired: false,
    attributes: {},
    listeners: {}
  };

  it('renders without crashing', () => {
    const { getByText } = render(<AddImage {...defaultProps} />);
    expect(getByText('Image')).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    const { getByLabelText } = render(<AddImage {...defaultProps} />);
    expect(getByLabelText('Enter Image Label')).toBeInTheDocument();
  });

  it('calls onChange when the input value changes', () => {
    const { getByPlaceholderText } = render(<AddImage {...defaultProps} />);
    const input = getByPlaceholderText('E.g. Upload a photo of yourself');
    fireEvent.change(input, { target: { value: 'New Label' } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays an error message when the input is invalid', () => {
    const { getByText } = render(<AddImage {...defaultProps} labelValue=" " />);
    expect(getByText('Number title is required')).toBeInTheDocument();
  });

  it('calls onRemove when the remove button is clicked', () => {
    const { getByTestId } = render(<AddImage {...defaultProps} />);
    const removeButton = getByTestId('remove-freeform');
    fireEvent.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('toggles the required checkbox', () => {
    const { getByRole } = render(<AddImage {...defaultProps} />);
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
