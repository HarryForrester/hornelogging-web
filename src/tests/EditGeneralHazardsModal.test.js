import React from "react";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import EditGeneralHazardModal from "../components/Modal/EditGeneralHazardsModal";
import { useAlertMessage } from "../components/AlertMessage";
import { useMap } from "../components/Map/MapContext";
import axios from "axios";

jest.mock('../components/AlertMessage');
jest.mock('../components/Map/MapContext');
jest.mock('axios');

const mockMapState = {
    generalHazards: ['hazard_id_1', 'hazard_id_2'],
    hazards: [
        { _id: 'hazard_id_1', id: 'H1', title: 'Hazard 1', sev: 'HIGH', cat: 'Category 1', color: '#FF0000', searchText: 'hazard1' },
        { _id: 'hazard_id_2', id: 'H2', title: 'Hazard 2', sev: 'LOW', cat: 'Category 2', color: '#00FF00', searchText: 'hazard2' },
      ],
}

describe('EditGeneralHazardsModal', () => {
    const mockSetMapState = jest.fn();
    const mockAddToast = jest.fn();

    beforeEach(() => {
        useMap.mockReturnValue({
            mapState: mockMapState,
            setMapState: mockSetMapState
        });

        useAlertMessage.mockReturnValue({
            addToast: mockAddToast
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders modal when showModal is true', () => {
        render(<EditGeneralHazardModal showModal={true} setShowModal={jest.fn()}/>);
        expect(screen.getByText('Edit General Hazards')).toBeInTheDocument();
    });

    test('does not render modal when showModal is false', () => {
        render(<EditGeneralHazardModal showModal={false} setShowModal={jest.fn()}/>);
        expect(screen.queryByText('Edit General Hazards')).not.toBeInTheDocument();
    });

    test('opens SelectHazardsModal when Add Hazard button is clicked', () => {
        render(<EditGeneralHazardModal showModal={true} setShowModal={jest.fn()} />);

        const addButton = screen.getByText('Add Hazard');
        fireEvent.click(addButton);
      
        expect(screen.getByText('Select General Hazards')).toBeInTheDocument(); // Ensure the title of SelectHazardsModal is visible
      
    });

    test('removes hazard when Remove button is clicked', () => {
        render(<EditGeneralHazardModal showModal={true} setShowModal={jest.fn()} />);
      
        const removeButton = screen.getByTestId('removehazard-hazard_id_1');
        fireEvent.click(removeButton);
      
        expect(screen.queryByText('H1: Hazard 1')).not.toBeInTheDocument();
    });

    test('submits general hazards and shows success toast', async () => {
        render(<EditGeneralHazardModal showModal={true} setShowModal={jest.fn()} />);
      
        // Simulate adding a hazard
        const saveButton = screen.getByText('Save changes');
      
        axios.post.mockResolvedValueOnce({ status: 200 });
      
        fireEvent.click(saveButton);
      
        await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith(
          'General Hazards Updated!',
          'Success! General hazards have been updated.',
          'success',
          'white'
        ));
      });

      test('shows error toast on submission failure', async () => {
        render(<EditGeneralHazardModal showModal={true} setShowModal={jest.fn()} />);
      
        const saveButton = screen.getByText('Save changes');
      
        axios.post.mockRejectedValueOnce(new Error('Network error'));
      
        fireEvent.click(saveButton);
      
        await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith(
          'Error!',
          'An error has occured while updating general hazards. Please try again later.',
          'danger',
          'white'
        ));
      });

})
