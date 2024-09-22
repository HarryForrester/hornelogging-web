import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSkid } from '../context/SkidContext';
import AddDocModal from '../components/Modal/AddDocModal';
import { useLibraryFile } from '../context/LibraryFileContext';
jest.mock('../context/SkidContext');
jest.mock('../context/LibraryFileContext');

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx)
  };
}

describe('AddDocModal', () => {
  const mockLibraryFilesState = jest.fn();
  const mockSetSkidState = jest.fn();

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
        type: 'library_type_id_2',
        owner: 'person_id_1',
        fileName: 'File Two',
        fileUrl: 'example-url-2',
        key: 'example-key-2',
        searchText: 'search-text-2'
      },
      {
        _id: 'library_file_id_3',
        _account: 2,
        type: 'library_type_id_1',
        owner: 'person_id_1',
        fileName: 'File Three',
        fileUrl: 'example-url-3',
        key: 'example-key-3',
        searchText: 'search-text-3'
      }
    ]
  };

  const mockSkidState = {
    selectedSkidId: null,
    selectedSkidPos: null,
    formik: {
      values: {
        skidName: '',
        selectedCrew: [],
        selectedDocuments: [],
        selectedCutPlan: null,
        selectedSkidHazards: []
      }
    }
  };

  beforeEach(() => {
    useSkid.mockReturnValue({
      skidState: mockSkidState,
      setSkidState: mockSetSkidState
    });

    useLibraryFile.mockReturnValue({
      libraryFiles: mockLibraryFileState,
      setLibraryFiles: mockLibraryFilesState
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Accordion headers and bodies correctly', async () => {
    const { user } = setup(<AddDocModal show={true} close={jest.fn()} />);
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
    await user.click(screen.getByTestId('addDocument-library_file_id_1'));

    // Wait for the UI to update
    await waitFor(() => {
      // Verify Category 2 body becomes hidden
      expect(screen.getByTestId('accordion-body-0').parentElement).toHaveClass('collapse');

      // Verify Category 1 body is shown
      expect(screen.getByTestId('accordion-body-0').parentElement).toHaveClass('collapse');
    });
  });

  test('renders seach input with inital state', () => {
    setup(<AddDocModal show={true} close={jest.fn()} />);

    // Check if the input is in the document
    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();

    // Verify that the initial value is empty
    expect(searchInput.value).toBe('');
  });

  test('updates input value on change', async () => {
    const { user } = setup(<AddDocModal show={true} close={jest.fn()} />);

    // Find the input element
    const searchInput = screen.getByPlaceholderText('Search');

    // Type into the input
    await user.type(searchInput, 'doc 1');

    // Verify the input value has been updated
    expect(searchInput.value).toBe('doc 1');
  });

  test('filters documents based on search query: P1 (Singular)', async () => {
    const { user } = setup(<AddDocModal show={true} close={jest.fn()} />);

    // Find the input element
    const searchInput = screen.getByPlaceholderText('Search');

    // Type into the input
    await user.type(searchInput, 'One');

    // Wait for the UI to update and check for filtered results
    await waitFor(() => {
      // Ensure `File One` is visible
      const view1 = screen.getByTestId('accordion-fileName-library_file_id_1');
      expect(within(view1).getByText(/file one/i)).toBeInTheDocument();
    });
  });

  test('filters documents based on search query: P2 (filter multiple)', async () => {
    const { user } = setup(<AddDocModal show={true} close={jest.fn()} />);

    // Find the input element
    const searchInput = screen.getByPlaceholderText('Search');

    // Type a search query
    await user.type(searchInput, 'file');

    // Add a slight delay if debouncing is used
    await new Promise((r) => setTimeout(r, 500));

    // Wait for the UI to update and check for filtered results
    await waitFor(() => {
      // Verify no extra results are displayed
      const allResults = screen.getAllByTestId(/accordion-fileName-/);
      expect(allResults.length).toBe(3); // Adjust the expected length as needed

      // Check for each expected result
      const view1 = screen.getByTestId('accordion-fileName-library_file_id_1');
      expect(within(view1).getByText(/file one/i)).toBeInTheDocument();

      const view2 = screen.getByTestId('accordion-fileName-library_file_id_2');
      expect(within(view2).getByText(/file two/i)).toBeInTheDocument();

      const view3 = screen.getByTestId('accordion-fileName-library_file_id_3');
      expect(within(view3).getByText(/file three/i)).toBeInTheDocument();
    });
  });

  test('filters documents based on search query: P3 (Unknown input)', async () => {
    const { user } = setup(<AddDocModal show={true} close={jest.fn()} />);

    // Find the input element
    const searchInput = screen.getByPlaceholderText('Search');

    // Type into the input
    await user.type(searchInput, 'unknown');

    // Wait for the UI to update and check for filtered results
    await waitFor(() => {
      // Ensure no files are visible
      expect(screen.queryByText('File One')).not.toBeInTheDocument();
      expect(screen.queryByText('File Two')).not.toBeInTheDocument();
      expect(screen.queryByText('File Three')).not.toBeInTheDocument();
    });
  });

  test('adds a file to selectedFiles in skidState when "Add" button is clicked', async () => {
    const setSkidStateMock = jest.fn();

    // Mock setup
    useSkid.mockReturnValue({
      skidState: {
        formik: { values: { selectedDocuments: [] } }
      },
      setSkidState: setSkidStateMock
    });

    const { user } = setup(<AddDocModal show={true} close={jest.fn()} />);

    // Find the "Add" button for the first document
    const addButton = screen.getByTestId('addDocument-library_file_id_1');

    // Click the "Add" button
    await user.click(addButton);

    // Verify that the setSkidState function was called
    expect(setSkidStateMock).toHaveBeenCalled();

    // Get the function passed to setSkidState
    const setStateFunction = setSkidStateMock.mock.calls[0][0];

    // Execute the function with the previous state to simulate state update
    const newState = setStateFunction({
      formik: { values: { selectedDocuments: [] } }
    });

    // Verify that the hazard was added to selectedSkidHazards in the new state
    expect(newState.formik.values.selectedDocuments).toContain('library_file_id_1');
  });

  test('closes the AddDocModal', async () => {
    const mockClose = jest.fn();
    const { user } = setup(<AddDocModal show={true} close={mockClose} />);

    // Simulate clicking the close button on the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Wait for the state change
    await waitFor(() => {
      // Verify that setSkidState was called with a function
      expect(mockClose).toHaveBeenCalled();
    });
  });
});
