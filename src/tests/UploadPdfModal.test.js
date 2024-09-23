import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import axios from 'axios';
import UploadPdfModal from '../components/Modal/UploadPdfModal';
import { useAlertMessage } from '../components/AlertMessage';
import { useMap } from '../components/Map/MapContext';
import { setup } from '../utils/testSetup';
import * as fileUploadHooks from '../hooks/useFileUpload';
// Mock hooks and axios
jest.mock('axios');
jest.mock('../components/AlertMessage');
jest.mock('../components/Map/MapContext');

// Mocks for the hooks
const mockAddToast = jest.fn();
const mockSetMapState = jest.fn();

describe('UploadPdfModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAlertMessage.mockReturnValue({
      addToast: mockAddToast
    });

    useMap.mockReturnValue({
      mapState: { currentMapUrl: '' },
      setMapState: mockSetMapState
    });
  });

  test('renders UploadMapModal when isUploadMapModalVisible is true', () => {
    render(<UploadPdfModal _account={'1'} show={true} setShow={jest.fn()} />);
    expect(
      screen.getByRole('heading', {
        name: /upload map/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /close/i
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/upload pdf map/i)).toBeInTheDocument();
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    within(dialog).getByRole('button', {
      name: /upload/i
    });
  });

  test('closes UploadMapModal when closed', async () => {
    const mockSetShow = jest.fn();

    const { user } = setup(<UploadPdfModal _account={'1'} show={true} setShow={mockSetShow} />);
    const closeButton = screen.getByRole('button', {
      name: /close/i
    });

    user.click(closeButton);

    await waitFor(() => {
      expect(mockSetShow).toHaveBeenCalledWith(false);
    });
  });

  test('validates the form inputs - Map Name', async () => {
    const mockSetShow = jest.fn();
    const { user } = setup(<UploadPdfModal _account={'1'} show={true} setShow={mockSetShow} />);

    const dialog = screen.getByRole('dialog');

    const uploadButton = within(dialog).getByRole('button', {
      name: /upload/i
    });

    user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Please provide a valid Map Name.')).toBeInTheDocument();
    });
  });

  test('validates the form inputs - Map Name (Too Long)', async () => {
    const { user } = setup(<UploadPdfModal _account={'1'} show={true} setShow={jest.fn()} />);

    const mapNameInput = screen.getByLabelText(/map name:/i);
    await user.type(mapNameInput, 'amapnamethatismorethan20characters');
    const dialog = screen.getByRole('dialog');

    const uploadButton = within(dialog).getByRole('button', {
      name: /upload/i
    });

    user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Too Long!')).toBeInTheDocument();
    });
  });

  test('validates the form inputs - Selected File', async () => {
    const { user } = setup(<UploadPdfModal _account={'1'} show={true} setShow={jest.fn()} />);

    const mapNameInput = screen.getByLabelText(/map name:/i);
    await user.type(mapNameInput, 'filenameaaa');
    const dialog = screen.getByRole('dialog');

    const uploadButton = within(dialog).getByRole('button', {
      name: /upload/i
    });

    user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Please upload a PDF file.')).toBeInTheDocument();
    });
  });

  test('submits the form successfully', async () => {
    // Mock successful upload
    axios.post.mockResolvedValue({ status: 200, data: { maps: ['map1', 'map2'] } });

    // Mock the getPresignedUrl function
    jest
      .spyOn(fileUploadHooks, 'getPresignedUrl')
      .mockResolvedValue(['https://example.com/presigned-url', 'mockKey']);

    // Mock the uploadToPresignedUrl function
    jest.spyOn(fileUploadHooks, 'uploadToPresignedUrl').mockResolvedValue();
    const { user } = setup(<UploadPdfModal _account={'1'} show={true} setShow={jest.fn()} />);

    const mapNameInput = screen.getByLabelText(/map name:/i);
    await user.type(mapNameInput, 'filenameaaa');
    const fileInput = screen.getByText(/upload pdf map/i);
    await user.upload(
      fileInput,
      new File(['dummy content'], 'example.pdf', { type: 'application/pdf' })
    );
    const dialog = screen.getByRole('dialog');

    await user.click(
      within(dialog).getByRole('button', {
        name: /upload/i
      })
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/loadpdf'),
        expect.any(FormData),
        { withCredentials: true }
      );

      expect(mockAddToast).toHaveBeenCalledWith(
        'Upload Map',
        'Success! filenameaaa has been uploaded.',
        'success',
        'white'
      );
    });
  });

  test('handles a server error (500) during form submission', async () => {
    // Mock server error
    axios.post.mockRejectedValue({ response: { status: 500 } });

    // Mock the getPresignedUrl function
    jest
      .spyOn(fileUploadHooks, 'getPresignedUrl')
      .mockResolvedValue(['https://example.com/presigned-url', 'mockKey']);

    // Mock the uploadToPresignedUrl function
    jest.spyOn(fileUploadHooks, 'uploadToPresignedUrl').mockResolvedValue();

    const { user } = setup(<UploadPdfModal _account={'1'} show={true} setShow={jest.fn()} />);

    const mapNameInput = screen.getByLabelText(/map name:/i);
    await user.type(mapNameInput, 'filenameaaa');
    const fileInput = screen.getByText(/upload pdf map/i);
    await user.upload(
      fileInput,
      new File(['dummy content'], 'example.pdf', { type: 'application/pdf' })
    );
    const dialog = screen.getByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      // Verify axios post call
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/loadpdf'),
        expect.any(FormData),
        { withCredentials: true }
      );

      // Check the new state for the correct error toast message
      expect(mockAddToast).toHaveBeenCalledWith(
        'Upload Map',
        'Error! An error occurred while uploading filenameaaa. Please try again.',
        'danger',
        'white'
      );
    });
  });
});
