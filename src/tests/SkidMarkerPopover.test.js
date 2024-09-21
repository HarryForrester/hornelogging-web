import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SkidMarkerPopover from '../components/Popover/SkidMarkerPopover';
import { useMap } from '../components/Map/MapContext';
import { useAlertMessage } from '../components/AlertMessage';
import { deletePresignedUrl } from '../hooks/useFileDelete';
import { useSkid } from '../context/SkidContext';
import { useLibraryFile } from '../context/LibraryFileContext';
import { usePersonFile } from '../context/PersonFileContext';
import { useCrews } from '../context/CrewContext';
import axios from 'axios';

jest.mock('axios');
jest.mock('../components/Map/MapContext');
jest.mock('../components/AlertMessage');
jest.mock('../context/LibraryFileContext');
jest.mock('../context/PersonFileContext');
jest.mock('../context/CrewContext');
jest.mock('../context/SkidContext');
jest.mock('../hooks/useFileDelete');

describe('SkidMarkerPopover', () => {
  const mockSetMapState = jest.fn();
  const mockAddToast = jest.fn();

  const mockMapState = {
    currentMapId: 'current_map_id',
    currentMapMarkers: [{ _id: 'selected_skid_id' }],
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

  const mockSkidState = {
    selectedSkidId: 'selected_skid_id',
    selectedSkidPos: { x: 366, y: 147 },
    formik: {
      values: {
        skidName: 'One',
        selectedCrew: ['crew_id_1'],
        selectedCutPlan: { fileName: 'Cut Plan!', key: 'cutplan_key', url: 'cutplan_url' },
        selectedDocuments: ['library_file_id_1'],
        selectedSkidHazards: ['hazard_id_1']
      }
    }
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
    useMap.mockReturnValue({
      mapState: mockMapState,
      setMapState: mockSetMapState
    });

    useLibraryFile.mockReturnValue({
      libraryFiles: mockLibraryFiles
    });

    usePersonFile.mockReturnValue({
      personFiles: mockPersonFiles
    });

    useSkid.mockReturnValue({
      skidState: mockSkidState
    });

    useCrews.mockReturnValue({
      crews: mockCrewsState
    });

    useAlertMessage.mockReturnValue({ addToast: mockAddToast });

    deletePresignedUrl.mockResolvedValueOnce(); // Mock S3 delete function
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the popover when showPopover is true', () => {
    render(<SkidMarkerPopover showPopover={true} setShowPopover={jest.fn()} peopleByCrew={{}} />);
    const popoverElement = screen.getByTestId('popover');
    expect(popoverElement).toBeInTheDocument();
  });

  test('displays the correct skid name and documents', () => {
    render(<SkidMarkerPopover showPopover={true} setShowPopover={jest.fn()} peopleByCrew={{}} />);
    // Check skid name
    expect(screen.getByText(/Skid: One/)).toBeInTheDocument();
    const documentItem = screen.getByTestId('skid-doc-0');
    expect(documentItem).toHaveTextContent('Lib File One');
  });

  test('opens the hazard modal when a hazard is clicked', () => {
    render(<SkidMarkerPopover showPopover={true} setShowPopover={jest.fn()} peopleByCrew={{}} />);
    const hazardItem = screen.getByTestId('skid-hazard-0');
    fireEvent.click(hazardItem);

    // Verify the hazard modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('calls setShowPopover and hides popover on hazard modal close', () => {
    const mockSetShowPopover = jest.fn();
    render(
      <SkidMarkerPopover showPopover={true} setShowPopover={mockSetShowPopover} peopleByCrew={{}} />
    );

    const hazardItem = screen.getByTestId('skid-hazard-0');
    fireEvent.click(hazardItem);

    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(mockSetShowPopover).toHaveBeenCalledWith(true);
  });

  test('displays crew information and toggles the crew view', () => {
    const mockSetShowPopover = jest.fn();
    render(
      <SkidMarkerPopover showPopover={true} setShowPopover={mockSetShowPopover} peopleByCrew={{}} />
    );
    // Click on crew item
    const crewItem = screen.getByTestId('crew_list_crew_id_1');
    fireEvent.click(crewItem);

    // Verify crew details are visible
    expect(screen.getByText(/Crew: Crew One/)).toBeInTheDocument();
  });

  test('diplays person information within the crew view', () => {
    const mockPeopleByCrew = {
      crew_id_1: [
        {
          _id: 'person_id_1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Worker',
          filesByPerson: []
        }
      ]
    };

    render(
      <SkidMarkerPopover
        showPopover={true}
        setShowPopover={jest.fn()}
        peopleByCrew={mockPeopleByCrew}
      />
    );

    // Click on crew item
    const crewItem = screen.getByTestId('crew_list_crew_id_1');
    fireEvent.click(crewItem);

    // Click on person item
    const personItem = screen.getByTestId('popover_person_id_1');
    fireEvent.click(personItem);

    // Verify person details are visible
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  test('removes skid when RemoveSkidButton is clicked', async () => {
    const mockSetShowPopover = jest.fn();

    axios.delete = jest.fn().mockResolvedValueOnce({ status: 200, data: {} });
    render(
      <SkidMarkerPopover showPopover={true} setShowPopover={mockSetShowPopover} peopleByCrew={{}} />
    );
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      // Verify S3 delete function was called
      expect(deletePresignedUrl).toHaveBeenCalledWith(['cutplan_key']);

      // Verify that the axios delete API was called
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:3001/pointonmap/selected_skid_id/current_map_id`,
        { withCredentials: true }
      );

      // Verify toast notification is shown
      expect(mockAddToast).toHaveBeenCalledWith(
        'Skid Removed!',
        'Success! Skid: One has been removed',
        'success',
        'white'
      );
    });
  });

  test('should handle errors correctly', async () => {
    const mockSetShowPopover = jest.fn();
    // Mock axios.delete to throw an error
    const mockError = new Error('Network Error');
    axios.delete.mockRejectedValueOnce(mockError);
    render(
      <SkidMarkerPopover showPopover={true} setShowPopover={mockSetShowPopover} peopleByCrew={{}} />
    );
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      // Verify S3 delete function was called
      expect(deletePresignedUrl).toHaveBeenCalledWith(['cutplan_key']);

      // Verify that the axios delete API was called
      expect(axios.delete).toHaveBeenCalledWith(
        `http://localhost:3001/pointonmap/selected_skid_id/current_map_id`,
        { withCredentials: true }
      );

      // Verify toast notification is shown
      expect(mockAddToast).toHaveBeenCalledWith(
        'Error Removing Skid!',
        'An error occurred while removing skid: One. Please try again.',
        'danger',
        'white'
      );
    });
  });
});
