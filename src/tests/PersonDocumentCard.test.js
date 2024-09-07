import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PersonDocumentCard from '../components/Card/PersonDocumentCard';
import { useAlertMessage } from '../components/AlertMessage';
import { usePersonFile } from '../context/PersonFileContext';
import { deletePresignedUrl } from '../hooks/useFileDelete';
jest.mock('axios');
jest.mock('../hooks/useFileDelete', () => ({
    deletePresignedUrl: jest.fn(),
  }));
jest.mock('../components/AlertMessage');
jest.mock('../context/PersonFileContext');

describe('PersonDocumentCard', () => {
  const mockAddToast = jest.fn();
  const mockDeletePresignedUrl = jest.fn();
  const mockSetCurrentUserFiles = jest.fn();

  const personFilesMock = {
    personFileTypes: [{ _id: '1', name: 'Document Type 1' }]
  };

  const mockCurrentUser = {
    _id: '123',
    name: 'John Doe'
  };

  const mockCurrentUserFiles = [
    { _id: 'file_id_1', fileName: 'file1.pdf', type: '1', fileUrl: 'url1', key: 'file1-key' },
    { _id: 'file_id_2', fileName: 'file2.pdf', type: '1', fileUrl: 'url2', key: 'file2-key' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAlertMessage.mockReturnValue({ addToast: mockAddToast });
    usePersonFile.mockReturnValue({ personFiles: personFilesMock });
  });

  test('renders the card with correct headers and buttons', () => {
    render(
      <PersonDocumentCard
        _account={123}
        currentUser={mockCurrentUser}
        currentUserFiles={mockCurrentUserFiles}
        setCurrentUserFiles={mockSetCurrentUserFiles}
      />
    );

    // Check the card header
    expect(screen.getByText('Employee Files')).toBeInTheDocument();

    // Check the upload button
    expect(screen.getByRole('button', { name: /Upload File/i })).toBeInTheDocument();

    // Check if the file type header and files are displayed
    expect(screen.getByText('Document Type 1')).toBeInTheDocument();
    expect(screen.getByText('file1.pdf')).toBeInTheDocument();
    expect(screen.getByText('file2.pdf')).toBeInTheDocument();
  });

  test('handles file upload modal visibility', () => {
    render(
      <PersonDocumentCard
        _account={123}
        currentUser={mockCurrentUser}
        currentUserFiles={mockCurrentUserFiles}
        setCurrentUserFiles={mockSetCurrentUserFiles}
      />
    );

    // Click the upload button
    const uploadButton = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(uploadButton);

    // Check if the upload modal is visible (assuming the modal has a unique identifier)
    expect(screen.getByText('Upload Employee File')).toBeInTheDocument();
    expect(screen.getByText(/choose file:/i)).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  test('calls handleFileDelete and removes the file', async () => {
    // Mock axios and window.confirm
    axios.get.mockResolvedValue({ status: 200 });
    deletePresignedUrl.mockResolvedValue(); // Ensure deletePresignedUrl resolves
  
    // Mock window.confirm to return true
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  
    render(
      <PersonDocumentCard
        _account={1}
        currentUser={mockCurrentUser}
        currentUserFiles={mockCurrentUserFiles}
        setCurrentUserFiles={mockSetCurrentUserFiles}
      />
    );
  
    // Click the delete button for the first file
    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
    fireEvent.click(deleteButton);
  
    // Check if window.confirm is called with the correct message
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove file: file1.pdf');
    
    // Check if axios request is made
    // eslint-disable-next-line no-undef
    expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_URL}/person/deletefile/file_id_1`, { withCredentials: true });
  
    // Ensure the file was deleted via deletePresignedUrl
    await waitFor(() => {
        expect(deletePresignedUrl).toHaveBeenCalledWith(['file1-key']); // Ensure correct key is passed
      });  
    // Check if the toast message is shown
    expect(mockAddToast).toHaveBeenCalledWith(
      'Person Document Removed!',
      'Success! file1.pdf has been removed from John Doe documents',
      'success',
      'white'
    );
  
    // Check if setCurrentUserFiles is called with the updated file list
    expect(mockSetCurrentUserFiles).toHaveBeenCalled();
  
    // Restore the original window.confirm implementation
    window.confirm.mockRestore();
  });
 
  test('displays error toast when file delete fails with 500', async () => {
    // Mock axios to reject with a 500 error
    axios.get.mockRejectedValue({
      response: { status: 500, data: { message: 'Server error' } }
    });
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <PersonDocumentCard
        _account={123}
        currentUser={mockCurrentUser}
        currentUserFiles={mockCurrentUserFiles}
        setCurrentUserFiles={mockSetCurrentUserFiles}
      />
    );
  
    // Click the delete button for the first file
    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
    fireEvent.click(deleteButton);
  
    // Ensure error toast is displayed for 500 error
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        'Error!',
        'An Error has occurred while deleting file, please try again',
        'danger',
        'white'
      );
    });
  });
});