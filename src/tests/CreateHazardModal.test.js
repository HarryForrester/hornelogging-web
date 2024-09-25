import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateHazardModal from '../components/Modal/CreateHazardModal';
import { useAlertMessage } from '../components/AlertMessage';
import axios from 'axios';

jest.mock('axios');
jest.mock('../components/AlertMessage');
describe('CreateHazardModal', () => {
  const mockAddToast = jest.fn();
  const mockHandleClose = jest.fn();
  const mockUpdateHazards = jest.fn();

  beforeEach(() => {
    useAlertMessage.mockReturnValue({
      addToast: mockAddToast
    });
  });
  const defaultProps = {
    show: true,
    handleClose: mockHandleClose,
    initialValues: null,
    isEditing: false,
    updateHazards: mockUpdateHazards
  };

  test('renders the modal with correct title', () => {
    render(<CreateHazardModal {...defaultProps} />);
    const titleElement = screen.getByText(/Add Hazard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders input fields', () => {
    render(<CreateHazardModal {...defaultProps} />);
    expect(screen.getByTestId('input-title')).toBeInTheDocument();
    expect(screen.getByTestId('select-sev')).toBeInTheDocument();
    expect(screen.getByTestId('select-category')).toBeInTheDocument();
    expect(screen.getByTestId('input-reviewDate')).toBeInTheDocument();
    expect(screen.getByTestId('input-reviewReason')).toBeInTheDocument();
    expect(screen.getByTestId('input-harmFields.0.category')).toBeInTheDocument();
    expect(screen.getByTestId('input-harmFields.0.description.0')).toBeInTheDocument();
  });

  jest.mock('axios');

  test('submits the form with correct data', async () => {
    axios.post.mockResolvedValue({
      status: 200,
      withCredentials: true,
      data: {
        hazards: [
          {
            _id: 'hazard_id_1',
            id: 'F1',
            title: 'Hazard One',
            sev: 'MEDIUM',
            reviewDate: 'Sep 25, 2024',
            reviewReason: 'General Review!',
            harms: {
              Physical: ['Test Harm Description']
            },
            cat: 'Fire',
            catIndex: 1,
            _account: 2,
            searchText:
              '{"_id":"65dbc69fe7fb3b52ed5e586b","id":"F2","title":"Hot works (Welding, grinding)","sev":"MEDIUM","reviewDate":"Sep 25, 2024","reviewReason":"General Review!","harms":{"Fire":["A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions","If a Permit is not required, the following conditions must apply"],"Property Damage":["Work area must have a minimum 3m clear to mineral earth around it","Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles","If possible, advise management when Hot Works is about to start, and when finished.","Someone must stay and patrol the area for a minimum 30 minutes after work ceases","Comply with any Forest Owner/Manager requirements"]},"cat":"Fire","catIndex":1,"_account":2}',
            color: '#ffa600'
          }
        ]
      }
    });

    render(<CreateHazardModal {...defaultProps} />);
    await act(async () => {
      fireEvent.change(screen.getByTestId('input-title'), { target: { value: 'Test Hazard' } });
      fireEvent.change(screen.getByTestId('select-sev'), { target: { value: 'HIGH' } });
      fireEvent.change(screen.getByTestId('select-category'), { target: { value: 'Health' } });
      fireEvent.change(screen.getByTestId('input-reviewDate'), { target: { value: '2023-12-31' } });
      fireEvent.change(screen.getByTestId('input-reviewReason'), {
        target: { value: 'Annual Review' }
      });
      fireEvent.change(screen.getByTestId('input-harmFields.0.category'), {
        target: { value: 'Physical' }
      });
      fireEvent.change(screen.getByTestId('input-harmFields.0.description.0'), {
        target: { value: 'Test Harm Description' }
      });
    });

    const submitButton = screen.getByRole('button', {
      name: /save changes/i
    });
    fireEvent.click(submitButton);

    await waitFor(async () => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: 'Test Hazard',
          sev: 'HIGH',
          category: 'Health',
          reviewDate: '2023-12-31',
          reviewReason: 'Annual Review',
          harmFields: [
            {
              category: 'Physical',
              description: ['Test Harm Description']
            }
          ]
        }),
        { withCredentials: true }
      );
      expect(mockUpdateHazards).toHaveBeenCalled();
    });
  });

  test('closes the modal when cancel button is clicked', () => {
    render(<CreateHazardModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', {
      name: /close/i
    });

    fireEvent.click(cancelButton);

    expect(defaultProps.handleClose).toHaveBeenCalled();
  });
});
