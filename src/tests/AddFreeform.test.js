import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AddFreeform from '../components/AddFormElements/AddFreeform';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

describe('AddFreeform Component', () => {
    const mockOnChange = jest.fn();
    const mockOnRemove = jest.fn();

    beforeEach(() => {
        render(
            <AddFreeform
                labelValue=""
                isRequired={false}
                onChange={mockOnChange}
                onRemove={mockOnRemove}
            />
        );
    });

    test('renders remove button', () => {
        const removeButton = screen.getByTestId('remove-freeform');
        expect(removeButton).toBeInTheDocument();
    });

    test('calls onRemove when remove button is clicked', () => {
        const removeButton = screen.getByTestId('remove-freeform');
        fireEvent.click(removeButton);
        expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });

    test('renders label with correct text', () => {
        const label = screen.getByText('Enter Text Label');
        expect(label).toBeInTheDocument();
    });

    test('renders input field', () => {
        const input = screen.getByRole('textbox', {
            name: /enter text label/i
          })
        expect(input).toBeInTheDocument();
    });
    test('calls onChange when input value changes', async () => {
        const input = screen.getByRole('textbox', {
            name: /enter text label/i
        });

        fireEvent.input(input, { target: { value: 'New Value' } });

        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
        });

        expect(input.value).toBe('New Value');
    });

    test('input field has correct initial value', () => {
        const input = screen.getByRole('textbox', {
            name: /enter text label/i
          });
                  expect(input.value).toBe('');
    });

    test('does not render required indicator when isRequired is false', () => {
        const requiredIndicator = screen.queryByText('*');
        expect(requiredIndicator).not.toBeInTheDocument();
    });
});