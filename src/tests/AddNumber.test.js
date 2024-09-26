import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddNumber from '../components/AddFormElements/AddNumber';

describe('AddNumber Component', () => {
    const mockOnChange = jest.fn();
    const mockOnRemove = jest.fn();
    const mockAttributes = {};
    const mockListeners = {};

    const setup = (labelValue = '', isRequired = false) => {
        return render(
            <AddNumber
                labelValue={labelValue}
                onChange={mockOnChange}
                onRemove={mockOnRemove}
                isRequired={isRequired}
                attributes={mockAttributes}
                listeners={mockListeners}
            />
        );
    };

    test('renders without crashing', () => {
        setup();
    });

    test('displays the correct label', () => {
        const { getByText } = setup();
        expect(getByText('Number')).toBeInTheDocument();
    });

    test('calls onChange when input value changes', () => {
        const { getByPlaceholderText } = setup();
        const input = getByPlaceholderText('Number Element');
        fireEvent.change(input, { target: { value: 'New Label' } });
        expect(mockOnChange).toHaveBeenCalled();
    });

    test('displays validation error when label is empty', () => {
        const { getByPlaceholderText, getByText } = setup();
        const input = getByPlaceholderText('Number Element');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);
        expect(getByText('Number title is required')).toBeInTheDocument();
    });

    test('calls onRemove when remove button is clicked', () => {
        const { getByTestId } = setup();
        const removeButton = getByTestId('remove-freeform');
        fireEvent.click(removeButton);
        expect(mockOnRemove).toHaveBeenCalled();
    });

    test('checkbox reflects isRequired prop', () => {
        const { getByRole } = setup('', true);
        const checkbox = getByRole('checkbox')
        expect(checkbox).toBeChecked();
    });

    test('calls onChange when checkbox is toggled', () => {
        const { getByRole } = setup();
        const checkbox = getByRole('checkbox')
        fireEvent.click(checkbox);
        expect(mockOnChange).toHaveBeenCalled();
    });
});