import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddSignature from '../components/AddFormElements/AddSignature';

describe('AddSignature Component', () => {
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
        render(<AddSignature {...defaultProps} />);
        expect(screen.getByText('Signature')).toBeInTheDocument();
    });

    test('displays the correct label', () => {
        render(<AddSignature {...defaultProps} labelValue="Sign here" />);
        expect(screen.getByDisplayValue('Sign here')).toBeInTheDocument();
    });

    test('calls onChange when input value changes', () => {
        render(<AddSignature {...defaultProps} />);
        const input = screen.getByPlaceholderText('E.g. Sign here');
        fireEvent.change(input, { target: { value: 'New Signature' } });
        expect(mockOnChange).toHaveBeenCalled();
    });

    test('displays validation error when input is empty', () => {
        render(<AddSignature {...defaultProps} />);
        const input = screen.getByPlaceholderText('E.g. Sign here');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);
        expect(screen.getByText('Signature title is required')).toBeInTheDocument();
    });

    test('calls onRemove when remove button is clicked', () => {
        render(<AddSignature {...defaultProps} />);
        const removeButton = screen.getByTestId('remove-freeform');
        fireEvent.click(removeButton);
        expect(mockOnRemove).toHaveBeenCalled();
    });

    test('checkbox toggles isRequired state', () => {
        render(<AddSignature {...defaultProps} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalled();
    });
});