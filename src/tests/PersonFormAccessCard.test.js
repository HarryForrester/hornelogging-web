import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAlertMessage } from '../components/AlertMessage';
import PersonFormAccessCard from '../components/Card/PersonFormAccessCard';
import axios from 'axios';
jest.mock('../components/AlertMessage');
jest.mock('axios');

const mockCurrentUser = { _id: 'user_id_1', name: 'John Doe' };
const mockTimeSheetAccess = [{ _id: 'form_id_1', title: 'Time Sheet', availableOnDevice: '{}' }];
const mockForms = [{ _id: 'form_id_2', title: 'Form 2', availableOnDeviceSerialized: '{}' }];

describe('PersonFormAccessCard', () => { 
    const mockAddToast = jest.fn();
    const mockUpdateForms = jest.fn();



    beforeEach(() => {
        jest.clearAllMocks();
        useAlertMessage.mockReturnValue({ addToast: mockAddToast });
    

    });

    test('renders PersonFormAccessCard component', () => {
        render(
          <PersonFormAccessCard
            currentUser={mockCurrentUser}
            timeSheetAccess={mockTimeSheetAccess}
            forms={mockForms}
            updateForms={mockUpdateForms}
          />
        );
      
        // Check if the Card header and toggle elements are rendered
        expect(screen.getByText('Enable Device Forms')).toBeInTheDocument();
        expect(screen.getByLabelText('Enable Form - Time Sheet')).toBeInTheDocument();
        expect(screen.getByLabelText('Enable Form - Form 2')).toBeInTheDocument();
    });

    test('calls toggleTimeSheet and shows success toast', async () => {
        axios.post.mockResolvedValue({ status: 200 });

        render(
            <PersonFormAccessCard
            currentUser={mockCurrentUser}
            timeSheetAccess={mockTimeSheetAccess}
            forms={mockForms}
            updateForms={mockUpdateForms}
            />
        );

        // Click the toggle button
        const toggleButton = screen.getByLabelText('Enable Form - Time Sheet');
        fireEvent.click(toggleButton);

        // Check if the API call was made
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:3001/toggleTimeSheet',
            { person: 'user_id_1', checked: true },
            { withCredentials: true }
        );

        // Check if success toast is shown
        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
            'Time Sheet Enabled',
            'Success! Time Sheet has been Enabled for John Doe',
            'success',
            'white'
            );
        });
    });

    test('calls toggleForm and shows success toast', async () => {
        render(
            <PersonFormAccessCard
              currentUser={mockCurrentUser}
              timeSheetAccess={mockTimeSheetAccess}
              forms={mockForms}
              updateForms={mockUpdateForms}
            />
          );
        
          // Click the toggle button for a form
          const toggleButton = screen.getByLabelText('Enable Form - Form 2');
          fireEvent.click(toggleButton);
        
          // Check if the API call was made
          expect(axios.post).toHaveBeenCalledWith(
            // eslint-disable-next-line no-undef
            `${process.env.REACT_APP_URL}/toggleForm`,
            { id: 'form_id_2', person: 'user_id_1', checked: true },
            { withCredentials: true }
          );
        
          // Check if success toast is shown
          await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
              'Form 2 Enabled',
              'Success! Form 2 has been Enabled for John Doe',
              'success',
              'white'
            );
          });
    });

    test('displays error toast when toggleForm fails', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'));

        render(
            <PersonFormAccessCard
            currentUser={mockCurrentUser}
            timeSheetAccess={mockTimeSheetAccess}
            forms={mockForms}
            updateForms={mockUpdateForms}
            />
        );

        // Click the toggle button for a form
        const toggleButton = screen.getByLabelText('Enable Form - Form 2');
        fireEvent.click(toggleButton);

        // Check if error toast is shown
        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith(
            'Form Error!',
            'Error has occurred while changing form state',
            'danger',
            'white'
            );
        });
    })
})


