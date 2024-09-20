import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HazardModal from '../components/Modal/HazardModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import tinycolor from 'tinycolor2';

// Mock the useSkidModal hook
/* jest.mock('../components/Modal/Skid/SkidModalContext', () => ({
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
 */

const mockSelectedHazard = {
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
}

describe('HazardModal', () => {
  //const mockSetSkidModalState = jest.fn();
  
  beforeEach(() => {
    //mockSetSkidModalState.mockClear(); // Clear previous mock calls


    /* useSkidModal.mockReturnValue({
      skidModalState: mockModalState,
      setSkidModalState: mockSetSkidModalState
    }); */
  });

   test('renders the HazardModal with correct details', () => {
    render(<HazardModal showModal={true} handleClose={jest.fn()} selectedHazard={mockSelectedHazard} />);
    
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
      const mockHandleClose = jest.fn();

      render(<HazardModal showModal={true} handleClose={mockHandleClose} selectedHazard={mockSelectedHazard} />);
      fireEvent.click(screen.getByRole('button', { name: /close/i }));

        await waitFor(() => {
            expect(mockHandleClose).toHaveBeenCalled();
        })

  }); 

   test('applies the correct background color styles', () => {
    render(<HazardModal showModal={true} handleClose={jest.fn()} selectedHazard={mockSelectedHazard} />);
    
    const modalHeader = screen.getByTestId('hazard-header');
    expect(modalHeader).toHaveStyle('background-color: #FF0000');
    
    const modalBody = screen.getByText('Harm 1').closest('div');
    expect(modalBody).toHaveStyle({'background-color': tinycolor('#FF0000').lighten(30).toString()}); // lightened color
  }); 

  test('does not render the modal when showModal is false', () => {
    render(<HazardModal showModal={false} handleClose={jest.fn()} selectedHazard={mockSelectedHazard} />);
    
    // Assert that the modal is not visible when showModal is false
    expect(screen.queryByText(/Hazard Title/)).not.toBeInTheDocument();
  });

  test('correctly parses and displays the harms', () => {
    render(<HazardModal showModal={true} handleClose={jest.fn()} selectedHazard={mockSelectedHazard} />);
    
    // Check for the presence of harms in the document
    expect(screen.getByText(/Harm 1/)).toBeInTheDocument();
    expect(screen.getByText(/Detail 1/)).toBeInTheDocument();
    expect(screen.getByText(/Detail 2/)).toBeInTheDocument();
    expect(screen.getByText(/Harm 2/)).toBeInTheDocument();
    expect(screen.getByText(/Detail A/)).toBeInTheDocument();
  });

  test('renders with no harms if selectedHazard.harms is empty or undefined', () => {
    const hazardWithNoHarms = { ...mockSelectedHazard, harms: undefined };

    render(<HazardModal showModal={true} handleClose={jest.fn()} selectedHazard={hazardWithNoHarms} />);
    
    // Since there are no harms, we expect no harm-related text in the document
    expect(screen.queryByText(/Harm 1/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Detail 1/)).not.toBeInTheDocument();
  });
  
  test('close button is accessible and has aria-label', () => {
    render(<HazardModal showModal={true} handleClose={jest.fn()} selectedHazard={mockSelectedHazard} />);
    
    // The close button should be accessible with the aria-label
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });
});
