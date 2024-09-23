import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPersonModal from '../components/Modal/AddOrEditPersonModal';
import { useAlertMessage } from '../components/AlertMessage';
import { getPresignedUrl, uploadToPresignedUrl, getFilePathFromUrl } from '../hooks/useFileUpload';
import { deletePresignedUrl } from '../hooks/useFileDelete';
import axios from 'axios';

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

  describe('AddOrEditPersonModal', () => {
    const mockCrews = [
        { _id: 'crew_id_1', name: 'Crew 1' },
        { _id: 'crew_id_2', name: 'Crew 2' },
      ];
      const mockPerson = {
        _id: 'person_id_1',
        firstName: 'John',
        lastName: 'Doe',
        crew: 'crew_id_1',
        role: 'Foreman',
        phone: '0273456789',
        email: 'john@example.com',
        address: '123 Main St',
        dob: '1990-01-01',
        startDate: '2020-01-01',
        contact: 'Jane Doe',
        contactphone: '0273456789',
        doctor: 'Dr. Smith',
        medical: 'None',
      };

      const inputs = [
        { role: 'textbox', name: /first name/i, value: 'Mr' },
        { role: 'textbox', name: /last name/i, value: 'Programmer' },
        { role: 'textbox', name: /home address/i, value: '30 Code Street' },
        { role: 'combobox', name: /role/i, value: 'Foreman', type: 'select' },
        { role: 'textbox', name: /phone number/i, value: '0271111111' },
        { role: 'textbox', name: /email address/i, value: 'test@t.com' },
        { role: 'textbox', name: /doctor/i, value: 'Dr. Evil' },
        { role: 'textbox', name: /parnter contact name/i, value: 'Mr Parnter' },
        { role: 'textbox', name: /parnter contact number/i, value: '0272222222' },
        { label: /date of birth/i, value: '1999-01-01', type: 'label' },
        { label: /start date/i, value: '2024-01-01', type: 'label' },
      ];
    
      const mockAddToast = jest.fn();
      const mockUpdatePerson = jest.fn();
      const mockHideModal = jest.fn();
    
      beforeEach(() => {
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
            crews={mockCrews}
            edit={true}
            title={"Edit"}
          />
        );
         // Check if modal fields are populated with person data
        expect(screen.getByLabelText('First Name').value).toBe('John');
        expect(screen.getByLabelText('Last Name').value).toBe('Doe');
        expect(screen.getByLabelText('Phone Number').value).toBe('0273456789');
        expect(screen.getByLabelText('Email Address').value).toBe('john@example.com');
        expect(screen.getByLabelText('Home Address').value).toBe('123 Main St');
        expect(screen.getByLabelText('Parnter Contact Name').value).toBe('Jane Doe');
        expect(screen.getByLabelText('Parnter Contact Number').value).toBe('0273456789');
        expect(screen.getByLabelText('Doctor').value).toBe('Dr. Smith');
        expect(screen.getByLabelText('Medical Issues').value).toBe('None');
    });

    test('calls hideModal on close button click', async() => {
        render(
            <EditPersonModal
            _account={1}
            person={mockPerson}
            updatePerson={mockUpdatePerson}
            show={true}
            hideModal={mockHideModal}
            crews={mockCrews}
            edit={false}
            title="Add"
            />
        );

        const closeButton = screen.getByLabelText('Close');
        fireEvent.click(closeButton);
        await waitFor(() => {
          expect(mockHideModal).toHaveBeenCalled();

        })
    });

    test('create new person without profile image', async () => {

      axios.post = jest.fn().mockResolvedValue({
        status: 200,
        data: { person: { _id: '123', firstName: 'Mr', lastName: 'Programmer', crew: 'crew_id_1' } }
      });
      render(
        <EditPersonModal
          _account={1}
          updatePerson={mockUpdatePerson}
          show={true}
          hideModal={mockHideModal}
          crews={mockCrews}
          edit={false}
          title='Add'
        />
      );

      for (const input of inputs) {
        if (input.type === 'select') {
          await userEvent.selectOptions(screen.getByRole(input.role, { name: input.name }), input.value);
        } else if (input.type === 'label') {
          await userEvent.type(screen.getByLabelText(input.label), input.value);
        } else {
          await userEvent.type(screen.getByRole(input.role, { name: input.name }), input.value);
        }
      }


      fireEvent.click(screen.getByText(/save changes/i));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        //expect(uploadToPresignedUrl).toHaveBeenCalledWith(mockPresignedUrl, file, 'image/png');
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/createperson`,
          expect.objectContaining({
            firstName: 'Mr',
            lastName: 'Programmer',
            role: 'Foreman',
            phone: '0271111111',
            email: 'test@t.com',
            address: '30 Code Street',
            dob: '1999-01-01',
            startDate: '2024-01-01',
            contact: 'Mr Parnter',
            contactphone: '0272222222',
            doctor: 'Dr. Evil',
          }),
          { withCredentials: true }
        ); 
        //expect(mockUpdatePerson).toHaveBeenCalledWith(expect.objectContaining(mockUpdatedPerson));
        expect(mockAddToast).toHaveBeenCalledWith(
          'Person Created!',
          `Success! "Mr Programmer" has been added to "Unassigned"`,
          'success',
          'white'
        ); 
      });

    });
    test('create new person with profile image', async () => {

      const mockPresignedUrl = 'https://s3.example.com/upload-url';
      const mockKey = 'uploads/person_id_1.jpg';
      const mockFilePath = 'https://s3.example.com/uploads/person_id_1.jpg';
    
      getPresignedUrl.mockResolvedValue([mockPresignedUrl, mockKey]);
      getFilePathFromUrl.mockReturnValue(mockFilePath);
      uploadToPresignedUrl.mockResolvedValue();
      deletePresignedUrl.mockResolvedValue();

      const mockUpdatedPerson = { ...mockPerson, imgUrl: { key: mockKey, url: mockFilePath } };
      axios.post = jest.fn()
        .mockResolvedValueOnce({
          status: 200,
          data: { person: mockPerson },
        })
      // Mock the second axios post call for updating the person with the image URL
      .mockResolvedValueOnce({
        status: 200,
        data: { updatedPerson: mockUpdatedPerson }
      });
  
      render(
        <EditPersonModal
          _account={1}
          updatePerson={mockUpdatePerson}
          show={true}
          hideModal={mockHideModal}
          crews={mockCrews}
          edit={false}
          title='Add'
        />
      );

      for (const input of inputs) {
        if (input.type === 'select') {
          await userEvent.selectOptions(screen.getByRole(input.role, { name: input.name }), input.value);
        } else if (input.type === 'label') {
          await userEvent.type(screen.getByLabelText(input.label), input.value);
        } else {
          await userEvent.type(screen.getByRole(input.role, { name: input.name }), input.value);
        }
      }

      const fileInput = screen.getByLabelText(/upload image/i);
      const file = new File(['image content'], 'person.jpg', { type: 'image/png' });
        
      await userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).toStrictEqual(file); // Check the file upload

      fireEvent.click(screen.getByText(/save changes/i));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/createperson`,
          expect.objectContaining({
            firstName: 'Mr',
            lastName: 'Programmer',
            role: 'Foreman',
            phone: '0271111111',
            email: 'test@t.com',
            address: '30 Code Street',
            dob: '1999-01-01',
            startDate: '2024-01-01',
            contact: 'Mr Parnter',
            contactphone: '0272222222',
            doctor: 'Dr. Evil',
          }),
          { withCredentials: true }
        ); 

      });

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
        // check if the imgUrl is passed back from server to mockPerson
        expect(mockPerson).toEqual(expect.objectContaining({imgUrl: { key: mockKey, url: mockFilePath }})); 
        expect(mockAddToast).toHaveBeenCalledWith(
          'Person Created!',
          `Success! "Mr Programmer" has been added to "Unassigned"`,
          'success',
          'white'
        );
      }); 
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
            crews={mockCrews}
            title='Edit'
            edit={true}
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
          expect(mockUpdatePerson).toHaveBeenCalledWith(expect.objectContaining(mockUpdatedPerson));
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
          phone: '0273456789',
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
            crews={mockCrews}
            title={'Edit'}
            edit={true}
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

    test('displays validation errors on submitting empty form fields', async () => {
      render(
        <EditPersonModal
          _account={1}
          person={{}} // Empty person to simulate adding a new person
          updatePerson={jest.fn()}
          show={true}
          hideModal={jest.fn()}
          crews={mockCrews}
          title={"Add"}
          edit={false}
        />
      );
  
      // Simulate clicking the "Save changes" button without filling any fields
      fireEvent.click(screen.getByText(/save changes/i));
  
      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText('First Name is required')).toBeInTheDocument();
        expect(screen.getByText('Last Name is required')).toBeInTheDocument();
        expect(screen.getByText('Phone number is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Address is required')).toBeInTheDocument();
        expect(screen.getByText('Date of Birth is required')).toBeInTheDocument();
        expect(screen.getByText('Start Date is required')).toBeInTheDocument();
        expect(screen.getByText('Contact is required')).toBeInTheDocument();
        expect(screen.getByText('Contact phone number is required')).toBeInTheDocument();
        expect(screen.getByText('Doctor is required')).toBeInTheDocument();
      });
    });

    test('displays error for invalid phone number format', async () => {
      render(
        <EditPersonModal
          _account={1}
          person={{}} // Empty person to simulate adding a new person
          updatePerson={jest.fn()}
          show={true}
          hideModal={jest.fn()}
          crews={mockCrews}
          title="Add"
          edit={false}
        />
      );
  
      // Enter invalid phone number
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: 'invalid-phone' } });
  
      // Simulate form submission
      fireEvent.click(screen.getByText(/save changes/i));
  
      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText('Phone number is not valid')).toBeInTheDocument();
      });
    });

    test('displays error for invalid email address', async () => {
      render(
        <EditPersonModal
          _account={1}
          person={{}} // Empty person to simulate adding a new person
          updatePerson={jest.fn()}
          show={true}
          hideModal={jest.fn()}
          crews={mockCrews}
          title="Add"
          edit={false}
        />
      );
  
      // Enter invalid email
      fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalid-email' } });
  
      // Simulate form submission
      fireEvent.click(screen.getByText(/save changes/i));
  
      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });
    
    test('handles axios failure when creating a new person', async () => {
      axios.post.mockRejectedValue(new Error('Network Error'));
    
      render(
        <EditPersonModal
          _account={1}
          updatePerson={mockUpdatePerson}
          show={true}
          hideModal={mockHideModal}
          crews={mockCrews}
          edit={false}
          title='Add'
        />
      );
    
      // Fill out the form
   

      for (const input of inputs) {
        if (input.type === 'select') {
          await userEvent.selectOptions(screen.getByRole(input.role, { name: input.name }), input.value);
        } else if (input.type === 'label') {
          await userEvent.type(screen.getByLabelText(input.label), input.value);
        } else {
          await userEvent.type(screen.getByRole(input.role, { name: input.name }), input.value);
        }
      }
    
      fireEvent.click(screen.getByText(/save changes/i));
    
      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          'Error!',
          'Failed to create/update person due to a network error. Please try again.',
          'danger',
          'white'
        );
      });
    });

    test('removes uploaded image on delete click', async () => {
      const mockPresignedUrl = 'https://s3.example.com/upload-url';
      const mockKey = 'uploads/existing.jpg';
      const mockFilePath = 'https://s3.example.com/uploads/existing.jpg';
      const mockExistingPerson = { ...mockPerson, imgUrl: { key: mockKey, url: mockFilePath } };

      const mockUpdatedPerson = { ...mockPerson, imgUrl: { key: 'uploads/newpersonimage.jpg', url: 'https://s3.example.com/uploads/newpersonimage.jpg' } };

      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { updatedPerson: mockUpdatedPerson }
      });

      getPresignedUrl.mockResolvedValue([mockPresignedUrl, mockKey]);
      getFilePathFromUrl.mockReturnValue(mockFilePath);
      uploadToPresignedUrl.mockResolvedValue();
      deletePresignedUrl.mockResolvedValue({});

      render(
        <EditPersonModal
          _account={1}
          person={mockExistingPerson}
          updatePerson={mockUpdatePerson}
          show={true}
          hideModal={mockHideModal}
          crews={mockCrews}
          title='Edit'
          edit={true}
        />
      );
    
      // Upload an image
      const fileInput = screen.getByLabelText(/upload image/i);
      const file = new File(['image content'], 'newpersonimage.jpg', { type: 'image/png' });
      
      await userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).toStrictEqual(file);
     //submit new image and will remove existing image
      fireEvent.click(screen.getByText(/save changes/i));
    
      await waitFor(() => {
        expect(deletePresignedUrl).toHaveBeenCalledWith([mockKey]); // Ensure the presigned URL is deleted
        expect(fileInput.files.length).toBe(0);

      });
    });

    test('cancels image upload without saving image', async () => {
      const mockPresignedUrl = 'https://s3.example.com/upload-url';
      const mockKey = 'uploads/person1.jpg';
      
      getPresignedUrl.mockResolvedValue([mockPresignedUrl, mockKey]);
    
      render(
        <EditPersonModal
          _account={1}
          updatePerson={mockUpdatePerson}
          show={true}
          hideModal={mockHideModal}
          crews={mockCrews}
          title='Add'
          edit={false}
        />
      );
    
      const fileInput = screen.getByLabelText(/upload image/i);
      const file = new File(['image content'], 'person.jpg', { type: 'image/png' });
    
      // Upload the image
      await userEvent.upload(fileInput, file);
      expect(fileInput.files[0]).toStrictEqual(file);
    
      // Click Cancel button
      fireEvent.click(screen.getByLabelText('Close'));
    
      // Ensure file upload is not persisted
      await waitFor(() => {
        expect(uploadToPresignedUrl).not.toHaveBeenCalled();
      });
    });
 
  });