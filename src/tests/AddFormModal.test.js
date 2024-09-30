import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AddFormModal from '../components/Modal/AddFormModal';
import { useAlertMessage } from '../components/AlertMessage';

jest.mock('../components/AlertMessage');

describe('AddFormModal Component', () => {
    const mockAddToast = jest.fn();
    const mockCrews = [];
    const mockOnClose = jest.fn();
    const mockSetForms = jest.fn();
    const mockSetCrews = jest.fn();
    const mockSelectedForm = {
        _id: '1',
        title: 'Test Form',
        sectionsSerialized: JSON.stringify([
            {
                title: 'Section 1',
                items: [
                    { type: 'text', label: 'Item 1', value: 'Value 1' },
                    { type: 'selectlist', label: 'Item 2', items: ['Option 1', 'Option 2'] }
                ]
            }
        ])
    };

    const renderComponent = (isVisible = true, selectedForm) => {
        return render(
            <AddFormModal
                crews={mockCrews}
                isVisible={isVisible}
                onClose={mockOnClose}
                selectedForm={selectedForm}
                setForms={mockSetForms}
                setCrews={mockSetCrews}
            />
        );
    };

    beforeEach(() => {
        useAlertMessage.mockReturnValue({ addToast: mockAddToast });
    });

    test('renders without crashing', () => {
        renderComponent();
        expect(screen.getByText('Form Designer')).toBeInTheDocument();
    });

    test('displays form title from selectedForm', () => {
        renderComponent(true,mockSelectedForm);
        expect(screen.getByDisplayValue('Test Form')).toBeInTheDocument();
    });

    test('calls onClose when Close button is clicked', () => {
        renderComponent();
        fireEvent.click(screen.getByText('Close'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('adds a new section when the "Add Section" button is clicked', () => {
        render(<AddFormModal />);
    
        // Initial section should be present
        expect(screen.getB(/section_/i)).toBeInTheDocument();
    
        // Click the "Add Section" button
        fireEvent.click(screen.getByRole('button', { name: /add section/i }));
    
        // Check if a new section is added
        const sections = screen.getAllByText(/section_/i);
        expect(sections.length).toBe(2); // Should have two sections now
      });

    test('displays validation error when form title is empty', () => {
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText('E.g. Daily Safety Inspection'), { target: { value: '' } });
        fireEvent.submit(screen.getByText('Save changes'));
        expect(screen.getByText('Form Title is required')).toBeInTheDocument();
    });

   /*  test('submits form with valid data', async () => {
        renderComponent();
        fireEvent.change(screen.getByPlaceholderText('E.g. Daily Safety Inspection'), { target: { value: 'New Form Title' } });
        fireEvent.submit(screen.getByText('Save changes'));
        expect(mockSetForms).toHaveBeenCalled();
        expect(mockSetCrews).toHaveBeenCalled();
    }); */
});