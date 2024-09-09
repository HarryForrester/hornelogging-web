import React from "react";
import { render, fireEvent, waitFor} from "@testing-library/react";
import AddQualificationModal from "../components/Modal/AddQualificationModal";
import axios from "axios";
import { useAlertMessage } from "../components/AlertMessage";

// Mocking modules
jest.mock('axios');
jest.mock('../components/AlertMessage', () => ({
  useAlertMessage: jest.fn(),
}));

describe('AddQualificationModal', () => {
    const mockHide = jest.fn();
    const mockSetQuals = jest.fn();
    const mockAddToast = jest.fn();
    const person = { _id: '123', name: 'John Doe', firstName: 'John', lastName: 'Doe' };
  
    beforeEach(() => {
      useAlertMessage.mockReturnValue({
        addToast: mockAddToast,
      });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders modal correctly', () => {
      const { getByText, getByPlaceholderText } = render(
        <AddQualificationModal show={true} hide={mockHide} person={person} setQuals={mockSetQuals} />
      );
  
      // Check if modal content is displayed
      expect(getByText('Add Qualification')).toBeInTheDocument();
      expect(getByPlaceholderText('Qualification Title')).toBeInTheDocument();
      expect(getByText('Add')).toBeInTheDocument();
    });
  
    it('handles input change', () => {
      const { getByPlaceholderText } = render(
        <AddQualificationModal show={true} hide={mockHide} person={person} setQuals={mockSetQuals} />
      );
  
      const input = getByPlaceholderText('Qualification Title');
      fireEvent.change(input, { target: { value: 'First Aid' } });
  
      expect(input.value).toBe('First Aid');
    });
  
    it('submits the form successfully', async () => {
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { quals: [{ _id: '1', title: 'First Aid', complete: false }] },
      });
  
      const { getByText, getByPlaceholderText } = render(
        <AddQualificationModal show={true} hide={mockHide} person={person} setQuals={mockSetQuals} />
      );
  
      const input = getByPlaceholderText('Qualification Title');
      fireEvent.change(input, { target: { value: 'First Aid' } });
  
      fireEvent.click(getByText('Add'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/add-qualification`,
          { title: 'First Aid', employee: '123', complete: false },
          { withCredentials: true }
        );
        expect(mockSetQuals).toHaveBeenCalledWith([{ _id: '1', title: 'First Aid', complete: false }]);
        expect(mockAddToast).toHaveBeenCalledWith(
          'Qualification Added!',
          'Success! First Aid has been added to John Doe Qualifications',
          'success',
          'white'
        );
        expect(mockHide).toHaveBeenCalled();
      });
    });
  
    it('handles API errors', async () => {
      axios.post.mockRejectedValueOnce(new Error('Failed request'));
  
      const { getByText, getByPlaceholderText } = render(
        <AddQualificationModal show={true} hide={mockHide} person={person} setQuals={mockSetQuals} />
      );
  
      const input = getByPlaceholderText('Qualification Title');
      fireEvent.change(input, { target: { value: 'CPR' } });
  
      fireEvent.click(getByText('Add'));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          // eslint-disable-next-line no-undef
          `${process.env.REACT_APP_URL}/add-qualification`,
          { title: 'CPR', employee: '123', complete: false },
          { withCredentials: true }
        );
        expect(mockAddToast).toHaveBeenCalledWith(
          'Error!',
          'An error has occurred while adding CPR to John Doe\'s qualifications, please try again',
          'danger',
          'white'
        );
        expect(mockHide).not.toHaveBeenCalled();
      });
    });
  
    it('resets input and hides modal on close', async() => {
      const { getByRole, getByPlaceholderText } = render(
        <AddQualificationModal show={true} hide={mockHide} person={person} setQuals={mockSetQuals} />
      );
  
      const input = getByPlaceholderText('Qualification Title');
      fireEvent.change(input, { target: { value: 'First Aid' } });
  
      // Simulate closing modal
      fireEvent.click(getByRole('button', {
        name: /close/i
      }));

      await waitFor(() => {
        expect(mockHide).toHaveBeenCalled();
        expect(input.value).toBe('');
      })
  
  
    }); 
  });