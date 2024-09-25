import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import HazardReviewModal from '../components/Modal/HazardReviewModal';
import { useAlertMessage } from '../components/AlertMessage';
import axios from 'axios';

jest.mock('axios');
jest.mock('../components/AlertMessage');

describe('HazardReviewModal', () => {
    const mockOnClose = jest.fn();
    const mockSetHazards = jest.fn();
    const mockAddToast = jest.fn();
    const defaultProps = {
        show: true,
        onHide: mockOnClose,
        selectedHazardsId: ['hazard_id_1'],
        hazards: [
            {
                _id: 'hazard_id_1',
                id: "F1",
                title: "Hazard One",
                sev: "MEDIUM",
                reviewDate: "Sep 25, 2024",
                reviewReason: "General Review!",
                harms: {
                    Fire: [
                        "A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions",
                        "If a Permit is not required, the following conditions must apply"
                    ],
                    PropertyDamage: [
                        "Work area must have a minimum 3m clear to mineral earth around it",
                        "Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles",
                        "If possible, advise management when Hot Works is about to start, and when finished.",
                        "Someone must stay and patrol the area for a minimum 30 minutes after work ceases",
                        "Comply with any Forest Owner/Manager requirements"
                    ]
                },
                cat: "Fire",
                catIndex: 1,
                _account: 2,
                searchText: "{\"_id\":\"65dbc69fe7fb3b52ed5e586b\",\"id\":\"F2\",\"title\":\"Hot works (Welding, grinding)\",\"sev\":\"MEDIUM\",\"reviewDate\":\"Sep 25, 2024\",\"reviewReason\":\"General Review!\",\"harms\":{\"Fire\":[\"A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions\",\"If a Permit is not required, the following conditions must apply\"],\"Property Damage\":[\"Work area must have a minimum 3m clear to mineral earth around it\",\"Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles\",\"If possible, advise management when Hot Works is about to start, and when finished.\",\"Someone must stay and patrol the area for a minimum 30 minutes after work ceases\",\"Comply with any Forest Owner/Manager requirements\"]},\"cat\":\"Fire\",\"catIndex\":1,\"_account\":2}",
                color: "#ffa600"
            }
        ],
        setHazards: mockSetHazards,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useAlertMessage.mockReturnValue({
            addToast: mockAddToast
        });

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                hazards: [
                    {
                        _id: 'hazard_id_1',
                        id: "F1",
                        title: "Hazard One",
                        sev: "MEDIUM",
                        reviewDate: "Sep 25, 2024",
                        reviewReason: "General Review!",
                        harms: {
                            Fire: [
                                "A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions",
                                "If a Permit is not required, the following conditions must apply"
                            ],
                            PropertyDamage: [
                                "Work area must have a minimum 3m clear to mineral earth around it",
                                "Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles",
                                "If possible, advise management when Hot Works is about to start, and when finished.",
                                "Someone must stay and patrol the area for a minimum 30 minutes after work ceases",
                                "Comply with any Forest Owner/Manager requirements"
                            ]
                        },
                        cat: "Fire",
                        catIndex: 1,
                        _account: 2,
                        searchText: "{\"_id\":\"65dbc69fe7fb3b52ed5e586b\",\"id\":\"F2\",\"title\":\"Hot works (Welding, grinding)\",\"sev\":\"MEDIUM\",\"reviewDate\":\"Sep 25, 2024\",\"reviewReason\":\"General Review!\",\"harms\":{\"Fire\":[\"A Hot Works Permit may be required before any work is carried out. If a Permit is issued, comply with all conditions\",\"If a Permit is not required, the following conditions must apply\"],\"Property Damage\":[\"Work area must have a minimum 3m clear to mineral earth around it\",\"Fire Extinguisher and hand tools must be on the work site – not in the container or vehicles\",\"If possible, advise management when Hot Works is about to start, and when finished.\",\"Someone must stay and patrol the area for a minimum 30 minutes after work ceases\",\"Comply with any Forest Owner/Manager requirements\"]},\"cat\":\"Fire\",\"catIndex\":1,\"_account\":2}",
                        color: "#ffa600"
                    }
                ]
            }
        });
    });

    test('renders the modal when open', () => {
        render(<HazardReviewModal {...defaultProps} />);
        expect(screen.getByText('Review Comment')).toBeInTheDocument();
    });

    test('does not render the modal when closed', () => {
        render(<HazardReviewModal {...defaultProps} show={false} />);
        expect(screen.queryByText('Review Comment')).not.toBeInTheDocument();
    });

    test('calls onClose when the close button is clicked', () => {
        render(<HazardReviewModal {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', {
            name: /close/i
        }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onSubmit with the correct data when the submit button is clicked', async () => {
        render(<HazardReviewModal {...defaultProps} />);
        await act(async () => {
            const dialog = screen.getByRole('dialog');

            const textbox = within(dialog).getByRole('textbox');

            fireEvent.change(textbox, { target: { value: 'Test' } });
            
            fireEvent.click(within(dialog).getByRole('button', {
                name: /update review/i
            }));
        });

        expect(mockAddToast).toHaveBeenCalledWith('Hazard Review Updated', `Success! Hazard One review comment has been updated`, 'success', 'white'); 
    });
});