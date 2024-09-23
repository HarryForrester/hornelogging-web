import React, { useState as useStateMock } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UploadMapButton from '../components/Button/UploadMapButton';
import { useAlertMessage } from '../components/AlertMessage';
import { useMap } from '../components/Map/MapContext';

// Mock the external hooks
jest.mock('../components/AlertMessage');
jest.mock('../components/Map/MapContext');

// eslint-disable-next-line react/display-name
jest.mock('../components/Modal/UploadPdfModal', () => () => <div data-testid="upload-pdf-modal" />);

// Mock useState
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('UploadMapButton', () => {
  const mockAddToast = jest.fn();
  let setShowModalMock;

  beforeEach(() => {
    setShowModalMock = jest.fn();
    useStateMock.mockImplementation((init) => [init, setShowModalMock]);

    useAlertMessage.mockReturnValue({
      addToast: mockAddToast,
    });

    useMap.mockReturnValue({
      setMapState: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test('renders the Upload Map button', () => {
    render(<UploadMapButton />);

    const button = screen.getByRole('button', { name: /upload map/i });
    expect(button).toBeInTheDocument();
  });

  test('shows the upload PDF modal when the button is clicked', () => {
    render(<UploadMapButton />);

    const button = screen.getByRole('button', { name: /upload map/i });
    fireEvent.click(button);

    // Check if setShowModal was called with `true`
    expect(setShowModalMock).toHaveBeenCalledWith(true);

    // Verify the modal is rendered after the button is clicked
    const modal = screen.getByTestId('upload-pdf-modal');
    expect(modal).toBeInTheDocument();
  });
});