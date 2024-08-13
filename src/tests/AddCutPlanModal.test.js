import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useSkid } from '../context/SkidContext';
import AddCutPlanModal from '../components/Modal/AddCutPlanModal';
import React from 'react';

jest.mock('../context/SkidContext');

function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}


describe('AddCutPlanModal', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        useSkid.mockReturnValue({
            skidState: { cutPlanModalVisible: true },
            setSkidState: jest.fn(),
          });


    })
    test('renders AddCutPlanModal when cutPlanModalVisible is true', () => {
        useSkid.mockReturnValue({
          skidState: { cutPlanModalVisible: true, skidModalVisible: false },
          setSkidState: jest.fn(),
        });
      
        render(<AddCutPlanModal submitCutPlan={jest.fn()} />);
      
        expect(screen.getByText(/Add Cut Plan/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Upload PDF:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/File Name:/i)).toBeInTheDocument();
    });

    test('does not render AddCutPlanModal when cutPlanModalVisible is false', () => {
        useSkid.mockReturnValue({
          skidState: { cutPlanModalVisible: false, skidModalVisible: false },
          setSkidState: jest.fn(),
        });
    
        render(<AddCutPlanModal submitCutPlan={jest.fn()} />);
        
        expect(screen.queryByText(/Add Cut Plan/i)).not.toBeInTheDocument();
    });

    test('should call submitCutPlan and reset the form on valid submission', async () => {
        const submitCutPlanMock = jest.fn();
        
        const { container } = render(<AddCutPlanModal submitCutPlan={submitCutPlanMock} />);
        const user = userEvent.setup();
        
        // Set the file
        const fileInput = screen.getByLabelText(/Upload PDF:/i);
        await user.upload(fileInput, new File(['dummy content'], 'example.pdf', { type: 'application/pdf' }));
        
        // Set the file name
        await user.type(screen.getByLabelText(/File Name:/i), 'MyCutPlan');
        
        // Click on save button
        await user.click(screen.getByText(/Save changes/i));
        
        // Expect the submit function to have been called
        expect(submitCutPlanMock).toHaveBeenCalledWith('MyCutPlan', expect.any(File));
    });

    test('close button hides the modal and reopens the skid modal', async() => {
        const setSkidStateMock = jest.fn();

        const skidState = {
            cutPlanModalVisible: true,
            skidModalVisible: false,
            formik: { values: {} },
        };
    
        useSkid.mockReturnValue({
          skidState: skidState,
          setSkidState: setSkidStateMock,
        });
    
        const { user } = setup(<AddCutPlanModal submitCutPlan={jest.fn()} />);
        
        const closeButton = screen.getByRole('button', {
            name: /close/i
          });


        await user.click(closeButton);

        await waitFor(() => {
            expect(setSkidStateMock).toHaveBeenCalledWith(expect.any(Function));

            // Extract the function that was called
            const stateUpdateFn = setSkidStateMock.mock.calls[0][0];

            // Invoke the function to simulate the state update
            const newState = stateUpdateFn(skidState); 

            // Check the new state
            expect(newState).toEqual(expect.objectContaining({
                cutPlanModalVisible: false,
                skidModalVisible: true,
            }));
        })
    });

    test('validation error shows when file name is empty on submit', async () => {
        const { user } = setup(<AddCutPlanModal submitCutPlan={jest.fn()} />);
        const submitButton = screen.getByRole('button', {
        name: /save changes/i
        });

        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/file name is required/i)).toBeInTheDocument();
        })
    });

    test('validation error shows when file is empty on submit', async () => {
        const { user } = setup(<AddCutPlanModal submitCutPlan={jest.fn()} />);

        const fileName = screen.getByRole('textbox', {
            name: /file name:/i
        });

        await user.type(fileName, 'file1.pdf'); 

        const submitButton = screen.getByRole('button', {
            name: /save changes/i
        });

        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/file is required/i)).toBeInTheDocument();
        })
    });

    
})

