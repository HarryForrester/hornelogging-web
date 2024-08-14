import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import UploadMapButton from "../components/Button/UploadMapButton";
import { useSkidModal } from "../components/Modal/Skid/SkidModalContext";

jest.mock('../components/Modal/Skid/SkidModalContext', () => ({
    useSkidModal: jest.fn(),
}));

// eslint-disable-next-line react/display-name
jest.mock('../components/Modal/UploadPdfModal', () => () => <div data-testid="upload-pdf-modal" />);

const mockSetSkidModalState = jest.fn();
useSkidModal.mockReturnValue({
    setSkidModalState: mockSetSkidModalState,
});

describe('UploadMapButton', () => {
    let setSkidModalStateMock;

    beforeEach(() => {
      setSkidModalStateMock = jest.fn();
      useSkidModal.mockReturnValue({
        setSkidModalState: setSkidModalStateMock,
      });
    });

    test('renders the Upload Map button', () => {
        render(<UploadMapButton _account={{}} />);
        
        const button = screen.getByRole('button', { name: /upload map/i });
        expect(button).toBeInTheDocument();
    });

    test('shows the upload PDF modal when the button is clicked', () => {
        render(<UploadMapButton _account={{}} />);
        
        const button = screen.getByRole('button', { name: /upload map/i });
        fireEvent.click(button);
        
        expect(setSkidModalStateMock).toHaveBeenCalledWith(expect.any(Function));
        
        const modal = screen.getByTestId('upload-pdf-modal');
        expect(modal).toBeInTheDocument();
    });

    test('calls setSkidModalState with the correct state when the button is clicked', () => {
        render(<UploadMapButton _account={{}} />);
        
        const button = screen.getByRole('button', { name: /upload map/i });
        fireEvent.click(button);
        
        expect(setSkidModalStateMock).toHaveBeenCalledWith(expect.any(Function));
        
        const updateFunction = setSkidModalStateMock.mock.calls[0][0];
        const prevState = { isUploadMapModalVisible: false };
        const newState = updateFunction(prevState);
        
        expect(newState.isUploadMapModalVisible).toBe(true);
      });

})