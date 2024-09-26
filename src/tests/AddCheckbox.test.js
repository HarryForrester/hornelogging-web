import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCheckbox from '../components/AddFormElements/AddCheckbox';
describe('AddCheckbox Component', () => {
    const mockOnChange = jest.fn();
    const mockOnRemove = jest.fn();
    const mockAttributes = {};
    const mockListeners = {};

    beforeEach(() => {
        render(
            <AddCheckbox
                labelValue="Test Label"
                onChange={mockOnChange}
                onRemove={mockOnRemove}
                attributes={mockAttributes}
                listeners={mockListeners}
            />
        );
    });

    test('renders the AddCheckbox component', () => {
        expect(screen.getByText('Checkbox')).toBeInTheDocument();
        expect(screen.getByText('Enter Check Label')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('E.g. I have read and understood the above')).toBeInTheDocument();
    });

    test('calls onChange when the input value changes', () => {
        const input = screen.getByPlaceholderText('E.g. I have read and understood the above');
        fireEvent.change(input, { target: { value: 'New Label' } });
        expect(mockOnChange).toHaveBeenCalled();
    });

    test('calls onRemove when the remove button is clicked', () => {
        const removeButton = screen.getByTestId('remove-freeform');
        fireEvent.click(removeButton);
        expect(mockOnRemove).toHaveBeenCalled();
    });

    test('displays invalid feedback when labelValue is empty', () => {
        render(
            <AddCheckbox
                labelValue=""
                onChange={mockOnChange}
                onRemove={mockOnRemove}
                attributes={mockAttributes}
                listeners={mockListeners}
                isInvalid={true} // Ensure the component knows the input is invalid
            />
        );
        const input = screen.getAllByPlaceholderText('E.g. I have read and understood the above')[0];
        fireEvent.blur(input);
        expect(screen.getAllByText('Checkbox title is required')[0]).toBeInTheDocument();
    });

    test('renders move button with correct attributes and listeners', () => {
        const moveButton = screen.getByTestId('move-button');
        expect(moveButton).toHaveStyle('cursor: move');
        expect(moveButton).toHaveStyle('position: absolute');
        expect(moveButton).toHaveStyle('top: 0');
        expect(moveButton).toHaveStyle('left: 0');
    });
});