import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HazardModal from '../components/Modal/HazardModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import tinycolor from 'tinycolor2';

// Mock the useSkidModal hook
jest.mock('../components/Modal/Skid/SkidModalContext', () => ({
  useSkidModal: jest.fn(),
}));

const mockModalState = { 
    hazardModalVisible: true,
    selectedHazardData: {
        id: '1',
        title: 'Hazard Title',
        sev: 'High',
        cat: 'Category',
        color: '#FF0000',
        harms: JSON.stringify({
        'Harm 1': ['Detail 1', 'Detail 2'],
        'Harm 2': ['Detail A']
        }),
        reviewDate: '2024-01-01',
        reviewReason: 'Reason for review'
    },
    isSelectHazardsGeneral: false,
    isSkidModalEdit: false,
    isSkidModalAdd: false,
    isSkidModalVisible: false,
    isGeneralHazardsModalVisible: false
}

describe('HazardModal', () => {
  const mockSetSkidModalState = jest.fn();
  
  beforeEach(() => {
    mockSetSkidModalState.mockClear(); // Clear previous mock calls


    useSkidModal.mockReturnValue({
      skidModalState: mockModalState,
      setSkidModalState: mockSetSkidModalState
    });
  });

   test('renders the HazardModal with correct details', () => {
    render(<HazardModal />);
    
    expect(screen.getByText(/Hazard Title/)).toBeInTheDocument();
    expect(screen.getByText(/High/)).toBeInTheDocument();
    expect(screen.getByText(/Category/)).toBeInTheDocument();
    expect(screen.getByText(/Detail 1/)).toBeInTheDocument();
    expect(screen.getByText(/Detail 2/)).toBeInTheDocument();
    expect(screen.getByText(/Detail A/)).toBeInTheDocument();
    expect(screen.getByText(/Reviewed: 2024-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/Reason for review/)).toBeInTheDocument();
  }); 

   test('handles handleClose function correctly', async () => {
    render(<HazardModal />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

        await waitFor(() => {
            expect(mockSetSkidModalState).toHaveBeenCalledWith(expect.any(Function));
            const skidStateUpdater = mockSetSkidModalState.mock.calls[0][0];
            const updatedSkidState = skidStateUpdater(mockModalState.hazardModalVisible);

            expect(updatedSkidState).toEqual({
                hazardModalVisible: false
            })
        })

  }); 

   test('applies the correct background color styles', () => {
    render(<HazardModal />);
    
    const modalHeader = screen.getByTestId('hazard-header');
    expect(modalHeader).toHaveStyle('background-color: #FF0000');
    
    const modalBody = screen.getByText('Harm 1').closest('div');
    expect(modalBody).toHaveStyle({'background-color': tinycolor('#FF0000').lighten(30).toString()}); // lightened color
  }); 
});
