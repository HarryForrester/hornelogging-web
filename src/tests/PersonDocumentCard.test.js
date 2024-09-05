import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import PersonDocumentCard from '../components/Card/PersonDocumentCard';
import { useAlertMessage } from '../components/AlertMessage';
import { usePersonFile } from '../context/PersonFileContext';
jest.mock('axios');
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
    { _id: 'file1', fileName: 'file1.pdf', type: '1', fileUrl: 'url1', key: 'file1-key' },
    { _id: 'file2', fileName: 'file2.pdf', type: '1', fileUrl: 'url2', key: 'file2-key' }
  ];

  beforeEach(() => {
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
    expect(screen.getByText('Upload User Document')).toBeInTheDocument();
  });

  /* test('calls handleFileDelete and removes the file', async () => {
    axios.get.mockResolvedValue({ status: 200 });

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

    // Confirm window.confirm is called and axios request is made
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to remove file: file1.pdf');
    // eslint-disable-next-line no-undef
    expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_URL}/person/deletefile/file1`, { withCredentials: true });

    // Check if file removal toast is added
    expect(mockAddToast).toHaveBeenCalledWith(
      'Person Document Removed!',
      'Success! file1.pdf has been removed from John Doe documents',
      'success',
      'white'
    );

    // Check if setCurrentUserFiles is called with the updated file list
    expect(mockSetCurrentUserFiles).toHaveBeenCalled();
  });
 */
  /* test('displays error toast when file delete fails', async () => {
    axios.get.mockRejectedValue(new Error('Delete error'));

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

    // Check if error toast is shown
    expect(mockAddToast).toHaveBeenCalledWith(
      'Error!',
      'Error removing document',
      'danger',
      'white'
    );
  }); */
});