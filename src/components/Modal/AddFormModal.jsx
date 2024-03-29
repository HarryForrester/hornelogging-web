import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as formik from 'formik';
import * as yup from 'yup';

import SectionElement from '../FormElements/SectionElement';
import { useAlertMessage } from '../AlertMessage';

const AddFormModal = ({ crews, isVisible, onClose, selectedForm, setForms, setCrews }) => {
  const [formSections, setFormSections] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [validated, setValidated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { Formik } = formik;

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
      // Update the form title
      setFormTitle(selectedForm.title);

      console.log('selectedForm.sectionsSerialized: ', selectedForm);

      // Parse and update the form sections
      const parsedSections = JSON.parse(selectedForm.sectionsSerialized);
      console.log('parsed sections: ', parsedSections);

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

        console.log('new Sections:', newSections);

        // Update the form sections
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
        items: []
      }
    ]);
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
    console.log('key:', key);
    setFormSections((prevSections) => {
      // Check if any section has the specified key
      const updatedSections = prevSections.map((section) => {
        if (section.sectionKey === key) {
          // If the section matches the key, update its formElements array
          return {
            ...section,
            items: [...section.items, newSection]
          };
        }
        return section;
      });

      // If no section matched the key, add a new section with the specified key
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
    setShowSpinner(true);
    const id = new Date().getTime();
    console.log('formy:', formSections);
    event.preventDefault();

    const form = event.currentTarget;

    console.log('the form :', form);
    if (form.checkValidity() === false) {
      console.log('not vatiated');
      event.stopPropagation();
      setValidated(false);
    } else {
      setValidated(true);
      const data = {
        id: selectedForm?._id || '',
        title: formTitle,
        sections: formSections
      };

      console.log('hahahahaha', data);
      console.log('meow meow meow');

      try {
        const response = await axios.post('http://localhost:3001/submit-form', data, {
          withCredentials: true
        });

        if (response.status === 200) {
          console.log('Success!!@', response.data);
          setCrews(response.data.crew);
          setForms(response.data.forms);
          handleClose();

          if (data.id === '') {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: [
                ...prevState.toasts,
                {
                  id: id,
                  heading: 'Form Added',
                  show: true,
                  message: `Success! Form has been added`,
                  background: 'success',
                  color: 'white'
                }
              ]
            }));
          } else {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: [
                ...prevState.toasts,
                {
                  id: id,
                  heading: 'Form Updated',
                  show: true,
                  message: `Success! Form has been updated`,
                  background: 'success',
                  color: 'white'
                }
              ]
            }));
          }
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
      } finally {
        setShowSpinner(false);

        setTimeout(() => {
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: prevState.toasts.filter((toast) => toast.id !== id)
          }));
        }, 10000);
      }
    }
  };

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
              isInvalid={!formTitle.trim()} // Check if formTitle is empty or contains only whitespace
              required
            />
            <Form.Control.Feedback type="invalid">Form Title is required</Form.Control.Feedback>
          </Form.Group>

          {formSections.map((section) => (
            <SectionElement
              key={section.sectionKey}
              sectionKey={section.sectionKey}
              crews={crews}
              onAddSection={handleAddElementsToSection}
              onRemoveSection={handleRemoveElement}
              sectionTitle={section.title}
              items={section.items}
              setFormSections={setFormSections}
              formSections={formSections}
            />
          ))}

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

AddFormModal.propTypes = {
  crews: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedForm: PropTypes.object.isRequired,
  setForms: PropTypes.func.isRequired,
  setCrews: PropTypes.func.isRequired
};

export default AddFormModal;
