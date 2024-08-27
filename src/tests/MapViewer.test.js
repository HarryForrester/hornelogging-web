import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
            { _id: 'hazard1', id: 'H1', title: 'Hazard 1', sev: 'HIGH', cat: 'Category 1', color: '#FF0000', searchText: 'hazard1' },
            { _id: 'hazard2', id: 'H2', title: 'Hazard 2', sev: 'LOW', cat: 'Category 2', color: '#00FF00', searchText: 'hazard2' },
          ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useMap.mockReturnValue({
            mapState: mockMapState,
            setMapState: mockSetMapState
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

    beforeEach(() => {
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

    test('shows the markers that belong to each map', async() => {
        const updatedMapState = [
            {
                _id: "point_1",
                info: {
                    crews: ["Crew 1"],
                    cutPlans: {
                        fileName: "cutplan1",
                        key: 'cutplan_key_1'
                    },
                    pointName: 'pointName_1',
                    selectedDocuments: {
                        _id: 'doc_id_1',
                        _account: 2,
                        owner: 2,
                        fileName: 'doc_fileName_1',
                        fileUrl: 'doc_fileUrl_1',
                        key: 'doc_key_1',
                        type: 'doc_type_1',
                        searchText: 'doc_searchText_1'
                    },
                    siteHazards: 'hazard_id_1',
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
                currentMapMarkers: updatedMapState
            }
        });

        const { user } = setup(renderComponent());       

        await waitFor(() => {
            expect(screen.getByTestId('red-dot-0')).toBeInTheDocument();
        });
    });

    test('displays marker when clicked', async() => {
        const updatedMapState = [
            {
                _id: "point_1",
                info: {
                    crews: ["Crew 1"],
                    cutPlans: {
                        fileName: "cutplan1",
                        key: 'cutplan_key_1'
                    },
                    pointName: 'pointName_1',
                    selectedDocuments: {
                        _id: 'doc_id_1',
                        _account: 2,
                        owner: 2,
                        fileName: 'doc_fileName_1',
                        fileUrl: 'doc_fileUrl_1',
                        key: 'doc_key_1',
                        type: 'doc_type_1',
                        searchText: 'doc_searchText_1'
                    },
                    siteHazards: 'hazard_id_1',
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
            }
        });

        /* useSkid.mockReturnValue({
            skidState: {
                formik: {},
            },
            
        }) */

        const { user } = setup(renderComponent());       
        await user.click(screen.getByTestId('red-dot-0'));

        await waitFor(() => {
            expect(screen.getByTestId('red-dot-0')).toBeInTheDocument();
        });
    });
});
