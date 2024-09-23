import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSkid } from '../context/SkidContext';
import AddCutPlanModal from '../components/Modal/AddCutPlanModal';
import React from 'react';

jest.mock('../context/SkidContext');

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx)
  };
}

describe('AddCutPlanModal', () => {
  const mockSetSkidState = jest.fn();
  beforeEach(() => {
    useSkid.mockReturnValue({
      skidState: {
        formik: {
          values: {
            selectedCutPlan: null
          }
        }
      },
      setSkidState: mockSetSkidState
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AddCutPlanModal when cutPlanModalVisible is true', () => {
    useSkid.mockReturnValue({
      skidState: { cutPlanModalVisible: true, skidModalVisible: false },
      setSkidState: jest.fn()
    });

    render(<AddCutPlanModal showModal={true} handleClose={jest.fn()} />);

    expect(screen.getByText(/Add Cut Plan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload PDF:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/File Name:/i)).toBeInTheDocument();
  });

  test('does not render AddCutPlanModal when cutPlanModalVisible is false', () => {
    render(<AddCutPlanModal showModal={false} handleClose={jest.fn()} />);

    expect(screen.queryByText(/Add Cut Plan/i)).not.toBeInTheDocument();
  });

  test('should call submitCutPlan and reset the form on valid submission', async () => {
    render(<AddCutPlanModal showModal={true} handleClose={jest.fn()} />);

    await waitFor(async () => {
      const fileNameInput = screen.getByRole('textbox', {
        name: /file name:/i
      });
      await userEvent.type(fileNameInput, 'Cut Plan');
    });

    // Find and upload a file
    const fileInput = screen.getByLabelText(/upload pdf:/i);
    const dummyFile = new File(['dummy content'], 'example.pdf', {
      type: 'application/pdf',
      lastModified: new Date('2023-09-22').getTime()
    });
    await userEvent.upload(fileInput, dummyFile);
    // Set the file name
    //await userEvent.type(screen.getByLabelText(/File Name:/i), 'MyCutPlan');

    // Click on save button
    await userEvent.click(screen.getByText(/Save changes/i));

    await waitFor(() => {
      // Verify setSkidState was called
      expect(mockSetSkidState).toHaveBeenCalledTimes(1);
    });
  });

  test('close button hides the modal and reopens the skid modal', async () => {
    const mockHandleClose = jest.fn()
    const { user } = setup(<AddCutPlanModal showModal={true} handleClose={mockHandleClose} />);

    const closeButton = screen.getByRole('button', {
      name: /close/i
    });

    await user.click(closeButton);

    await waitFor(() => {
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });
  
    test('validation error shows when file name is empty on submit', async () => {
        const { user } = setup(<AddCutPlanModal showModal={true} handleClose={jest.fn()} />);
        const submitButton = screen.getByRole('button', {
        name: /save changes/i
        });

        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/file name is required/i)).toBeInTheDocument();
        })
    });

    test('validation error shows when file is empty on submit', async () => {
        const { user } = setup(<AddCutPlanModal showModal={true} handleClose={jest.fn()} />);

        const fileName = screen.getByRole('textbox', {
            name: /file name:/i
        });

        await user.type(fileName, 'file1.pdf'); 

        const submitButton = screen.getByRole('button', {
            name: /save changes/i
        });

        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/file is required/i)).toBeInTheDocument();
        })
    }); 
});
