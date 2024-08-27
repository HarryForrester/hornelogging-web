import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Maps from '../pages/maps';
import { MapProvider } from '../components/Map/MapContext';
import { SkidModalProvider } from '../components/Modal/Skid/SkidModalContext';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useMap } from '../components/Map/MapContext';
import { useAlertMessage } from '../components/AlertMessage';
import axios from 'axios';

import { AlertMessageProvider } from '../components/AlertMessage';
import { SkidMarkerProvider } from '../components/SkidMarkerContext';
import { ConfirmationModalProvider } from '../components/ConfirmationModalContext';
jest.mock('axios');

const mockMapsResponse = {
    status: 200,
    data: {
        crew: [
            "Crew 1",
            "Crew 2",
        ],
        maps: [
            {
                _id: "map_id_1",
                _account: 2,
                type: "Map",
                fileName: "map_fileName_1",
                name: "Map One",
                map: {
                    key: "map_key_1",
                    url: "map_url_1",
                },
                points: [
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
                ]
            }
        ],
        files: [
            {
            _id: '1',
            _account: '2',
            fileName: 'fileName1',
            fileUrl: 'fileUrl1',
            key: 'key1',
            owner: '2',
            searchText:'searchText1',
            type: 'Type1'
            },
            {
                _id: '2',
                _account: '2',
                fileName: 'fileName2',
                fileUrl: 'fileUrl2',
                key: 'key2',
                owner: '2',
                searchText:'searchText2',
                type: 'Type1'
            }
        ],
        generalHazards: [
            'gh1', 'gh2'
        ],
        hazards: [
            {
                _id: 'gh1',
                _account: '2',
                cat: 'Fire',
                catIndex: 1,
                color: '#ffa600',
                harms: '{"Fire":["A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions","If a Permit is not required, the following conditions must apply"],"Property Damage":["Work area must have a minimum 3m clear to mineral earth around it","Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles","If possible, advise management when Hot Works is about to start, and when finished.","Someone must stay and patrol the area for a minimum 30 minutes after work ceases","Comply with any Forest Owner/Manager requirements"]}',
                id: 'F2',
                reviewDate: '',
                reviewReason: 'General Review',
                searchText: 'searchText1',
                sev: "MEDIUM",
                title: 'Hot works (Welding, grinding)'
            },
            {
                _id: 'gh2',
                _account: '2',
                cat: 'Fire',
                catIndex: 1,
                color: "#42f54e",
                harms: '"{"Fire":["Do not light any Open Fire (includes in a drum/incinerator at any time. Take all rubbish out of the forest with you"]}"',
                id: 'F3',
                reviewDate: '',
                reviewReason: 'General Review',
                searchText: 'searchText2',
                sev: "LOW",
                title: 'Open Fires'
            }
        ],
        isLoggedIn: true,
        username: 'mega@logs.co.nz',
        _account :2
    }
}

const mockLoadFromDbResponse = {
    status: 200,
    data: {
      pdfData: {
        map: 'http://example.com/map.pdf',
      },
    },
  };
  
  axios.get.mockImplementation((url) => {
    console.log('ru;',url);
    if (url === 'http://localhost:3001/maps') {
      return Promise.resolve(mockMapsResponse);
    } else if (url.startsWith('http://localhost:3001/loadfromdb/')) {
      return Promise.resolve(mockLoadFromDbResponse);
    }
    return Promise.reject(new Error('Not Found'));
  });
  
describe('Maps Page', () => {
    test('renders Maps pages with inital elements correctly', async() => {
        render(
            <MemoryRouter>
                <SkidModalProvider>
                    <MapProvider>
                        <ConfirmationModalProvider>
                            <AlertMessageProvider>
                            <SkidMarkerProvider>
                                <Maps />
                            </SkidMarkerProvider>
                            </AlertMessageProvider>
                        </ConfirmationModalProvider>
                    </MapProvider>
                </SkidModalProvider>
            </MemoryRouter>
        );

        await waitFor(async () => {
            expect(screen.getByRole('button', { name: /map one/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /add point/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /edit general hazards/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
            expect(screen.getByTestId('upload_map_button')).toBeInTheDocument();

            const marker = await screen.findByTestId('red-dot-0');
            expect(marker).toBeInTheDocument();
            expect(marker).toHaveStyle({
                position: 'absolute',
                left: `500px`,
                top: `300px`,
                width: '20px',
                height: '20px',
                backgroundColor: 'red',
                transform: 'translate(-50%, -50%)',
              });
        });
    });

    
})
