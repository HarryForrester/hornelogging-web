import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddSelectList from '../components/AddFormElements/AddSelectList';

describe('AddSelectList Component', () => {
  const mockProps = {
    itemKey: 'testKey',
    items: ['Item 1', 'Item 2'],
    label: 'Test Label',
    onRemove: jest.fn(),
    onRemoveItem: jest.fn(),
    onChange: jest.fn(),
    addItem: jest.fn(),
    onItemLabelChange: jest.fn(),
    isRequired: false,
    attributes: {},
    listeners: {}
  };

  test('renders without crashing', () => {
    const { getByText } = render(<AddSelectList {...mockProps} />);
    expect(getByText('Select List')).toBeInTheDocument();
  });

  test('displays the correct label', () => {
    const { getByPlaceholderText } = render(<AddSelectList {...mockProps} />);
    expect(getByPlaceholderText('E.g. Select your favorite color')).toHaveValue('Test Label');
  });

  test('calls onChange when label is changed', () => {
    const { getByPlaceholderText } = render(<AddSelectList {...mockProps} />);
    const input = getByPlaceholderText('E.g. Select your favorite color');
    fireEvent.change(input, { target: { value: 'New Label' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  test('displays the correct number of items', () => {
    const { getAllByPlaceholderText } = render(<AddSelectList {...mockProps} />);
    expect(getAllByPlaceholderText('E.g. Item 1').length).toBe(2);
  });

  test('calls onItemLabelChange when an item label is changed', () => {
    const { getAllByPlaceholderText } = render(<AddSelectList {...mockProps} />);
    const inputs = getAllByPlaceholderText('E.g. Item 1');
    fireEvent.change(inputs[0], { target: { value: 'New Item 1' } });
    expect(mockProps.onItemLabelChange).toHaveBeenCalledWith('testKey', 0, expect.any(Object));
  });

  test('calls onRemoveItem when remove button is clicked', () => {
    const { getAllByTestId } = render(<AddSelectList {...mockProps} />);
    const buttons = getAllByTestId('remove-selectlist-item');
    fireEvent.click(buttons[0]);
    expect(mockProps.onRemoveItem).toHaveBeenCalledWith('testKey', 0);
  });

  test('calls addItem when add button is clicked', () => {
    const { getByTestId } = render(<AddSelectList {...mockProps} />);
    const button = getByTestId('add-selectlist-item');
    fireEvent.click(button);
    expect(mockProps.addItem).toHaveBeenCalled();
  });

  test('calls onRemove when remove component button is clicked', () => {
    const { getByTestId } = render(<AddSelectList {...mockProps} />);
    const button = getByTestId('remove-freeform');
    fireEvent.click(button);
    expect(mockProps.onRemove).toHaveBeenCalled();
  });

  it('displays the required checkbox correctly', () => {
    const { getByRole } = render(<AddSelectList {...mockProps} />);
    const checkbox = getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls onChange when required checkbox is changed', () => {
    const { getByRole } = render(<AddSelectList {...mockProps} />);
    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockProps.onChange).toHaveBeenCalled();
  });
});
