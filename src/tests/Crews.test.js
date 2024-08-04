import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Crews from '../pages/crews';
import { MapProvider } from '../components/Map/MapContext';
import { SkidModalProvider } from '../components/Modal/Skid/SkidModalContext';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useMap } from '../components/Map/MapContext';
import { useAlertMessage } from '../components/AlertMessage';
import axios from 'axios';

import { AlertMessageProvider } from '../components/AlertMessage';
import { SkidMarkerProvider } from '../components/SkidMarkerContext';
import { ConfirmationModalProvider } from '../components/ConfirmationModalContext';
// Mock the necessary hooks and context providers
jest.mock('axios');

// Mock implementation of the axios GET request
const mockResponse = {
    data: {
      isLoggedIn: true,
      crews: [
        {
          _id: "1",
          name: "Crew One",
          people: [
            {
              _id: "12",
              name: "Person One",
              imgUrl: {
                url: "exampleurl"
              }
            },
            {
              _id: "13",
              name: "Person Two",
              imgUrl: {
                url: "exampleurl"
              }
            }
          ]
        },
        {
          _id: "2",
          name: "Crew Two",
          people: [
            {
              _id: "21",
              name: "Person Three",
              imgUrl: {
                url: "exampleurl"
              }
            }
          ]
        }
      ],
      archivedPeople: []
    }
  };
  
  axios.get.mockResolvedValue(mockResponse);

describe('Crews Page', () => {
    test('renders Crews page with initial elements', () => {
        render(
          <MemoryRouter>
            <SkidModalProvider>
              <MapProvider>
                  <ConfirmationModalProvider>
                  <AlertMessageProvider>
                      <SkidMarkerProvider>
                          <Crews />
                      </SkidMarkerProvider>
                  </AlertMessageProvider>
                  </ConfirmationModalProvider>
      
              </MapProvider>
            </SkidModalProvider>
          </MemoryRouter>
        );
      
        // Check if the header is in the document
        expect(screen.getByText(/Crews/i)).toBeInTheDocument();
      
        // Check if NewPersonButton and NewCrewButton are present
        expect(screen.getByText(/New Person/i)).toBeInTheDocument();
        expect(screen.getByText(/New Crew/i)).toBeInTheDocument();
      
        // Check if the search input is present
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      
        // Check if the button to toggle archived staff is present
        expect(screen.getByRole('button', { name: /Show Archived Staff/i })).toBeInTheDocument();
      });
      
      test('fetches and displays data from API', async () => {
          render(
            <MemoryRouter>
              <SkidModalProvider>
                <MapProvider>
                  <ConfirmationModalProvider>
                    <AlertMessageProvider>
                      <SkidMarkerProvider>
                        <Crews />
                      </SkidMarkerProvider>
                    </AlertMessageProvider>
                  </ConfirmationModalProvider>
                </MapProvider>
              </SkidModalProvider>
            </MemoryRouter>
          );
      
          // Wait for API data to be rendered
          await waitFor(() => {
            expect(screen.getByText('Crew One')).toBeInTheDocument();
            expect(screen.getByText('Crew Two')).toBeInTheDocument();
            expect(screen.getByAltText('Person One')).toBeInTheDocument();
            expect(screen.getByAltText('Person Two')).toBeInTheDocument();
          });
        });
      
      test('renders crew member images', async () => {
          render(
            <MemoryRouter>
              <SkidModalProvider>
                <MapProvider>
                  <ConfirmationModalProvider>
                    <AlertMessageProvider>
                      <SkidMarkerProvider>
                        <Crews />
                      </SkidMarkerProvider>
                    </AlertMessageProvider>
                  </ConfirmationModalProvider>
                </MapProvider>
              </SkidModalProvider>
            </MemoryRouter>
          );
      
          // Check if crew member images are displayed
          await waitFor(() => {
            expect(screen.getByRole('img', {name: /Person One/i})).toBeInTheDocument();
            expect(screen.getByRole('img', {name: /Person Two/i})).toBeInTheDocument();
          });
        });
      
        test('handles empty states correctly', async () => {
          axios.get.mockResolvedValue({
            data: {
              isLoggedIn: true,
              crews: [],
              archivedPeople: []
            }
          });
      
          render(
            <MemoryRouter>
              <SkidModalProvider>
                <MapProvider>
                  <ConfirmationModalProvider>
                    <AlertMessageProvider>
                      <SkidMarkerProvider>
                        <Crews />
                      </SkidMarkerProvider>
                    </AlertMessageProvider>
                  </ConfirmationModalProvider>
                </MapProvider>
              </SkidModalProvider>
            </MemoryRouter>
          );
      
          // Check that no crew data is displayed
          expect(screen.queryByText('Crew One')).not.toBeInTheDocument();
          expect(screen.queryByText('Crew Two')).not.toBeInTheDocument();
        });
      
        test('shows and hides archived staff correctly', async () => {
          render(
            <MemoryRouter>
              <SkidModalProvider>
                <MapProvider>
                  <ConfirmationModalProvider>
                    <AlertMessageProvider>
                      <SkidMarkerProvider>
                        <Crews />
                      </SkidMarkerProvider>
                    </AlertMessageProvider>
                  </ConfirmationModalProvider>
                </MapProvider>
              </SkidModalProvider>
            </MemoryRouter>
          );
      
          // Initially, archived staff should not be visible
          expect(screen.queryByText('Archived Staff')).not.toBeInTheDocument();
      
          // Click the button to show archived staff
          fireEvent.click(screen.getByRole('button', { name: /Show Archived Staff/i }));
      
          // Archived staff should now be visible
          await waitFor(() => {
            expect(screen.getByText('Archived Staff')).toBeInTheDocument();
          });
      
          // Click the button to hide archived staff
          fireEvent.click(screen.getByRole('button', { name: /Hide Archived Staff/i }));
      
          // Archived staff should no longer be visible
          expect(screen.queryByText('Archived Staff')).not.toBeInTheDocument();
        });
      
})
