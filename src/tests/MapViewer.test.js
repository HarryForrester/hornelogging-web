import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import PDFViewer from "../components/MapViewer";
import { SkidModalProvider } from "../components/Modal/Skid/SkidModalContext";
import { useMap } from "../components/Map/MapContext";
import { useSkid } from "../context/SkidContext";
import { AlertMessageProvider } from "../components/AlertMessage";
import { SkidMarkerProvider } from "../components/SkidMarkerContext";
import { SkidProvider } from "../context/SkidContext";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { setup } from "../utils/testSetup";

jest.mock('axios');
jest.mock('../components/Map/MapContext');

describe('PDF Map Viewer', () => {
    const mockSetMapState = jest.fn();

    const mockMapState =  {
        enableMarker: false,
        currentMapMarkers: [],
        files: [
            {
                _id: 'file_id_1',
                _account: 2,
                fileName: 'file_name_1',
                type: 'type_1',
                uri: 'uri_1',
            },
            {
                _id: 'file_id_2',
                _account: 2,
                fileName: 'file_name_2',
                type: 'type_2',
                uri: 'uri_2',
            }
        ],
        hazards: [
            { _id: 'hazard_id_1', id: 'H1', title: 'Hazard 1', sev: 'HIGH', cat: 'Category 1', color: '#FF0000', searchText: 'hazard1' },
            { _id: 'hazard_id_2', id: 'H2', title: 'Hazard 2', sev: 'LOW', cat: 'Category 2', color: '#00FF00', searchText: 'hazard2' },
          ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useMap.mockReturnValue({
            mapState: mockMapState,
            setMapState: mockSetMapState
        });

        axios.get.mockResolvedValue({
            data: {
                people: [
                    { _id: 'person1', name: 'John Doe', crew: 'Crew 1', role: 'Role 1', archive: 'off' },
                    { _id: 'person2', name: 'Jane Doe', crew: 'Crew 2', role: 'Role 2', archive: 'off' }
                ],
                files: [
                    { _id: 'file1', owner: 'person1', fileName: 'file1_name' },
                    { _id: 'file2', owner: 'person2', fileName: 'file2_name' }
                ]
            }
        });

        axios.post.mockResolvedValue({
            data: {
                file: 'file_data'
            }
        });
    });

    const renderComponent = () => {
        return (
            <MemoryRouter>
                <SkidModalProvider>
                        <AlertMessageProvider>
                            <SkidMarkerProvider>
                                <SkidProvider>
                                    <PDFViewer account={2}/>
                                </SkidProvider>
                            </SkidMarkerProvider>
                        </AlertMessageProvider>
                </SkidModalProvider>
            </MemoryRouter>
        );
    };

    test('shows the marker when enableMarker is true', async() => {
        useMap.mockReturnValue({
            mapState: {
                ...mockMapState,
                enableMarker: true,
            },
            setMapState: mockSetMapState
        });
        const { user } = setup(renderComponent());       
        
        await waitFor(() => {
            expect(screen.getByTestId('cursor-red-dot')).toBeInTheDocument();
        });

    });

    test('renders 3 skid markers that belong to a map', async() => {
        const updatedMapState = [
            {
                _id: "point_1",
                point: {
                    _id: "points_point_id_1",
                    originalHeight: 800,
                    originalWidth: 1200,
                    x: 500,
                    y: 300
                }
            },
            {
                _id: "point_2",
                point: {
                    _id: "points_point_id_2",
                    originalHeight: 800,
                    originalWidth: 1200,
                    x: 100,
                    y: 100
                }
            },
            {
                _id: "point_3",
                point: {
                    _id: "points_point_id_3",
                    originalHeight: 800,
                    originalWidth: 1200,
                    x: 600,
                    y: 300
                }
            }
        ];
        useMap.mockReturnValue({
            mapState: {
                ...mockMapState,
                currentMapMarkers: updatedMapState
            }
        });

        setup(renderComponent());       

        await waitFor(() => {
            expect(screen.getByTestId('red-dot-0')).toBeInTheDocument();
            expect(screen.getByTestId('red-dot-1')).toBeInTheDocument();
            expect(screen.getByTestId('red-dot-2')).toBeInTheDocument();

        });
    });

     test('displays marker(SkidMarkerPopover) correctly with data when clicked', async() => {
        const updatedMapState = [
            {
                _id: "point_1",
                info: {
                    crews: ["crew_id_1"],
                    cutPlans: {
                        fileName: "cutplan1",
                        key: 'cutplan_key_1'
                    },
                    pointName: 'pointName_1',
                    selectedDocuments: ['file_id_1'],
                    siteHazards: ['hazard_id_1',]
                },
                point: {
                    _id: "points_point_id_1",
                    originalHeight: 800,
                    originalWidth: 1200,
                    x: 500,
                    y: 300
                }
            }
        ];
        useMap.mockReturnValue({
            mapState: {
                ...mockMapState,
                currentMapMarkers: updatedMapState,
                crews: [{
                    _id: 'crew_id_1',
                    _account: 2,
                    name: 'Crew One',
                }, {
                    _id: 'crew_id_2',
                    _account: 2,
                    name: 'Crew Two',
                }]
            }
        });

        const { user } = setup(renderComponent());       
        await user.click(screen.getByTestId('red-dot-0'));

        await waitFor(() => {
            expect(screen.getByTestId('red-dot-0')).toBeInTheDocument();
            expect(screen.getByTestId('popover')).toBeInTheDocument();
            expect(screen.getByText(/skid: pointName_1/i)).toBeInTheDocument();

            const view = screen.getByText(/skid: pointName_1/i);

            expect(within(view).getByRole('button', {
            name: /edit/i
            })).toBeInTheDocument();

            expect(screen.getByRole('button', {
                name: /remove/i
            })).toBeInTheDocument();

            expect(screen.getByText(/crew:/i)).toBeInTheDocument();
            expect(screen.getByTestId("crew_list_crew_id_1")).toBeInTheDocument();

            expect(screen.getByText(/skid documents:/i)).toBeInTheDocument();
            expect(screen.getByTestId("skid-doc-0"));

            expect(screen.getByText(/weekly cut plans:/i)).toBeInTheDocument();
            expect(screen.getByTestId("skid-cut-plan"));

            expect(screen.getByText(/skid hazards:/i)).toBeInTheDocument();
            expect(screen.getByTestId("skid-hazard-0"));


        });
    }); 

    /* test('renders crew contact list when a crew is clicked', async () => {
        const updatedMapState = [
            {
                _id: "point_1",
                info: {
                    crews: ["crew-1"],
                    cutPlans: {
                        fileName: "cutplan1",
                        key: 'cutplan_key_1'
                    },
                    pointName: 'pointName_1',
                    selectedDocuments: ['file_id_1'],
                    siteHazards: ['hazard_id_1']
                },
                point: {
                    _id: "points_point_id_1",
                    originalHeight: 800,
                    originalWidth: 1200,
                    x: 500,
                    y: 300
                }
            }
        ];
    
        useMap.mockReturnValue({
            mapState: {
                ...mockMapState,
                currentMapMarkers: updatedMapState,
                crewTypes: ['Crew 1', 'Crew 2']
            },
            setMapState: mockSetMapState
        });
    
        const { user } = setup(renderComponent());
    
        // First click on the marker
        await user.click(screen.getByTestId('red-dot-0'));
    
        // Wait for the popover to appear and validate it's there
        await waitFor(() => {
            expect(screen.getByTestId('popover')).toBeInTheDocument();
        });
    
        // Then click on the crew list item
        await user.click(screen.getByTestId('crew-list-crew-1'));
    
        // Wait for the crew contact list to appear and validate its content
        await waitFor(() => {
            // Check if the popover header is correct
            expect(screen.getByText(/crew: crew-1/i)).toBeInTheDocument();
            expect(screen.getByText(/people:/i)).toBeInTheDocument();
    
            // Check if the correct crew members are displayed
            expect(screen.getByTestId('popover-person-person1')).toBeInTheDocument();
            //expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    }); */
    
});
