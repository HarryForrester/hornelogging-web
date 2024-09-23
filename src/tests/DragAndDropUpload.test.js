import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DragAndDropUpload from '../components/DragAndDropUpload';
import { type } from '@testing-library/user-event/dist/cjs/utility/type.js';

describe('DragAndDropUpload Component', () => {
  const fileTypes = { 'application/pdf': ['.pdf'] };



  test('renders correctly with initial state', () => {
    render(
      <DragAndDropUpload
        selectedFile={null}
        setSelectedFile={jest.fn()}
        removeUploadedFile={jest.fn()}
        fileTypes={fileTypes}
      />
    );

    expect(
      screen.getByText(/Drag and drop file here, or click to select file/i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId('dragAndDropUpload')).toBeInTheDocument();
    expect(screen.queryByText(/(.*KB)/)).not.toBeInTheDocument();
  });

  test('handles file selection and displays file info', async () => {
    const mockSetSelectedFile = jest.fn();
    const { getByTestId } = render(
      <DragAndDropUpload
        selectedFile={
          new File(['dummy content'], 'example.pdf', { type: 'application/pdf', size: 12345 })
        }
        setSelectedFile={mockSetSelectedFile}
        removeUploadedFile={jest.fn()}
        fileTypes={fileTypes}
      />
    );

    // Check that the file name and size are displayed
    expect(await screen.findByText(/example.pdf/i)).toBeInTheDocument();
    expect(await screen.findByText(/\(0.01 KB\)/i)).toBeInTheDocument();
  });

  test('removes uploaded file when button clicked', () => {
    const mockRemoveUploadedFile = jest.fn();
    render(
      <DragAndDropUpload
        selectedFile={new File(['dummy content'], 'example.pdf', { type: 'application/pdf', size: 12345 })}
        setSelectedFile={jest.fn()}
        removeUploadedFile={mockRemoveUploadedFile}
        fileTypes={fileTypes}
      />
    );

    const removeButton = screen.getByTestId('dragAndDropUpload-remove');
    fireEvent.click(removeButton);

    expect(mockRemoveUploadedFile).toHaveBeenCalled();
  });

  test('displays error message when error prop is provided', () => {
    const errorMessage = 'Invalid file type';
    const mockSetSelectedFile = jest.fn();

    render(
      <DragAndDropUpload
        selectedFile={null}
        setSelectedFile={mockSetSelectedFile}
        removeUploadedFile={jest.fn()}
        fileTypes={fileTypes}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
