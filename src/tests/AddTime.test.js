import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTime from '../components/AddFormElements/AddTime';
describe('AddTime Component', () => {
    const mockOnChange = jest.fn();
    const mockOnRemove = jest.fn();

    const defaultProps = {
        labelValue: '',
        itemValue: '',
        onChange: mockOnChange,
        onRemove: mockOnRemove,
        isRequired: false,
        attributes: {},
        listeners: {}
    };

    test('renders without crashing', () => {
        render(<AddTime {...defaultProps} />);
        expect(screen.getByText('Time')).toBeInTheDocument();
    });

    test('displays error message when labelValue is empty', () => {
        render(<AddTime {...defaultProps} />);
        fireEvent.blur(screen.getByPlaceholderText('E.g. Enter the time you woke up'));
        expect(screen.getByText('Time title is required')).toBeInTheDocument();
    });

    test('calls onChange when input value changes', () => {
        render(<AddTime {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText('E.g. Enter the time you woke up'), {
            target: { value: 'New Label' }
        });
        expect(mockOnChange).toHaveBeenCalled();
    });

    test('calls onRemove when remove button is clicked', () => {
        render(<AddTime {...defaultProps} />);
        fireEvent.click(screen.getByTestId('remove-freeform'));
        expect(mockOnRemove).toHaveBeenCalled();
    });

    test('checkbox changes state when clicked', () => {
        render(<AddTime {...defaultProps} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalled();
    });

    test('renders with required checkbox checked', () => {
        render(<AddTime {...defaultProps} isRequired={true} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('renders with correct initial label value', () => {
        render(<AddTime {...defaultProps} labelValue="Initial Label" />);
        expect(screen.getByPlaceholderText('E.g. Enter the time you woke up').value).toBe('Initial Label');
    });
});