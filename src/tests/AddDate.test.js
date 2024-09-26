import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddDate from '../components/AddFormElements/AddDate';

describe('AddDate Component', () => {
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

    test('renders without crashing', () => {
        render(<AddDate {...defaultProps} />);
        expect(screen.getByText('Date')).toBeInTheDocument();
    });

    test('displays the correct label', () => {
        render(<AddDate {...defaultProps} labelValue="Test Label" />);
        expect(screen.getByDisplayValue('Test Label')).toBeInTheDocument();
    });

    test('calls onChange when input changes', () => {
        render(<AddDate {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText('E.g. Enter your birthdate'), { target: { value: 'New Label' } });
        expect(mockOnChange).toHaveBeenCalled();
    });

    test('displays validation message when label is empty', () => {
        render(<AddDate {...defaultProps} />);
        fireEvent.change(screen.getByPlaceholderText('E.g. Enter your birthdate'), { target: { value: '' } });
        expect(screen.getByText('Date title is required')).toBeInTheDocument();
    });

    test('calls onRemove when remove button is clicked', () => {
        render(<AddDate {...defaultProps} />);
        fireEvent.click(screen.getByTestId('remove-freeform'));
        expect(mockOnRemove).toHaveBeenCalled();
    });

    test('checkbox toggles required state', () => {
        render(<AddDate {...defaultProps} />);
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalled();
    });
});