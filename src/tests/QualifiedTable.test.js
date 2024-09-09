import React from "react";
import { render, fireEvent, waitFor } from '@testing-library/react';
import QualifiedTable from "../components/QualifiedTable";
import axios from 'axios';
import { useAlertMessage } from "../components/AlertMessage";

// Mocking axios and useAlertMessage hook
jest.mock('axios');
jest.mock('../components/AlertMessage', () => ({
  useAlertMessage: jest.fn(() => ({
    addToast: jest.fn(),
  })),
}));

describe('QualifiedTable', () => {
    const mockQuals = [
      { _id: '1', title: 'CPR', complete: true },
      { _id: '2', title: 'First Aid', complete: false },
    ];
    const mockSetQuals = jest.fn();
    const mockPerson = { _id: '123', name: 'John Doe' };
    const mockAddToast = jest.fn();
  
    beforeEach(() => {
      useAlertMessage.mockReturnValue({ addToast: mockAddToast });
    });
  
    test('renders the qualifications correctly', () => {
      const { getByText } = render(<QualifiedTable quals={mockQuals} setQuals={mockSetQuals} person={mockPerson} />);
  
      // Check if the titles are rendered correctly
      expect(getByText('CPR')).toBeInTheDocument();
      expect(getByText('First Aid')).toBeInTheDocument();
      expect(getByText('Qualified')).toBeInTheDocument();
      expect(getByText('Working towards')).toBeInTheDocument();
    });
  
    test('handles qualifying a qualification', async () => {
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { quals: [{ _id: '2', title: 'First Aid', complete: true }] },
      });
  
      const { getByText } = render(<QualifiedTable quals={mockQuals} setQuals={mockSetQuals} person={mockPerson} />);
  
      fireEvent.click(getByText('Qualify'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/complete-qualification`,
          { _id: '2', complete: true, employee: '123' },
          { withCredentials: true }
        );
        expect(mockSetQuals).toHaveBeenCalledWith([{ _id: '2', title: 'First Aid', complete: true }]);
        expect(mockAddToast).toHaveBeenCalledWith(
          'Qualification Updated!',
          'Success! Qualification has been updated successfully',
          'success',
          'white'
        );
      });
    });
  
    test('handles unqualifying a qualification', async () => {
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { quals: [{ _id: '1', title: 'CPR', complete: false }] },
      });
  
      const { getByText } = render(<QualifiedTable quals={mockQuals} setQuals={mockSetQuals} person={mockPerson} />);
  
      fireEvent.click(getByText('Un-qualify'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/complete-qualification`,
          { _id: '1', complete: false, employee: '123' },
          { withCredentials: true }
        );
        expect(mockSetQuals).toHaveBeenCalledWith([{ _id: '1', title: 'CPR', complete: false }]);
        expect(mockAddToast).toHaveBeenCalledWith(
          'Qualification Updated!',
          'Success! Qualification has been updated successfully',
          'success',
          'white'
        );
      });
    });
  
    test('handles deleting a qualification', async () => {
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { quals: [] },
      });
  
      const { getAllByText } = render(<QualifiedTable quals={mockQuals} setQuals={mockSetQuals} person={mockPerson} />);
  
      fireEvent.click(getAllByText('Delete')[0]);
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/remove-qualification`,
          { _id: '1', employee: '123' },
          { withCredentials: true }
        );
        expect(mockSetQuals).toHaveBeenCalledWith([]);
        expect(mockAddToast).toHaveBeenCalledWith(
          'Qualification Removed!',
          'Success! Qualification has been removed successfully',
          'success',
          'white'
        );
      });
    });
  
    test('handles API errors gracefully', async () => {
      axios.post.mockRejectedValueOnce(new Error('Failed request'));
  
      const { getByText } = render(<QualifiedTable quals={mockQuals} setQuals={mockSetQuals} person={mockPerson} />);
  
      fireEvent.click(getByText('Un-qualify'));
  
      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          'Error!',
          'An error occurred while qualifying or unqualified Qualification',
          'danger',
          'white'
        );
      });
    });
  });