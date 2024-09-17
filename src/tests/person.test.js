import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Person from '../pages/person';
import { usePersonFile } from '../context/PersonFileContext';
import { ConfirmationModalProvider } from '../components/ConfirmationModalContext';
import { AlertMessageProvider } from '../components/AlertMessage';
import { CrewProvider } from '../context/CrewContext';
jest.mock('axios');
jest.mock('../context/PersonFileContext');


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'person_id_1' }),
}));

describe('Person Component', () => {
  const mockSetPersonFiles = jest.fn();

  beforeEach(() => {
    usePersonFile.mockReturnValue({
      setPersonFiles: mockSetPersonFiles,
      personFiles: {
        personFileTypes: [
            {
                _id: 'filetype_id_1',
                _account: 2,
                name: 'File Type One',
                note: null
            },
            {
                _id: 'filetype_id_2',
                _account: 2,
                name: 'File Type Two',
                note: null
            }
        ],
      
        personFiles: [
            {
                _id : 'personfile_id_1',
                _account: 2,
                fileName: 'Person File One',
                owner: 'person_id_1',
                type: 'Person',
                uri: 'fake_uri_1',
            },
            {
                _id : 'personfile_id_2',
                _account: 2,
                fileName: 'Person File Two',
                owner: 'person_id_1',
                type: 'Person',
                uri: 'fake_uri_2',
            }
        ]
    }

    });
    axios.get.mockResolvedValue({
      data: {
        isLoggedIn: true,
        person: {
            _id: 'person_id_1',
            firstName: 'John',
            lastName: 'Doe',
            crew: 'crew_id_1',
            role: 'Foreman',
            phone: '0273456789',
            email: 'john@example.com',
            address: '123 Main St',
            dob: '1990-01-01',
            startDate: '2020-01-01',
            contact: 'Jane Doe',
            contactphone: '0273456789',
            doctor: 'Dr. Smith',
            medical: 'None',
             },
        files: [
            {
                _id: 'file_id_1',
                _account: 2,
                fileName: 'File One',
                fileUrl: 'fake_file_url',
                key: 'fake_key',
                owner: 'person_id_1',
                type: 'ft_id_1',
            },
            {
                _id: 'file_id_2',
                _account: 2,
                fileName: 'File Two',
                fileUrl: 'fake_file_url',
                key: 'fake_key',
                owner: 'person_id_1',
                type: 'ft_id_1',
            }
        ],
        fileTypes: [
            {
                _id: 'filetype_id_1',
                _account: 2,
                name: 'File Type One',
                note: null
            },
            {
                _id: 'filetype_id_2',
                _account: 2,
                name: 'File Type Two',
                note: null
            }
        ],
        personFiles: [
            {
                _id : 'personfile_id_1',
                _account: 2,
                fileName: 'Person File One',
                owner: 'person_id_1',
                type: 'Person',
                uri: 'fake_uri_1',
            },
            {
                _id : 'personfile_id_2',
                _account: 2,
                fileName: 'Person File Two',
                owner: 'person_id_1',
                type: 'Person',
                uri: 'fake_uri_2',
            }
        ],
        timesheetAccess: [
            {
                _id: 'tsa_id_1',
                _account: 2,
                title: 'Time Sheet',
                availableOnDevice: "{}"
            }
        ],
        forms: [],
        quals: [
            {
                _id: 'qual_id_1',
                _account: 2,
                title: 'Qual One',
                employee: 'person_id_1',
                complete: true
            },
            {
                _id: 'qual_id_2',
                _account: 2,
                title: 'Qual Two',
                employee: 'person_id_1',
                complete: false
            }
        ],
        _account: { id: 'test_account' },
        crews: [
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
        ],
      },
    });
  });

  test('renders the Person component with fetched data', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
              <CrewProvider>
                  <AlertMessageProvider>
                      <ConfirmationModalProvider>
                          <Person />
                      </ConfirmationModalProvider>
                  </AlertMessageProvider>
              </CrewProvider>
            </MemoryRouter>
          );
      
    })
    
    // Ensure loading the person data is happening
    //expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Assuming a loading indicator

    // Wait for data to be fetched and rendered
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /John Doe/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByTestId("removePersonBtn")).toBeInTheDocument();
        expect(screen.getByTestId("person-info-card")).toBeInTheDocument();
        expect(screen.getByTestId("person-document-card")).toBeInTheDocument();
        expect(screen.getByTestId("qualifications-card")).toBeInTheDocument();
        expect(screen.getByTestId("person-form-access-card")).toBeInTheDocument();
    })

    // Check for other elements that should be rendered
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
    expect(mockSetPersonFiles).toHaveBeenCalled();
  });

   test('navigates to login if the user is not logged in', async () => {
    axios.get.mockResolvedValueOnce({ data: { isLoggedIn: false } });

    render(
        <MemoryRouter>
            <CrewProvider>
                <AlertMessageProvider>
                    <ConfirmationModalProvider>
                        <Person />
                    </ConfirmationModalProvider>
                </AlertMessageProvider>
            </CrewProvider>
        </MemoryRouter>
    );

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });
 
  test('opens the edit person modal when Edit button is clicked', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
              <CrewProvider>
                  <AlertMessageProvider>
                      <ConfirmationModalProvider>
                          <Person />
                      </ConfirmationModalProvider>
                  </AlertMessageProvider>
              </CrewProvider>
            </MemoryRouter>
          );
      
    })

   expect(screen.getByTestId("add-or-edit-person-modal")).toBeInTheDocument();

    // Click the edit button
    fireEvent.click(screen.getByText(/Edit/i));

    // Check if the modal is shown
    await waitFor(() => expect(screen.getByText(/Edit Person/i)).toBeInTheDocument());

  });

  test('handles errors when fetching person data', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByRole('heading')).not.toBeInTheDocument(); // Ensure no heading is rendered
    });
  });

  test('does not render RemovePersonButton when currentUser or _account is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
        person: null, // Simulating missing person
        _account: null, // Simulating missing account
      },
    });
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByTestId("removePersonBtn")).not.toBeInTheDocument();
    });
  });

  test('does not render PersonInfo when currentUser or _account is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
        person: null, // Simulating missing person
        _account: null, // Simulating missing account
      },
    });
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByTestId("person-info-card")).not.toBeInTheDocument();
    });
  });

  test('does not render PersonDocumentCard when currentUser or _account is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
        person: null, // Simulating missing person
        _account: null, // Simulating missing account
      },
    });
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByTestId("person-document-card")).not.toBeInTheDocument();
    });
  });

  test('does not render QualificationsCard when currentUser or _account is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
        person: null, // Simulating missing person
        _account: null, // Simulating missing account
      },
    });
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByTestId("qualifications-card")).not.toBeInTheDocument();
    });
  });

  test('does not render PersonFormAccessCard when currentUser or _account is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
        person: null, // Simulating missing person
        _account: null, // Simulating missing account
      },
    });
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByTestId("person-form-access-card")).not.toBeInTheDocument();
    });
  });

  test('does not render AddOrEditPersonModal when currentUser or _account is missing', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        isLoggedIn: true,
        person: null, // Simulating missing person
        _account: null, // Simulating missing account
      },
    });
  
    render(
      <MemoryRouter>
        <CrewProvider>
          <AlertMessageProvider>
            <ConfirmationModalProvider>
              <Person />
            </ConfirmationModalProvider>
          </AlertMessageProvider>
        </CrewProvider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByTestId("add-or-edit-person-modal")).not.toBeInTheDocument();
    });
  });

  



});