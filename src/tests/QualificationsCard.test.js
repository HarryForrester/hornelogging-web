import React from "react";
import { render, fireEvent } from "@testing-library/react";
import QualificationsCard from "../components/Card/QualificationsCard";
import AddQualificationModal from "../components/Modal/AddQualificationModal";
import QualifiedTable from "../components/QualifiedTable";

// Mock the child components
jest.mock('../components/Modal/AddQualificationModal', () => jest.fn(() => <div data-testid="qualification-modal" />));
jest.mock('../components/QualifiedTable', () => jest.fn(() => <div data-testid="qualified-table" />));

describe('QualificationsCard', () => {
    const mockPerson = { id: 1, name: 'John Doe' };
    const mockQuals = [{ id: 1, name: 'CPR' }, { id: 2, name: 'First Aid' }];
    const mockSetQuals = jest.fn();
  
    it('renders without crashing', () => {
      const { getByText } = render(<QualificationsCard person={mockPerson} quals={mockQuals} setQuals={mockSetQuals} />);
  
      // Check that the card header renders
      expect(getByText('Qualifications')).toBeInTheDocument();
    });
  
    it('renders the QualifiedTable with the correct props', () => {
      render(<QualificationsCard person={mockPerson} quals={mockQuals} setQuals={mockSetQuals} />);
  
      // Ensure QualifiedTable receives the correct props
      expect(QualifiedTable).toHaveBeenCalledWith(
        expect.objectContaining({
          quals: mockQuals,
          person: mockPerson,
          setQuals: mockSetQuals,
        }),
        {}
      );
    });
  
    it('opens the AddQualificationModal when Add Qualification button is clicked', () => {
      const { getByText, getByTestId } = render(<QualificationsCard person={mockPerson} quals={mockQuals} setQuals={mockSetQuals} />);
  
      // Click the "Add Qualification" button
      fireEvent.click(getByText('Add Qualification'));
  
      // Check that the modal is visible
      expect(getByTestId('qualification-modal')).toBeInTheDocument();
      expect(AddQualificationModal).toHaveBeenCalledWith(expect.objectContaining({
        show: true
      }), {});
    });
  
    it('closes the AddQualificationModal when hide function is called', () => {
      const { getByText } = render(<QualificationsCard person={mockPerson} quals={mockQuals} setQuals={mockSetQuals} />);
  
      // Open the modal
      fireEvent.click(getByText('Add Qualification'));
  
      // Close the modal
      fireEvent.click(getByText('Add Qualification')); // Trigger the hide functionality
  
      // Expect that the modal is hidden
      expect(AddQualificationModal).toHaveBeenCalledWith(expect.objectContaining({
        show: false
      }), {});
    });
  });