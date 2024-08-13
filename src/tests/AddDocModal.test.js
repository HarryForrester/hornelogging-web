import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSkid } from '../context/SkidContext';
import AddDocModal from '../components/Modal/AddDocModal';
import { useMap } from '../components/Map/MapContext';

jest.mock('../context/SkidContext');
jest.mock('../components/Map/MapContext');

function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

describe('AddDocModal', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        useSkid.mockReturnValue({
            skidState: { 
                formik: { values: { selectedDocuments: []}},
                docModalVisible: true, 
                skidModalVisible: false
            },
            setSkidState: jest.fn()
        });

        useMap.mockReturnValue({
            mapState: {
              files: [
                { _id: 'id1', _account: 'acc1', fileName: 'filename1', fileUrl: 'fileurl1', key: 'key1', owner: 'owner1', searchText: 'file1', type: 'type1', },
                { _id: 'id2', _account: 'acc1', fileName: 'filename2', fileUrl: 'fileurl2', key: 'key2', owner: 'owner2', searchText: 'file2', type: 'type2', },
                { _id: 'id3', _account: 'acc1', fileName: 'filename3', fileUrl: 'fileurl3', key: 'key3', owner: 'owner2', searchText: 'file3', type: 'type2', },
                { _id: 'id4', _account: 'acc1', fileName: 'unknownfile', fileUrl: 'fileurl3', key: 'key3', owner: 'owner1', searchText: 'file3', type: 'type1', },


            ],
            },
            setMapState: jest.fn(),
        });
    });

    test('renders Accordion headers and bodies correctly', async () => {
        const {user} = setup(<AddDocModal />);

        const category1Header = screen.getByTestId('accordion-header-0');
        const category2Header = screen.getByTestId('accordion-header-1');

        expect(category1Header).toBeInTheDocument();
        expect(category2Header).toBeInTheDocument();    
    
         // Verify that Type 1 body is visible by default
         const category1Collapse = screen.getByTestId('accordion-body-0').parentElement;
         expect(category1Collapse).toHaveClass('collapse');
         expect(category1Collapse).toHaveClass('show');
 
         // Verify that Type 2 body is not visible initially
         const category2Collapse = screen.getByTestId('accordion-body-1').parentElement;
         expect(category2Collapse).toHaveClass('collapse');
         expect(category2Collapse).not.toHaveClass('show');

         // Simulate a click on the second Accordion header
        await user.click(screen.getByRole('button', {
            name: /type2/i
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

    test('renders seach input with inital state', () => {
        setup(<AddDocModal />);

        // Check if the input is in the document
        const searchInput = screen.getByPlaceholderText('Search');
        expect(searchInput).toBeInTheDocument(); 

        // Verify that the initial value is empty
        expect(searchInput.value).toBe('');
    })

    test('updates input value on change', async () => {
        const { user } = setup(<AddDocModal />);

        // Find the input element
        const searchInput = screen.getByPlaceholderText('Search');
        
        // Type into the input
        await user.type(searchInput, 'doc 1');
      
        // Verify the input value has been updated
        expect(searchInput.value).toBe('doc 1');
    })
    test('filters documents based on search query: P1 (Singular)', async () => {
        const { user } = setup(<AddDocModal />);
    
        // Find the input element
        const searchInput = screen.getByPlaceholderText('Search');
    
        // Type into the input
        await user.type(searchInput, 'filename1');
    
        // Wait for the UI to update and check for filtered results
        await waitFor(() => {
            // Ensure `filename1` is visible
            expect(screen.queryByText('filename1')).toBeInTheDocument();
            
            // Ensure `filename2` is visible
            expect(screen.queryByText('filename2')).not.toBeInTheDocument();
            expect(screen.queryByText('filename3')).not.toBeInTheDocument();

        });
    });

    test('filters documents based on search query: P2 (filter mutiple)', async () => {
        const { user } = setup(<AddDocModal />);
    
        // Find the input element
        const searchInput = screen.getByPlaceholderText('Search');
    
        // Type into the input
        await user.type(searchInput, 'filename');
    
        // Wait for the UI to update and check for filtered results
        await waitFor(() => {
            // Ensure `filename1` is visible
            expect(screen.queryByText('unknownfile')).not.toBeInTheDocument();
            expect(screen.queryByText('filename1')).toBeInTheDocument();
            // Ensure `filename2` is visible
            expect(screen.queryByText('filename2')).toBeInTheDocument();
            expect(screen.queryByText('filename3')).toBeInTheDocument();
        });
    });

    test('filters documents based on search query: P3 (Unknown input)', async () => {
        const { user } = setup(<AddDocModal />);
    
        // Find the input element
        const searchInput = screen.getByPlaceholderText('Search');
    
        // Type into the input
        await user.type(searchInput, 'unknown');
    
        // Wait for the UI to update and check for filtered results
        await waitFor(() => {
            // Ensure `filename1` is visible
            expect(screen.queryByText('filename1')).not.toBeInTheDocument();
            
            // Ensure `filename2` is visible
            expect(screen.queryByText('filename2')).not.toBeInTheDocument();
            expect(screen.queryByText('filename3')).not.toBeInTheDocument();

        });
    });

    test('adds a file to selectedFiles in skidState when "Add" button is clicked', async () => {
        const setSkidStateMock = jest.fn();
    
        // Mock setup
        useSkid.mockReturnValue({
        skidState: {
            formik: { values: { selectedDocuments: [] } },
            docModalVisible: true,
        },
        setSkidState: setSkidStateMock,
        });

        const { user } = setup(<AddDocModal />);

        // Find the "Add" button for the first document
        const addButton = screen.getByTestId('addDocument-id1');
    
        // Click the "Add" button
        await user.click(addButton);
    
        // Verify that the setSkidState function was called
        expect(setSkidStateMock).toHaveBeenCalled();
    
        // Get the function passed to setSkidState
        const setStateFunction = setSkidStateMock.mock.calls[0][0];
    
        // Execute the function with the previous state to simulate state update
        const newState = setStateFunction({
        formik: { values: { selectedDocuments: [] } },
        });
    
        // Verify that the hazard was added to selectedSkidHazards in the new state
        expect(newState.formik.values.selectedDocuments).toContain('id1');
        })

        test('closes the AddDocModal', async () => {

            const setSkidStateMock = jest.fn();
            const skidState = {
                docModalVisible: true,
                skidModalVisible: false,
                formik: { values: { selectedDocuments: [] } },
            }; 

            useSkid.mockReturnValue({
                skidState: skidState,
                setSkidState: setSkidStateMock,
            });

            const { user } = setup(<AddDocModal />);

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
                    docModalVisible: false,
                    skidModalVisible: true,
                }));
            });
        })
    
})