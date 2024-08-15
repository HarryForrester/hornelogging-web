import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import AddSkidButton from '../components/Button/AddSkidButton';
import { useMap } from '../components/Map/MapContext';
import { setup } from '../utils/testSetup';
jest.mock('../components/Map/MapContext');

const mockSetMapState = jest.fn();

describe('AddSkidButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useMap.mockReturnValue({
      mapState: { enableMarker: false },
      setMapState: mockSetMapState
    });
  });

  test('renders button with initial text', () => {
    render(<AddSkidButton />);
    expect(screen.getByRole('button', { name: /add point/i })).toHaveTextContent('Add Point');
  });

  test('toggles button text and state on click', async () => {
    const { user } = setup(<AddSkidButton />);

    const button = screen.getByRole('button', { name: /add point/i });

    // Check initial state
    expect(button).toHaveTextContent('Add Point');

    // Simulate click
    await user.click(button);

    // Ensure setMapState is called with the correct function
    await waitFor(() => {
      expect(mockSetMapState).toHaveBeenCalledWith(expect.any(Function));

      const stateUpdateFn = mockSetMapState.mock.calls[0][0];
      const newState = stateUpdateFn({ enableMarker: false });

      expect(newState).toEqual(expect.objectContaining({ enableMarker: true }));
    });

    // Update mock to reflect new state
    useMap.mockReturnValue({
      mapState: { enableMarker: true },
      setMapState: mockSetMapState
    });

    // Re-render component to reflect updated state
    render(<AddSkidButton />);

    // Verify button text has updated
    expect(screen.getByRole('button', { name: /cancel/i })).toHaveTextContent('Cancel');
  });
});
