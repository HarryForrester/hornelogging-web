import React from "react";
import { render, screen, within, waitFor } from '@testing-library/react';
import axios from "axios";
import UploadPdfModal from "../components/Modal/UploadPdfModal";
import { useSkidModal } from "../components/Modal/Skid/SkidModalContext";
import { useAlertMessage } from "../components/AlertMessage";
import { useMap } from "../components/Map/MapContext";
import { setup } from "../utils/testSetup"
// Mock hooks and axios
jest.mock('axios');
jest.mock('../components/Modal/Skid/SkidModalContext');
jest.mock('../components/AlertMessage');
jest.mock('../components/Map/MapContext');

// Mocks for the hooks
const mockSetSkidModalState = jest.fn();
const mockSetAlertMessageState = jest.fn();
const mockSetMapState = jest.fn();

describe('UploadPdfModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useSkidModal.mockReturnValue({
            skidModalState: { isUploadMapModalVisible: true},
            setSkidModalState: mockSetSkidModalState
        });
        
        useAlertMessage.mockReturnValue({
            alertMessageState: { toasts: [] },
            setAlertMessageState: mockSetAlertMessageState
        });
        
        useMap.mockReturnValue({
            mapState: { currentMapUrl: ''},
            setMapState: mockSetMapState
        });        
    });

    test('renders UploadMapModal when isUploadMapModalVisible is true', () => {
        render(<UploadPdfModal _account={'1'} />);
        expect(screen.getByRole('heading', {
            name: /upload map/i
          })).toBeInTheDocument();
        expect(screen.getByRole('button', {
            name: /close/i
          })).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByText(/upload pdf map/i)).toBeInTheDocument();
        expect(screen.getByRole('presentation')).toBeInTheDocument();
        const dialog = screen.getByRole('dialog');
        within(dialog).getByRole('button', {
        name: /upload/i
        })
    });
    
    test('validates the form inputs', async() => {
        const { user } = setup(<UploadPdfModal _account={'1'}/>);

        const dialog = screen.getByRole('dialog');

        const uploadButton = within(dialog).getByRole('button', {
        name: /upload/i
        });

        user.click(uploadButton);

        await waitFor(() => {
            expect(screen.getByText('Please provide a valid Map Name.')).toBeInTheDocument();
            expect(screen.getByText('Please upload a PDF file.')).toBeInTheDocument();
        });
    });

    test('submits the form successfully', async () => {

        // Mock successful upload
        axios.post.mockResolvedValue({ status: 200, data: { maps: ['map1', 'map2'] } });

        const { user } = setup(<UploadPdfModal _account={'1'}/>);

        const mapNameInput = screen.getByLabelText(/map name:/i);
        await user.type(mapNameInput, 'filenameaaa');
        const fileInput = screen.getByText(/upload pdf map/i)
        await user.upload(fileInput, new File(['dummy content'], 'example.pdf', { type: 'application/pdf' }));
        const dialog = screen.getByRole('dialog');
       
        await user.click( within(dialog).getByRole('button', {
            name: /upload/i
        }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/loadpdf'),
                expect.any(FormData),
                {withCredentials: true}
            )
        })

    });
})