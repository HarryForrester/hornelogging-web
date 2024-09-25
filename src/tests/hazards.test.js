import React, { Fragment } from 'react';
import { render, screen, fireEvent, within, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import Hazards from '../pages/hazards';
import { useAlertMessage } from '../components/AlertMessage';
import { useConfirmationModal } from '../components/ConfirmationModalContext';
import { useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('../components/AlertMessage');
jest.mock('../components/ConfirmationModalContext');
jest.mock('react-router-dom');

describe('Hazards', () => {
  const mockAddToast = jest.fn();
  const mockSetConfirmationModalState = jest.fn();
  const mockNavigate = jest.fn();

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAlertMessage.mockReturnValue({
      addToast: mockAddToast
    });

    useConfirmationModal.mockReturnValue({
      confirmationModalState: { confirmed: true },
      setConfirmationModalState: mockSetConfirmationModalState
    });

    axios.get.mockResolvedValue({
      status: 200,
      data: {
        isLoggedIn: true,
        hazards: [
          {
            _id: 'hazard_id_1',
            id: 'F1',
            title: 'Hazard One',
            sev: 'MEDIUM',
            reviewDate: 'Sep 25, 2024',
            reviewReason: 'General Review!',
            harms: {
              Fire: [
                'A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions',
                'If a Permit is not required, the following conditions must apply'
              ],
              PropertyDamage: [
                'Work area must have a minimum 3m clear to mineral earth around it',
                'Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles',
                'If possible, advise management when Hot Works is about to start, and when finished.',
                'Someone must stay and patrol the area for a minimum 30 minutes after work ceases',
                'Comply with any Forest Owner/Manager requirements'
              ]
            },
            cat: 'Fire',
            catIndex: 1,
            _account: 2,
            searchText: 'Hazard One'
          }
        ]
      }
    });
  });

  test('renders the component', async () => {
    await act(async () => {
      render(<Hazards />);
    });

    expect(screen.getByText('Hazard Register')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  test('filters hazards based on search input', async () => {
    await act(async () => {
      render(<Hazards />);
    });

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Hazard One' } });

    expect(screen.getByText('Hazard One')).toBeInTheDocument();
  });

  test('selects all hazards when select all checkbox is clicked', async () => {
    await act(async () => {
      render(<Hazards />);
    });

    const selectAllCheckbox = screen.getByLabelText('Select All');
    fireEvent.click(selectAllCheckbox);

    expect(selectAllCheckbox.checked).toBe(true);
  });

  test('shows confirmation modal when delete button is clicked', async () => {
    axios.delete.mockResolvedValue({
      status: 200,
      data: {
        hazardIds: ['hazard_id_1']
      }
    });

    await act(async () => {
      render(<Hazards />);
    });

    const select = screen.getByTestId('hazard-check-hazard_id_1');
    fireEvent.click(select);

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    // Mock the function that will be passed into setConfirmationModalState
    expect(mockSetConfirmationModalState).toHaveBeenCalledWith(expect.any(Function));

    // Execute the passed function to verify the final state
    const stateUpdater = mockSetConfirmationModalState.mock.calls[0][0];
    const prevState = { show: false, confirmed: false, label: '', message: '' };
    const newState = stateUpdater(prevState);

    await waitFor(() => {
      expect(newState).toMatchObject({
        show: true,
        confirmed: false,
        label: 'Remove Hazard'
      });
    });
  });

  test('shows review modal when update review button is clicked', async () => {
    await act(async () => {
      render(<Hazards />);
    });

    const selectAllCheckbox = screen.getByLabelText('Select All');
    fireEvent.click(selectAllCheckbox);

    const updateReviewButton = screen.getByText(/Update Review/i);
    fireEvent.click(updateReviewButton);

    expect(screen.getByText('Review Comment')).toBeInTheDocument();
  });

  test('shows edit hazard modal when edit hazard button is clicked', async () => {
    await act(async () => {
      render(<Hazards />);
    });

    const select = screen.getByTestId('hazard-check-hazard_id_1');
    fireEvent.click(select);

    const editHazardButton = screen.getByTestId('edit-hazard');
    fireEvent.click(editHazardButton);

    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText(/edit hazard/i)).toBeInTheDocument();
  });

  test('shows add hazard modal when add hazard button is clicked', async () => {
    await act(async () => {
      render(<Hazards />);
    });

    const addHazardButton = screen.getByTestId('add-hazard');
    fireEvent.click(addHazardButton);

    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText(/add hazard/i)).toBeInTheDocument();
  });
});
