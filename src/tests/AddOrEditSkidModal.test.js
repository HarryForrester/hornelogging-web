import React from "react";
import { render, screen, waitFor , within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrEditSkidModal from "../components/Modal/Skid/AddOrEditSkidModal";
import { useSkidModal } from "../components/Modal/Skid/SkidModalContext";
import { useMap } from "../components/Map/MapContext";
import { useAlertMessage } from "../components/AlertMessage";
import { useSkidMarker } from "../components/SkidMarkerContext";
import { useSkid } from "../context/SkidContext";
import { useCrews } from "../context/CrewContext";
import { useLibraryFile } from "../context/LibraryFileContext";
import axios from "axios";
import { getPresignedUrl, uploadToPresignedUrl } from "../hooks/useFileUpload";
import { faListNumeric } from "@fortawesome/free-solid-svg-icons";
jest.mock('axios');
jest.mock('../components/Modal/Skid/SkidModalContext');
jest.mock('../components/Map/MapContext');
jest.mock('../components/AlertMessage');
jest.mock('../components/SkidMarkerContext');
jest.mock('../context/SkidContext');
jest.mock('../hooks/useFileUpload');
jest.mock('../context/CrewContext');
jest.mock('../context/LibraryFileContext');
function setup(jsx) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

const mockSkidState = {
    selectedSkidId: null,
    selectedSkidPos: null,
    formik: null,
    docModalVisible: false,
    cutPlanModalVisible: false,
    selectHazardModalVisible: false,
    skidModalVisible: true 
}

const mockCrewsState = [
    {
        _id: 'crew_id_1',
        _account: 2,
        name: "Crew One"
    },
    {
        _id: 'crew_id_2',
        _account: 2,
        name: "Crew Two"
    }
]

const mockLibraryFileState = {
    types: [
        {
            _id: 'library_type_id_1',
            _account: 2,
            name: 'Library File Type One'
        },
        {
            _id: 'library_type_id_2',
            _account: 2,
            name: 'Library File Type Two'
        }
    ],
    files: [
        {
            _id: 'library_file_id_1',
            _account: 2,
            type: 'library_type_id_1',
            owner: 'person_id_1',
            fileName: 'File One',
            fileUrl: 'example-url-1',
            key: 'example-key-1',
            searchText: 'search-text-1'
        },
        {
            _id: 'library_file_id_2',
            _account: 2,
            type: 'library_type_id_1',
            owner: 'person_id_1',
            fileName: 'File Two',
            fileUrl: 'example-url-2',
            key: 'example-key-2',
            searchText: 'search-text-2'
        }
    ]
}

describe('AddOrEditSkidModal', () => {
    const mockSetSkidModalState = jest.fn();
    const mockSetSkidState = jest.fn();
    const mockSetMapState = jest.fn();
    const mockAddToast = jest.fn();
    const mockSetSkidMarkerState = jest.fn();
    const mockSetCrewState = jest.fn();
    const mockLibraryFilesState = jest.fn();

    beforeEach(() => {
        useSkidModal.mockReturnValue({
            skidModalState: { isSkidModalVisible: true, isSkidModalEdit: false },
            setSkidModalState: mockSetSkidModalState,
        });
        useMap.mockReturnValue({
            mapState: {
                currentMapName: 'Test Map',
                crewTypes: ['Crew 1', 'Crew 2'],
                files: [],
                hazards: [],
            },
            setMapState: mockSetMapState,
        });
        useAlertMessage.mockReturnValue({
            addToast: mockAddToast,
        });
        useSkidMarker.mockReturnValue({
            setSkidMarkerState: mockSetSkidMarkerState,
        });
        useSkid.mockReturnValue({
            skidState: mockSkidState,
            setSkidState: mockSetSkidState,
        });
        
        useCrews.mockReturnValue({
            crews: mockCrewsState,
            setCrews: mockSetCrewState
        });

        useLibraryFile.mockReturnValue({
            libraryFiles: mockLibraryFileState,
            setLibraryFiles: mockLibraryFilesState
        })
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders AddOrEditSkidModal and displays modal title', async () => {
     render(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test_account" />);
    
     const view = screen.getByTestId('addOrEditSkid-modal-header');
        within(view).getByText(/add skid/i);        

    });

     test('renders AddOrEditSkiModal with initial state in Add Mode', () => {
        render(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test_account" />);
        const view = screen.getByTestId('addOrEditSkid-modal-header');
        within(view).getByText(/add skid/i);    
        
        expect(screen.getByText(/add skid name:/i)).toBeInTheDocument();
        expect(screen.getByText(/select crew/i)).toBeInTheDocument();
        expect(screen.getByText(/site documents/i)).toBeInTheDocument();
        expect(screen.getByText(/weekly cut plan/i)).toBeInTheDocument();
        expect(screen.getByText(/site hazards/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', {
            name: /add skid name:/i
          })).toHaveValue('');
        expect(screen.getByRole('checkbox', {
            name: /crew one/i
          })).not.toBeChecked();
        expect(screen.getByRole('checkbox', {
        name: /crew two/i
        })).not.toBeChecked();

        // Check if no list items are rendered
        const listItems = screen.queryAllByRole('listitem');
        expect(listItems).toHaveLength(0);

    });
    
    test('renders form fields and buttons', async () => {
        render(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test_account" />);
      
        // Check for the presence of form fields
        expect(screen.getByLabelText(/add skid name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/select crew/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/site documents/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/weekly cut plan/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/site hazards/i)).toBeInTheDocument();
      
        // Check for buttons
        expect(screen.getByText(/add document/i)).toBeInTheDocument();
        expect(screen.getByText(/add cut plan/i)).toBeInTheDocument();
        expect(screen.getByText(/add hazard/i)).toBeInTheDocument();
        expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    });

    test('shows validation errors when submitting empty form', async () => {
      render(
        <AddOrEditSkidModal
          mousePosition={{ x: 0, y: 0 }}
          editSkid={false}
          _account="test-account"
        />
      );
      screen.debug();
      userEvent.click(screen.getByRole('button', { name: /Save changes/i }));

      await waitFor(() => {
        expect(screen.getByText(/skid name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/At least one crew member is required/i)).toBeInTheDocument();
      });
    });

    test('opens the document modal when "Add Document" is clicked', async () => {
      const { user } = setup(
        <AddOrEditSkidModal
          mousePosition={{ x: 0, y: 0 }}
          editSkid={false}
          _account="test_account"
        />
      );

      // Simulate clicking the "Add Document" button
      await user.click(screen.getByLabelText(/add document/i));

      // Wait for the document modal to appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument(); // Adjust the selector based on your modal's structure
      });

      // Interact with the modal
      await user.click(
        within(screen.getByTestId('file-card-0-0')).getByRole('button', { name: /add/i })
      );
    });
 
    /* test('submits form with valid data - checks axios to be called correctly', async () => {
        const handleSubmit = jest.fn();
        const mockSkidData = {
            _id: 'some-id',
            mapName: 'some-map-name',
            info: {
                crews: ['crew_id_1'],
                cutPlans: { fileName: 'some-file-name', url: 'some-url', key: 'some-key' },
                pointName: 'John',
                selectedDocuments: ['library_file_id_1','library_file_id_1'],
                siteHazards: [],
            },
            point: {
                originalWidth: 100,
                originalHeight: 100,
                pdfHeight: 100,
                pdfWidth: 100,
                x: 0,
                y: 0,
            },
        };
    
        axios.post.mockResolvedValue({ status: 200, data: mockSkidData });
        getPresignedUrl.mockResolvedValue(['some-url', 'some-key']);
        uploadToPresignedUrl.mockResolvedValue(true);
    
        const { user } = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test_account" />);
    
        // Type the skid name
        await user.type(screen.getByRole('textbox', { name: /add skid name:/i }), 'Skid One');
    
        // Interact with the checkbox
        await user.click(screen.getByRole('checkbox', { name: /Crew One/i }));

        await user.click(screen.getByLabelText(/add document/i ));

        await waitFor(async() => {
              // Interact with AddDocModal
        await user.click(within(screen.getByTestId('file-card-0-0')).getByRole('button', {
            name: /add/i
            }));
    
            await user.click(within(screen.getByTestId('file-card-0-1')).getByRole('button', {
            name: /add/i
            }));
    
            await user.click(screen.getByRole('button', { name: /close/i }));
        })

      

        await user.click(screen.getByRole('button', { name: /add cut plan/i }));

        await user.type(screen.getByRole('textbox', { name: /file name:/i }), 'Cut Plan File');

        const fileInput = screen.getByLabelText(/Upload PDF:/i);
        await user.upload(fileInput, new File(['dummy content'], 'cutplan.pdf', { type: 'application/pdf' }));
       
        // Click on save button
        await user.click(screen.getByText(/Save changes/i));

    
        // Interact with the submit button
        await user.click(screen.getByRole('button', { name: /save changes/i }));
    
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:3001/add-pdf-point-object',
                expect.objectContaining({
                    info: expect.objectContaining({
                        pointName: 'Skid One',
                        crews: ['crew_id_1'],
                        cutPlans: { fileName: 'some-file-name', url: 'some-url', key: 'some-key' },

                    }),
                }),
                { withCredentials: true }
            );
        });
    }); */
/*
    test('submits form with valid data - checks states to be called', async () => {
        const { user } = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test_account" />);
    
        // Type the skid name
        await user.type(screen.getByRole('textbox', { name: /add skid name:/i }), 'John');
    
        // Interact with the checkbox
        await user.click(screen.getByRole('checkbox', { name: /Crew 1/i }));
    
        // Interact with the submit button
        await user.click(screen.getByRole('button', { name: /save changes/i }));
    
        await waitFor(() => {
          expect(mockSetSkidState).toHaveBeenCalledWith(expect.any(Function));
          expect(mockSetSkidModalState).toHaveBeenCalledWith(expect.any(Function));
          expect(mockSetAlertMessageState).toHaveBeenCalledWith(expect.any(Function));
        });
    });

     test('opens Add Documents modal', async () => {
        const {user} = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test-account" />);
        await user.click(screen.getByTestId('openCutPlanModal'));
    
        await waitFor(() => {
          expect(mockSetSkidState).toHaveBeenCalledWith(expect.any(Function));

        const skidStateUpdater = mockSetSkidState.mock.calls[0][0];
        const skidStateInitialState = {
            ...mockSkidState,
            skidModalVisible: false,
            docModalVisible: true,
        }
        const skidStateUpdatedState = skidStateUpdater(skidStateInitialState);

        expect(skidStateUpdatedState).toEqual(expect.objectContaining({skidModalVisible: false, docModalVisible: true}))
          
        });
    }); 

    test('opens Add Cut Plan modal', async () => {
        const {user} = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test-account" />);
        await user.click(screen.getByRole('button', { name: /add cut plan/i }));
    
        await waitFor(() => {
          expect(mockSetSkidState).toHaveBeenCalledWith(expect.any(Function));

        const skidStateUpdater = mockSetSkidState.mock.calls[0][0];
        const skidStateInitialState = {
            ...mockSkidState,
            skidModalVisible: false,
            cutPlanModalVisible: true,
        }
        const skidStateUpdatedState = skidStateUpdater(skidStateInitialState);

        expect(skidStateUpdatedState).toEqual(expect.objectContaining({skidModalVisible: false, cutPlanModalVisible: true}))      
        });
    });

    test('opens Add Hazard Modal', async () => {
        const {user} = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test-account" />);
        await user.click(screen.getByTestId('openHazardModal'));
    
        await waitFor(() => {
          expect(mockSetSkidState).toHaveBeenCalledWith(expect.any(Function));

        const skidStateUpdater = mockSetSkidState.mock.calls[0][0];
        const skidStateInitialState = {
            ...mockSkidState,
            skidModalVisible: false,
            selectHazardModalVisible: true,
        }
        const skidStateUpdatedState = skidStateUpdater(skidStateInitialState);

        expect(skidStateUpdatedState).toEqual(expect.objectContaining({skidModalVisible: false, selectHazardModalVisible: true}))      
        });
    });

    test('removes a selected document', async () => {
        const mockSetFieldValue = jest.fn();

        useSkid.mockReturnValue({
          skidState: { 
            formik: { 
                values: { 
                    skidName: '', 
                    selectedCrew: [], 
                    selectedDocuments: ['doc1'], 
                    selectedCutPlan: null, 
                    selectedSkidHazards: [] 
                },
            setFieldValue: mockSetFieldValue }, 
                skidModalVisible: true 
            },
          setSkidState: mockSetSkidState
        });
        useMap.mockReturnValue({
          mapState: { currentMapName: '', 
            crewTypes: ['Crew1', 'Crew2'], 
            files: [{ _id: 'doc1', 
                fileName: 'Document 1', 
                fileUrl: 'http://example.com/doc1' 
            }], hazards: [] },
          setMapState: mockSetMapState
        });
    
        const {user} = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test-account" />);
       
        // Check the initial state
        expect(screen.getByText('Document 1')).toBeInTheDocument();

        // Find and click the "Remove" button within the ListGroupItem
        const removeButton = screen.getByRole('button', { name: /remove/i });
        expect(removeButton).toBeInTheDocument();

        user.click(removeButton);

        waitFor(() => {
            // Check that the setFieldValue function was called to remove the document
            expect(mockSetFieldValue).toHaveBeenCalledWith('selectedDocuments', []);
        })   
       
    });

    test('removes a cut plan', async () => {
        const mockSetFieldValue = jest.fn();

        useSkid.mockReturnValue({
          skidState: { 
            formik: { 
                values: { 
                    skidName: '', 
                    selectedCrew: [], 
                    selectedDocuments: [], 
                    selectedCutPlan: {
                        lastModified: 18197758,
                        name: 'cut plan',
                        size: 311,
                        type: 'application/pdf'
                    }, 
                    selectedSkidHazards: [] 
                },
            setFieldValue: mockSetFieldValue }, 
                skidModalVisible: true 
            },
          setSkidState: mockSetSkidState
        });
        useMap.mockReturnValue({
          mapState: { currentMapName: '', 
            crewTypes: ['Crew1', 'Crew2'], 
            files: [], hazards: [] },
          setMapState: mockSetMapState
        });
    
        const {user} = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test-account" />);
       
        // Check the initial state
        expect(screen.getByText('cut plan')).toBeInTheDocument();

        // Find and click the "Remove" button within the ListGroupItem
        const removeButton = screen.getByRole('button', { name: /remove/i });
        expect(removeButton).toBeInTheDocument();

        user.click(removeButton);

        waitFor(() => {
            // Check that the setFieldValue function was called to remove the document
            expect(mockSetFieldValue).toHaveBeenCalledWith('selectedCutPlan', null);
        })   
       
    });

    test('removes a skid (site) hazard', async () => {
        const mockSetFieldValue = jest.fn();

        useSkid.mockReturnValue({
          skidState: { 
            formik: { 
                values: { 
                    skidName: '', 
                    selectedCrew: [], 
                    selectedDocuments: [], 
                    selectedCutPlan: null, 
                    selectedSkidHazards: ['hazard1'] 
                },
            setFieldValue: mockSetFieldValue }, 
                skidModalVisible: true 
            },
          setSkidState: mockSetSkidState
        });
        useMap.mockReturnValue({
          mapState: { currentMapName: '', 
            crewTypes: ['Crew1', 'Crew2'], 
            files: [], hazards: 
            [
                {
                _id: "hazard1",
                id: "F2",
                title: "Hot works (Welding, grinding)",
                sev: "MEDIUM",
                reviewDate: "",
                reviewReason: "General Review",
                harms: "{\"Fire\":[\"A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions\",\"If a Permit is not required, the following conditions must apply\"],\"Property Damage\":[\"Work area must have a minimum 3m clear to mineral earth around it\",\"Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles\",\"If possible, advise management when Hot Works is about to start, and when finished.\",\"Someone must stay and patrol the area for a minimum 30 minutes after work ceases\",\"Comply with any Forest Owner/Manager requirements\"]}",
                cat: "Fire",
                catIndex: 1,
                _account: 2,
                searchText: "{\"_id\":\"65dbc69fe7fb3b52ed5e586b\",\"id\":\"F2\",\"title\":\"Hot works (Welding, grinding)\",\"sev\":\"MEDIUM\",\"reviewDate\":\"\",\"reviewReason\":\"General Review\",\"harms\":\"{\\\"Fire\\\":[\\\"A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions\\\",\\\"If a Permit is not required, the following conditions must apply\\\"],\\\"Property Damage\\\":[\\\"Work area must have a minimum 3m clear to mineral earth around it\\\",\\\"Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles\\\",\\\"If possible, advise management when Hot Works is about to start, and when finished.\\\",\\\"Someone must stay and patrol the area for a minimum 30 minutes after work ceases\\\",\\\"Comply with any Forest Owner/Manager requirements\\\"]}\",\"cat\":\"Fire\",\"catIndex\":1,\"_account\":2}",
                color: "#ffa600"
              },
            ] 
        },
          setMapState: mockSetMapState
        });
    
        const {user} = setup(<AddOrEditSkidModal mousePosition={{ x: 0, y: 0 }} editSkid={false} _account="test-account" />);
       
        // Check the initial state
        expect(screen.getByText('F2 : Hot works (Welding, grinding)')).toBeInTheDocument();

         // Find and click the "Remove" button within the ListGroupItem
        const removeButton = screen.getByRole('button', { name: /remove/i });
        expect(removeButton).toBeInTheDocument();

        user.click(removeButton);

        waitFor(() => {
            // Check that the setFieldValue function was called to remove the document
            expect(mockSetFieldValue).toHaveBeenCalledWith('selectedSkidHazards', []);
        })   
       
    }); */
      
      
});
