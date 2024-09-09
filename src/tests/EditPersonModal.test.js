import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPersonModal from '../components/Modal/EditPersonModal';
import { useCrews } from '../context/CrewContext';
import { useAlertMessage } from '../components/AlertMessage';
import { getPresignedUrl, uploadToPresignedUrl, getFilePathFromUrl } from '../hooks/useFileUpload';
import { deletePresignedUrl } from '../hooks/useFileDelete';
import axios from 'axios';

//Mock dependencies
jest.mock('../context/CrewContext', () => ({
    useCrews: jest.fn()
}));

jest.mock('../components/AlertMessage');
jest.mock('../hooks/useFileUpload', () => ({
    getPresignedUrl: jest.fn(),
    uploadToPresignedUrl: jest.fn(),
    getFilePathFromUrl: jest.fn(),
  }));
  jest.mock('../hooks/useFileDelete', () => ({
    deletePresignedUrl: jest.fn(),
  }));
  jest.mock('axios');

  describe('EditPersonModal', () => {
    const mockCrews = [
        { _id: 'crew_id_1', name: 'Crew 1' },
        { _id: 'crew_id_2', name: 'Crew 2' },
      ];
      const mockPerson = {
        _id: 'person_id_1',
        firstName: 'John',
        lastName: 'Doe',
        crew: 'crew1',
        role: 'Manager',
        phone: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        dob: '1990-01-01',
        startDate: '2020-01-01',
        contact: 'Jane Doe',
        contactphone: '0987654321',
        doctor: 'Dr. Smith',
        medical: 'None',
        imgUrl: { url: '/img/person1.jpg', key: 'img/person1.jpg' },
      };
    
      const mockAddToast = jest.fn();
      const mockUpdatePerson = jest.fn();
      const mockHideModal = jest.fn();
    
      beforeEach(() => {
        useCrews.mockReturnValue({ crews: mockCrews });
        useAlertMessage.mockReturnValue({ addToast: mockAddToast });
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('renders the modal with person data', () => {
        render(
          <EditPersonModal
            _account={1}
            person={mockPerson}
            updatePerson={mockUpdatePerson}
            show={true}
            hideModal={mockHideModal}
          />
        );
         // Check if modal fields are populated with person data
        expect(screen.getByLabelText('First Name').value).toBe('John');
        expect(screen.getByLabelText('Last Name').value).toBe('Doe');
        expect(screen.getByLabelText('Phone Number').value).toBe('1234567890');
        expect(screen.getByLabelText('Email Address').value).toBe('john@example.com');
        expect(screen.getByLabelText('Address').value).toBe('123 Main St');
        expect(screen.getByLabelText('Parnter Contact Name').value).toBe('Jane Doe');
        expect(screen.getByLabelText('Parnter Contact Number').value).toBe('0987654321');
        expect(screen.getByLabelText('Doctor').value).toBe('Dr. Smith');
        expect(screen.getByLabelText('Medical Issues').value).toBe('None');
    });

    test('calls hideModal on close button click', () => {
        render(
            <EditPersonModal
            _account={1}
            person={mockPerson}
            updatePerson={mockUpdatePerson}
            show={true}
            hideModal={mockHideModal}
            />
        );

        const closeButton = screen.getByLabelText('Close');
        fireEvent.click(closeButton);

        expect(mockHideModal).toHaveBeenCalled();
    });

    test('uploads image and updates person', async () => {
        const mockPresignedUrl = 'https://s3.example.com/upload-url';
        const mockKey = 'uploads/person1.jpg';
        const mockFilePath = 'https://s3.example.com/uploads/person1.jpg';
        const mockUpdatedPerson = { ...mockPerson, imgUrl: { key: mockKey, url: mockFilePath } };
      
        getPresignedUrl.mockResolvedValue([mockPresignedUrl, mockKey]);
        getFilePathFromUrl.mockReturnValue(mockFilePath);
        uploadToPresignedUrl.mockResolvedValue();
        axios.post.mockResolvedValue({
          status: 200,
          data: { updatedPerson: mockUpdatedPerson },
        });
        deletePresignedUrl.mockResolvedValue();
      
        render(
          <EditPersonModal
            _account={1}
            person={mockPerson}
            updatePerson={mockUpdatePerson}
            show={true}
            hideModal={mockHideModal}
          />
        );
      
        const fileInput = screen.getByLabelText(/upload image/i);
        const file = new File(['image content'], 'person.jpg', { type: 'image/png' });
        
        await userEvent.upload(fileInput, file);
        expect(fileInput.files[0]).toStrictEqual(file); // Check the file upload
      
        fireEvent.click(screen.getByText(/save changes/i));
      
        await waitFor(() => {
          expect(uploadToPresignedUrl).toHaveBeenCalledWith(mockPresignedUrl, file, 'image/png');
          expect(axios.post).toHaveBeenCalledWith(
            // eslint-disable-next-line no-undef
            `${process.env.REACT_APP_URL}/update-person/${mockPerson._id}`,
            expect.objectContaining({
              imgUrl: { key: mockKey, url: mockFilePath },
            }),
            { withCredentials: true }
          );
          expect(mockUpdatePerson).toHaveBeenCalledWith(mockUpdatedPerson);
          expect(mockAddToast).toHaveBeenCalledWith(
            'Person Updated!',
            `Success! ${mockPerson.firstName + " " + mockPerson.lastName} has been updated`,
            'success',
            'white'
          );
        });
      });

      test('updates person info without uploading image', async () => {
        const mockUpdatedPerson = {
          ...mockPerson,
          firstName: 'John',
          lastName: 'Smith',
          phone: '0987654321',
        };
    
        // Mock axios to return a successful response
        axios.post.mockResolvedValue({
          status: 200,
          data: { updatedPerson: mockUpdatedPerson },
        });
    
        render(
          <EditPersonModal
            _account={1}
            person={mockPerson}
            updatePerson={mockUpdatePerson}
            show={true}
            hideModal={mockHideModal}
          />
        );
    
        // Update person name and phone number fields
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '0987654321' } });
    
        // Click the "Save changes" button
        fireEvent.click(screen.getByText(/save changes/i));
    
        // Wait for the async actions to complete
        await waitFor(() => {
          // Ensure that the person update request was sent with the updated info and the existing imgUrl
          expect(axios.post).toHaveBeenCalledWith(
            // eslint-disable-next-line no-undef
            `${process.env.REACT_APP_URL}/update-person/${mockPerson._id}`,
            expect.objectContaining({
              firstName: 'John',
              lastName: 'Smith',
              phone: '0987654321',
            }),
            { withCredentials: true }
          );
    
          // Check that the person update callback was invoked with the updated person data
          expect(mockUpdatePerson).toHaveBeenCalledWith(mockUpdatedPerson);
    
          // Ensure a success toast was shown
          expect(mockAddToast).toHaveBeenCalledWith(
            'Person Updated!',
            `Success! ${mockUpdatedPerson.firstName} ${mockUpdatedPerson.lastName} has been updated`,
            'success',
            'white'
          );
        });
      });

      test('displays error toast on update failure', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        render(
        <EditPersonModal
            _account={1}
            person={mockPerson}
            updatePerson={mockUpdatePerson}
            show={true}
            hideModal={mockHideModal}
        />
        );

        fireEvent.click(screen.getByText(/save changes/i));

        await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
            'Update Person!',
            'Error! An error occurred while updating John Doe. Please try again later',
            'danger',
            'white'
        );
        });
    });
 
  });