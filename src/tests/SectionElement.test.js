import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SectionElement from '../components/FormElements/SectionElement';

describe('SectionElement Component', () => {
  const mockProps = {
    sectionKey: 'section1',
    crews: [{ name: 'Crew1' }, { name: 'Crew2' }],
    onAddSection: jest.fn(),
    onRemoveSection: jest.fn(),
    items: [],
    setFormElements: jest.fn(),
    setFormSections: jest.fn(),
    formSections: [],
    sectionTitle: 'Test Section',
    attributes: {},
    listeners: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { getByText } = render(<SectionElement {...mockProps} />);
    expect(getByText('Enter Section Title')).toBeInTheDocument();
  });

  test('calls onRemoveSection when remove button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('remove-section'));
    expect(mockProps.onRemoveSection).toHaveBeenCalledWith(mockProps.sectionKey);
  });

  test('calls handleAddCheckbox when add checkbox button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-checkbox'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'check',
        label: '',
        checked: false
      })
    );
  });

  test('calls handleAddElement when add text button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-freeform'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'freeform',
        label: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Number button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-number'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'number',
        label: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Date button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-date'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'date',
        label: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Time button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-time'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'time',
        label: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Image button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-image'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'image',
        label: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Signature button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-signature'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'signature',
        label: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Selectlist button is clicked', () => {
    const { getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-selectlist'));
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'selectlist',
        label: '',
        items: [''],
        value: '',
        isRequired: false
      })
    );
  });

  test('calls handleAddElement when Add Crewlist button is clicked', () => {
    const { getByTestId, getByRole } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-crew-list'));
    fireEvent.click(
      getByRole('button', {
        name: /crew1/i
      })
    );
    expect(mockProps.onAddSection).toHaveBeenCalledWith(
      mockProps.sectionKey,
      expect.objectContaining({
        key: expect.any(String),
        type: 'list',
        label: '',
        value: 'Crew1',
        isRequired: false
      })
    );
  });

  test('calls handleSectionTitleChange when section title is changed', () => {
    const { getByLabelText } = render(<SectionElement {...mockProps} />);
    fireEvent.change(getByLabelText('Enter Section Title'), { target: { value: 'New Title' } });
    expect(mockProps.setFormSections).toHaveBeenCalled();
  });

  test('renders crew list dropdown with correct items', () => {
    const { getByText, getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-crew-list'));
    expect(getByText('Crew1')).toBeInTheDocument();
    expect(getByText('Crew2')).toBeInTheDocument();
    expect(getByText('All')).toBeInTheDocument();
  });

  it('calls handleAddCrewListElement when a crew list item is clicked', () => {
    const { getByText, getByTestId } = render(<SectionElement {...mockProps} />);
    fireEvent.click(getByTestId('add-crew-list'));
    fireEvent.click(getByText('Crew1'));
    expect(mockProps.onAddSection).toHaveBeenCalled();
  });
});
