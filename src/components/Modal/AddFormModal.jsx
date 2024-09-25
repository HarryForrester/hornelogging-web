import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as yup from 'yup';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import SectionElement from '../FormElements/SectionElement';
import { useAlertMessage } from '../AlertMessage';

const AddFormModal = ({ crews, isVisible, onClose, selectedForm, setForms, setCrews }) => {
  const [formSections, setFormSections] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [validated, setValidated] = useState(false);
  const { setAlertMessageState } = useAlertMessage();

  const schema = yup.object().shape({
    formTitle: yup.string().required()
  });

  const handleClose = () => {
    setFormSections([]);
    setFormTitle('');
    setValidated(false);
    onClose();
  };

  useEffect(() => {
    if (selectedForm) {
      setFormTitle(selectedForm.title);
      const parsedSections = JSON.parse(selectedForm.sectionsSerialized);
      if (parsedSections && Array.isArray(parsedSections)) {
        const newSections = parsedSections.map((sectionData) => {
          const newSection = {
            sectionKey: `section_${uuidv4()}`,
            title: sectionData.title,
            items: sectionData.items.map((item) => {
              const formElement = {
                key: `item_${uuidv4()}`,
                type: item.type,
                label: item.label,
                value: item.value
              };
              if (item.type === 'selectlist') {
                formElement.items = item.items || [];
              }
              if (item.type === 'check') {
                formElement.checked = item.checked || false;
              }
              return formElement;
            })
          };
          return newSection;
        });
        setFormSections(newSections);
      }
    }
  }, [selectedForm]);

  const handleAddElement = () => {
    const key = `section_${Date.now()}`;
    setFormSections((prevSections) => [
      ...prevSections,
      {
        sectionKey: key,
        items: [],
        order: prevSections.length + 1
      }
    ]);
  };

  const handleReorderSections = (sourceIndex, destinationIndex) => {
    if (destinationIndex < 0 || destinationIndex >= formSections.length) {
      return;
    }
    const updatedSections = arrayMove(formSections, sourceIndex, destinationIndex);
    setFormSections(updatedSections);
  };

  const handleRemoveElement = (sectionKeyToRemove) => {
    setFormSections((prevSections) =>
      prevSections.filter((section) => section.sectionKey !== sectionKeyToRemove)
    );
  };

  const handleFormTitleChange = (e) => {
    setFormTitle(e.target.value);
  };

  const handleAddElementsToSection = (key, newSection) => {
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) => {
        if (section.sectionKey === key) {
          return {
            ...section,
            items: [...section.items, newSection]
          };
        }
        return section;
      });
      if (!updatedSections.some((section) => section.sectionKey === key)) {
        updatedSections.push({
          sectionKey: key,
          items: [newSection]
        });
      }
      return updatedSections;
    });
  };

  const handleSubmit = async (event) => {
    const id = new Date().getTime();
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(false);
    } else {
      setValidated(true);
      const data = {
        id: selectedForm?._id || '',
        title: formTitle,
        sections: formSections
      };
      try {
        const response = await axios.post('http://localhost:3001/submit-form', data, {
          withCredentials: true
        });
        if (response.status === 200) {
          setCrews(response.data.crew);
          setForms(response.data.forms);
          handleClose();
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: data.id === '' ? 'Form Added' : 'Form Updated',
                show: true,
                message: `Success! Form has been ${data.id === '' ? 'added' : 'updated'}`,
                background: 'success',
                color: 'white'
              }
            ]
          }));
        }
      } catch (error) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Form Added/Updated',
              show: true,
              message: `Error! An error has occured while adding/updating form. Please try again.`,
              background: 'danger',
              color: 'white'
            }
          ]
        }));
        console.error('An error has occured submitting form', error);
      }
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Modal show={isVisible} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Form Designer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} id="modal-form">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter Form Name"
              value={formTitle}
              style={{ marginBottom: '15px' }}
              onChange={(e) => handleFormTitleChange(e)}
              isInvalid={!formTitle.trim()}
              required
            />
            <Form.Control.Feedback type="invalid">Form Title is required</Form.Control.Feedback>
          </Form.Group>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                const oldIndex = formSections.findIndex((section) => section.sectionKey === active.id);
                const newIndex = formSections.findIndex((section) => section.sectionKey === over.id);
                handleReorderSections(oldIndex, newIndex);
              }
            }}
          >
            <SortableContext items={formSections.map((section) => section.sectionKey)} strategy={verticalListSortingStrategy}>
              {formSections.map((section, index) => (
                <SortableSection
                  key={section.sectionKey}
                  id={section.sectionKey}
                  index={index}
                  section={section}
                  crews={crews}
                  onAddSection={handleAddElementsToSection}
                  onRemoveSection={handleRemoveElement}
                  setFormSections={setFormSections}
                  formSections={formSections}
                  sensors={sensors}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {/* Render a drag overlay if needed */}
            </DragOverlay>
          </DndContext>

          <Form.Group>
            <Button onClick={handleAddElement}>Add new section</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" form="modal-form">
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const SortableSection = ({ id, section, crews, onAddSection, onRemoveSection, setFormSections, formSections }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    margin: '10px 0',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  const handleStyle = {
    cursor: 'move',
    padding: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginBottom: '10px'
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button style={handleStyle} {...attributes} {...listeners}>
        Move Section
      </button>
      <SectionElement
        sectionKey={section.sectionKey}
        crews={crews}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
        sectionTitle={section.title}
        items={section.items}
        setFormSections={setFormSections}
        formSections={formSections}
      />
    </div>
  );
};

SortableSection.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  section: PropTypes.shape({
    sectionKey: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        items: PropTypes.array,
        checked: PropTypes.bool
      })
    ).isRequired
  }).isRequired,
  crews: PropTypes.array.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onRemoveSection: PropTypes.func.isRequired,
  setFormSections: PropTypes.func.isRequired,
  formSections: PropTypes.array.isRequired
};

AddFormModal.propTypes = {
  crews: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedForm: PropTypes.object.isRequired,
  setForms: PropTypes.func.isRequired,
  setCrews: PropTypes.func.isRequired
};

export default AddFormModal;