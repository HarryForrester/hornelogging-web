import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectHazardsModal from '../components/Modal/SelectHazardsModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import tinycolor from 'tinycolor2';
import { useMap } from '../components/Map/MapContext';
import { useSkid } from '../context/SkidContext';
jest.mock('../components/Modal/Skid/SkidModalContext');
jest.mock('../components/Map/MapContext');
jest.mock('../context/SkidContext');

function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

describe('SelectHazardsModal Accordion', () => {
    beforeEach(() => {
      useSkidModal.mockReturnValue({
        skidModalState: { isSelectHazardsGeneral: false },
        setSkidModalState: jest.fn(),
      });
  
      useMap.mockReturnValue({
        mapState: {
          hazards: [
            { _id: 'hazard1', id: 'H1', title: 'Hazard 1', sev: 'HIGH', cat: 'Category 1', color: '#FF0000', searchText: 'hazard1' },
            { _id: 'hazard2', id: 'H2', title: 'Hazard 2', sev: 'LOW', cat: 'Category 2', color: '#00FF00', searchText: 'hazard2' },
          ],
          selectedGeneralHazards: [],
        },
        setMapState: jest.fn(),
      });
  
      useSkid.mockReturnValue({
        skidState: {
          formik: { values: { selectedSkidHazards: [] } },
          selectHazardModalVisible: true,
        },
        setSkidState: jest.fn(),
      });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders Accordion headers and bodies correctly', async () => {
        const {user} = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
  
        // Check if Accordion headers are rendered
        const category1Header = screen.getByTestId('accordion-header-0');
        const category2Header = screen.getByTestId('accordion-header-1');

        expect(category1Header).toBeInTheDocument();
        expect(category2Header).toBeInTheDocument();

        // Verify that Category 1 body is visible by default
        const category1Collapse = screen.getByTestId('accordion-body-0').parentElement;
        expect(category1Collapse).toHaveClass('collapse');
        expect(category1Collapse).toHaveClass('show');

        // Verify that Category 2 body is not visible initially
        const category2Collapse = screen.getByTestId('accordion-body-1').parentElement;
        expect(category2Collapse).toHaveClass('collapse');
        expect(category2Collapse).not.toHaveClass('show');

        // Simulate a click on the second Accordion header
        await user.click(screen.getByRole('button', {
            name: /category 2/i
          }));

        // Wait for the UI to update
        await waitFor(() => {
            // Verify Category 2 body becomes visible
            expect(screen.getByTestId('accordion-body-1').parentElement).toHaveClass('show');
            expect(screen.getByTestId('accordion-body-1').parentElement).toHaveClass('collapse');

            // Verify Category 1 body is hidden
            expect(screen.getByTestId('accordion-body-0').parentElement).not.toHaveClass('show');
        });
    
    });

    /* test('renders search input with initial state', () => {
        setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
        
        // Check if the input is in the document
        const searchInput = screen.getByPlaceholderText('Search');
        expect(searchInput).toBeInTheDocument();
      
        // Verify that the initial value is empty
        expect(searchInput.value).toBe('');
    });

    test('updates input value on change', async () => {
        const { user } = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
      
        // Find the input element
        const searchInput = screen.getByPlaceholderText('Search');
        
        // Type into the input
        await user.type(searchInput, 'Hazard 1');
      
        // Verify the input value has been updated
        expect(searchInput.value).toBe('Hazard 1');
    });

    test('filters hazards based on search query', async () => {
        // Mock setup
        const { user } = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
      
        // Simulate user typing into the search input
        await user.type(screen.getByTestId('search-input'), 'hazard1');
      
        // Wait for the UI to update and check for filtered results
        await waitFor(() => {
          // Check if hazards matching the search query are displayed
          const view1 = screen.getByText(/h1:/i);
          within(view1).getByText(/Hazard 1/i);

          // Check if hazards that do not match the search query are not displayed
          const view2 = screen.queryByText(/h2:/i)
            expect(view2).not.toBeInTheDocument() 
        });
    });

    test('adds a hazard when "Add" button is clicked', async () => {
        // Mock setup
        const { user } = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
      
        // Find the "Add" button for the first hazard
        const addButton = screen.getByTestId('addHazard-hazard1');
      
        // Click the "Add" button
        await user.click(addButton);
      
        // Verify that the hazard was added to the selected hazards
        await waitFor(() => {
          const hazard = screen.queryByText(/h1: hazard 1/i);
          expect(hazard).not.toBeInTheDocument(); // Assuming the hazard is removed from the list once added
        });
      });

      test('adds a hazard to selectedSkidHazards in skidState when "Add" button is clicked', async () => {
        const setSkidStateMock = jest.fn();
      
        // Mock setup
        useSkid.mockReturnValue({
          skidState: {
            formik: { values: { selectedSkidHazards: [] } },
            selectHazardModalVisible: true,
          },
          setSkidState: setSkidStateMock,
        });
      
        const { user } = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
      
        // Find the "Add" button for the first hazard
        const addButton = screen.getByTestId('addHazard-hazard1');
      
        // Click the "Add" button
        await user.click(addButton);
      
        // Verify that the setSkidState function was called
        expect(setSkidStateMock).toHaveBeenCalled();
      
        // Get the function passed to setSkidState
        const setStateFunction = setSkidStateMock.mock.calls[0][0];
      
        // Execute the function with the previous state to simulate state update
        const newState = setStateFunction({
          formik: { values: { selectedSkidHazards: [] } },
        });
      
        // Verify that the hazard was added to selectedSkidHazards in the new state
        expect(newState.formik.values.selectedSkidHazards).toContain('hazard1');
      });

      test('closes the selectHazardsModal for a skid (site)', async () => {
        const setSkidStateMock = jest.fn();
        const skidState = {
            selectHazardModalVisible: true,
            skidModalVisible: false,
            formik: { values: {} },
        };
    
        // Mock setup with isSelectHazardsGeneral set to false
        useSkidModal.mockReturnValue({
            skidModalState: { isSelectHazardsGeneral: false },
            setSkidModalState: jest.fn(),
        });
    
        useSkid.mockReturnValue({
            skidState: skidState,
            setSkidState: setSkidStateMock,
        });
    
        const { user } = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
    
        // Simulate clicking the close button on the modal
        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);
    
        // Wait for the state change
        await waitFor(() => {
            // Verify that setSkidState was called with a function
            expect(setSkidStateMock).toHaveBeenCalledWith(expect.any(Function));
    
            // Extract the function that was called
            const stateUpdateFn = setSkidStateMock.mock.calls[0][0];
    
            // Invoke the function to simulate the state update
            const newState = stateUpdateFn(skidState);
    
            // Check the new state
            expect(newState).toEqual(expect.objectContaining({
                selectHazardModalVisible: false,
                skidModalVisible: true,
            }));
        });
    });

    test('closes the selectHazardsModal for general hazards', async () => {
        const setSkidStateMock = jest.fn();
        const skidState = {
            selectHazardModalVisible: true,
            generalHazardsModalVisible: false,
            formik: { values: {} },
        };
    
        // Mock setup with isSelectHazardsGeneral set to false
        useSkidModal.mockReturnValue({
            skidModalState: { isSelectHazardsGeneral: true },
            setSkidModalState: jest.fn(),
        });
    
        useSkid.mockReturnValue({
            skidState: skidState,
            setSkidState: setSkidStateMock,
        });
    
        const { user } = setup(<SelectHazardsModal submitSelectedHazards={jest.fn()} />);
    
        // Simulate clicking the close button on the modal
        const closeButton = screen.getByRole('button', { name: /close/i });
        await user.click(closeButton);
    
        // Wait for the state change
        await waitFor(() => {
            // Verify that setSkidState was called with a function
            expect(setSkidStateMock).toHaveBeenCalledWith(expect.any(Function));
    
            // Extract the function that was called
            const stateUpdateFn = setSkidStateMock.mock.calls[0][0];
    
            // Invoke the function to simulate the state update
            const newState = stateUpdateFn(skidState);
    
            // Check the new state
            expect(newState).toEqual(expect.objectContaining({
                selectHazardModalVisible: false,
                generalHazardsModalVisible: true,
            }));
        });
    });

   
     */

      
    
      
      
      

           
      
      
      
  });
