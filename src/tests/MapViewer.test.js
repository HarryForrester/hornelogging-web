import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import PDFViewer from '../components/MapViewer';
import { useLibraryFile } from '../context/LibraryFileContext';
import { useMap } from '../components/Map/MapContext';
import { useSkid } from '../context/SkidContext';
import { useCrews } from '../context/CrewContext';
import { usePersonFile } from '../context/PersonFileContext';
import { useAlertMessage } from '../components/AlertMessage';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
jest.mock('../components/Map/MapContext');
jest.mock('../context/SkidContext');
jest.mock('../context/PersonFileContext');
jest.mock('../context/LibraryFileContext');
jest.mock('../context/CrewContext');

jest.mock('../components/AlertMessage');

describe('PDF Map Viewer', () => {
  const mockSetMapState = jest.fn();
  const mockSetSkidState = jest.fn();
  const mockAddToast = jest.fn();

  const mockMapState = {
    enableMarker: false,
    currentMapMarkers: [],
    files: [
      {
        _id: 'file_id_1',
        _account: 2,
        fileName: 'File One',
        type: 'file_type_id_1',
        uri: 'uri_1'
      },
      {
        _id: 'file_id_2',
        _account: 2,
        fileName: 'File Two',
        type: 'file_type_id_2',
        uri: 'uri_2'
      }
    ],
    fileTypes: [
      {
        _id: 'file_type_id_1',
        _account: 2,
        name: 'File Type One',
        note: 'An Example Type'
      },
      {
        _id: 'file_type_id_2',
        _account: 2,
        name: 'File Type Two',
        note: 'An Example Type'
      }
    ],
    hazards: [
      {
        _id: 'hazard_id_1',
        id: 'H1',
        title: 'Hazard 1',
        sev: 'HIGH',
        cat: 'Category 1',
        color: '#FF0000',
        searchText: 'hazard1'
      },
      {
        _id: 'hazard_id_2',
        id: 'H2',
        title: 'Hazard 2',
        sev: 'LOW',
        cat: 'Category 2',
        color: '#00FF00',
        searchText: 'hazard2'
      }
    ]
  };

  const mockLibraryFiles = {
    types: [
      {
        _id: 'library_file_type_id_1',
        _account: 2,
        name: 'Library Doc Type One',
        note: ''
      },
      {
        _id: 'library_file_type_id_2',
        _account: 2,
        name: 'Library Doc Type Two',
        note: ''
      }
    ],
    files: [
      {
        _id: 'library_file_id_1',
        _account: 2,
        fileName: 'Lib File One',
        fileUrl: 'fileUrl_1',
        key: 'key_1',
        owner: 2,
        searchText: 'searchText_1',
        type: 'library_file_type_id_1'
      },
      {
        _id: 'library_file_id_2',
        _account: 2,
        fileName: 'Lib File Two',
        fileUrl: 'fileUrl_2',
        key: 'key_2',
        owner: 2,
        searchText: 'searchText_2',
        type: 'library_file_type_id_1'
      }
    ]
  };

  const mockPersonFiles = {
    personFileTypes: [
      {
        _id: 'person_file_type_id_1',
        _account: 2,
        name: 'Person file type one',
        note: ''
      },
      {
        _id: 'person_file_type_id_2',
        _account: 2,
        name: 'Person file type two',
        note: ''
      }
    ],
    personFiles: [
      {
        _id: 'person_file_id_1',
        _account: 2,
        fileName: 'Person File One',
        type: 'person_file_type_id_1',
        owner: 'person_id_1',
        uri: 'uri_1',
        searchText: 'searchText_1'
      },
      {
        _id: 'person_file_id_2',
        _account: 2,
        fileName: 'Person File Two',
        type: 'person_file_type_id_2',
        owner: 'person_id_1',
        uri: 'uri_2',
        searchText: 'searchText_2'
      }
    ]
  };

  const mockCrewsState = [
    {
      _id: 'crew_id_1',
      _account: 2,
      name: 'Crew One'
    },
    {
      _id: 'crew_id_2',
      _account: 2,
      name: 'Crew Two'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useMap.mockReturnValue({
      mapState: mockMapState,
      setMapState: mockSetMapState
    });

    useSkid.mockReturnValue({
      skidState: {
        selectedSkidId: 'selected_skid_id',
        selectedSkidPos: { x: 0, y: 0 },
        formik: {
          values: {
            skidName: 'One',
            selectedCrew: ['crew_id_1'],
            selectedDocuments: ['library_file_id_1'],
            selectedCutPlan: {
              fileName: 'Cut Plan Example File',
              key: 'cut_plan_key',
              url: 'cut_plan_url'
            },
            selectedSkidHazards: ['hazard_id_1']
          }
        }
      },
      setSkidState: mockSetSkidState
    });

    usePersonFile.mockReturnValue({
      personFiles: mockPersonFiles
    });

    useAlertMessage.mockReturnValue({
      addToast: mockAddToast
    });

    useLibraryFile.mockReturnValue({
      libraryFiles: mockLibraryFiles
    });

    useCrews.mockReturnValue({
      crews: mockCrewsState
    });

    axios.get.mockResolvedValue({
      data: {
        people: [
          {
            _id: 'person_id_1',
            name: 'John Doe',
            crew: 'crew_id_1',
            role: 'Role 1',
            archive: 'off'
          },
          {
            _id: 'person_id_2',
            name: 'Jane Doe',
            crew: 'crew_id_1',
            role: 'Role 2',
            archive: 'off'
          },
          {
            _id: 'person_id_3',
            name: 'Kane Doe',
            crew: 'crew_id_2',
            role: 'Role 3',
            archive: 'off'
          }
        ],
        files: [
          { _id: 'file_id_1', owner: 'person_id_1', fileName: 'File One', type: 'file_type_id_1' },
          { _id: 'file_id_2', owner: 'person_id_1', fileName: 'File Two', type: 'file_type_id_1' }
        ]
      }
    });

    axios.post.mockResolvedValue({
      data: {
        file: 'file_data'
      }
    });
  });

  test('renders MapViewer and components correctly', async () => {
    //setup(renderComponent());
    render(
      <PDFViewer
        setShowSkidModal={jest.fn()}
        editGeneralHazardsModalVisible={jest.fn()}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 0, y: 0 }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-general-hazards-modal')).toBeInTheDocument();
      expect(screen.getByTestId('map-viewer-pdf-container')).toBeInTheDocument();
    });
  });

  test('shows the marker when enableMarker is true', async () => {
    useMap.mockReturnValue({
      mapState: {
        ...mockMapState,
        enableMarker: true
      },
      setMapState: mockSetMapState
    });
    render(
      <PDFViewer
        setShowSkidModal={jest.fn()}
        editGeneralHazardsModalVisible={jest.fn()}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 0, y: 0 }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('cursor-red-dot')).toBeInTheDocument();
    });
  });

  test('renders 3 skid markers that belong to a map', async () => {
    const updatedMapState = [
      {
        _id: 'point_1',
        point: {
          _id: 'points_point_id_1',
          originalHeight: 800,
          originalWidth: 1200,
          x: 500,
          y: 300
        }
      },
      {
        _id: 'point_2',
        point: {
          _id: 'points_point_id_2',
          originalHeight: 800,
          originalWidth: 1200,
          x: 100,
          y: 100
        }
      },
      {
        _id: 'point_3',
        point: {
          _id: 'points_point_id_3',
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

    render(
      <PDFViewer
        setShowSkidModal={jest.fn()}
        editGeneralHazardsModalVisible={jest.fn()}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 0, y: 0 }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('red-dot-0')).toBeInTheDocument();
      expect(screen.getByTestId('red-dot-1')).toBeInTheDocument();
      expect(screen.getByTestId('red-dot-2')).toBeInTheDocument();
    });
  });

  test('loads and displays the PDF document', async () => {
    render(
      <PDFViewer
        setShowSkidModal={jest.fn()}
        editGeneralHazardsModalVisible={false}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 0, y: 0 }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('map-viewer-pdf-container')).toBeInTheDocument();
      expect(screen.queryByText('Loading PDF...')).toBeNull(); // Assuming loading text appears during loading
    });
  });

  // Test to verify mouse position updates on mouse move
  test('updates mouse position on mouse move', async () => {
    useMap.mockReturnValue({
      mapState: {
        ...mockMapState,
        enableMarker: true
      }
    });
    render(
      <PDFViewer
        setShowSkidModal={jest.fn()}
        editGeneralHazardsModalVisible={false}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 50, y: 50 }}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('cursor-red-dot')).toHaveStyle({ left: '50px', top: '50px' });
    });
  });

  // Test to ensure that the add skid modal opens correctly
  test('opens add skid modal when clicking the red dot', async () => {
    useMap.mockReturnValue({
      mapState: {
        ...mockMapState,
        enableMarker: true
      },
      setMapState: mockSetMapState
    });
    const mockSetShowSkidModal = jest.fn();
    render(
      <PDFViewer
        setShowSkidModal={mockSetShowSkidModal}
        editGeneralHazardsModalVisible={false}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 0, y: 0 }}
      />
    );

    const redDot = screen.getByTestId('cursor-red-dot');
    userEvent.click(redDot);

    await waitFor(() => {
      expect(mockSetShowSkidModal).toHaveBeenCalled(); // Check if map state updates if necessary
    });
  });

  test('handles marker click to open skid modal with correct data', async () => {
    const mockPoint = {
      _id: 'point_id',
      point: { x: 200, y: 250 },
      info: {
        pointName: 'Test Point',
        crews: ['crew_id_1'],
        selectedDocuments: ['library_file_id_1'],
        cutPlans: { fileName: 'Cut Plan Example File' },
        siteHazards: ['hazard_id_1']
      }
    };

    useMap.mockReturnValue({
      mapState: {
        ...mockMapState,
        currentMapMarkers: [mockPoint]
      }
    });

    render(
      <PDFViewer
        setShowSkidModal={jest.fn()}
        editGeneralHazardsModalVisible={false}
        setEditGeneralHazardsModalVisible={jest.fn()}
        setMousePosition={jest.fn()}
        mousePosition={{ x: 0, y: 0 }}
      />
    );

    // Simulate clicking the marker
    userEvent.click(screen.getByTestId('red-dot-0')); // Assuming it's the first marker

    await waitFor(() => {
      const callFunction = mockSetSkidState.mock.calls[0][0]; // Get the function
      const newState = callFunction({}); // Call the function with an empty object or the previous state
      expect(newState).toEqual(
        expect.objectContaining({
          selectedSkidId: 'point_id',
          selectedSkidPos: { x: 200, y: 250 },
          formik: expect.objectContaining({
            values: {
              skidName: 'Test Point',
              selectedCrew: ['crew_id_1'],
              selectedDocuments: ['library_file_id_1'],
              selectedCutPlan: { fileName: 'Cut Plan Example File' },
              selectedSkidHazards: ['hazard_id_1']
            }
          })
        })
      );
    });
  });

  

});
