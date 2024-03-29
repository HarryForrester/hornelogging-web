import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Accordion, Button, Card, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckboxElement from '../FormElements/CheckboxElement';
import FreeformElement from '../FormElements/FreeformElement';
import NumberElement from '../FormElements/NumberElement';
import ListElement from '../FormElements/ListElement';
import DateElement from '../FormElements/DateElement';
import TimeElement from '../FormElements/TimeElement';
import SelectlistElement from '../FormElements/SelectlistElement';
import ImageElement from '../FormElements/ImageElement';
import SignatureElement from '../FormElements/SignatureElement';

import printBody from './PrintModalBody';

const FilledFormsModal = ({ forms, setForms, formId, isVisible, onClose }) => {
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFormsIds, setSelectedFormsIds] = useState([]);
  const modalBodyRef = useRef(null);
  const navigate = useNavigate();

  console.log('haah: ', forms);

  const printModalBody = () => {
    const modalBody = modalBodyRef.current;
    printBody(modalBody);
  };

  const removeSelected = async () => {
    console.log('removeSelected pressed!');
    console.log('selected forms: ', selectedFormsIds);
    console.log('formID: ', formId);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/removeSelectedForms`,
        { selectedForms: selectedFormsIds, formId: formId },
        {
          withCredentials: true
        }
      );
      if (response.status === 200) {
        if (response.data.isLoggedIn) {
          console.log('the fucking data: ', response.data);
          setForms(response.data.matchingForms);
          //setCrews(response.data.crew);
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('An error has occuring fetching person data', error);
    }
  };

  // Handle the "Select All" checkbox change event
  const handleSelectAllChange = () => {
    if (selectAll) {
      // If all forms are selected, clear the selection
      setSelectedFormsIds([]);
    } else {
      // If not all forms are selected, select all forms
      setSelectedFormsIds(forms.map((form) => form._id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual form checkbox change event
  const handleFormCheckboxChange = (formId) => {
    if (selectedFormsIds.includes(formId)) {
      // If the form is already selected, remove it from the selection
      setSelectedFormsIds(selectedFormsIds.filter((id) => id !== formId));
    } else {
      // If the form is not selected, add it to the selection
      setSelectedFormsIds([...selectedFormsIds, formId]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value.toLowerCase());
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value.toLowerCase());
  };

  const formatFormDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const formattedTime = date.toLocaleString('en-US', options);
    return `${day}/${month}/${year}, ${formattedTime}`;
  };

  const renderForms = () => {
    // ... your existing logic for rendering forms
    console.log('the forms :) : ', forms);

    // Example: rendering a message if no forms found
    if (!forms || forms.length === 0) {
      return <p className="text-center text-muted">No forms found</p>;
    }

    const filteredForms = forms.filter((form) => {
      const lowerCaseSearch = searchValue.toLowerCase();
      const formData = JSON.parse(form.data);
      const formattedDate = formatFormDate(form.date);

      console.log('Form Date:', form.date);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      // Check if the search term matches any relevant data in the form
      const matchesSearch =
        form.user.toLowerCase().includes(lowerCaseSearch) ||
        form.crew.toLowerCase().includes(lowerCaseSearch) ||
        formattedDate.includes(lowerCaseSearch) ||
        formData.sectionsSerialized.some((section) =>
          section.items.some((item) => item.label.toLowerCase().includes(lowerCaseSearch))
        );

      // Check if the form date is within the specified date range
      const isWithinDateRange =
        (!startDate || new Date(form.date) >= new Date(startDate)) &&
        (!endDate || new Date(form.date) <= new Date(endDate));

      console.log('Matches Search:', matchesSearch);
      console.log('Within Date Range:', isWithinDateRange);

      return matchesSearch && isWithinDateRange;
    });

    console.log('Filtered Forms:', filteredForms);

    return filteredForms.map((form) => {
      const formId = form._id;
      const formData = JSON.parse(form.data);

      // Extracting date information
      const date = new Date(form.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      // Formatting time
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      const formattedTime = date.toLocaleString('en-US', options);

      // Creating formatted date string
      const formattedDate = `${day}/${month}/${year}, ${formattedTime}`;

      return (
        <div key={form._id} className="border rounded mb-4" data-form-id={form._id}>
          <form className="form-view p-4">
            {/* Header */}
            <div
              className="header-div p-1 mb-2"
              style={{
                backgroundColor: 'rgb(204, 204, 204)',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              {/* Remove Toggle */}
              <Form.Check
                type="checkbox"
                className={'form-remove-toggle'}
                style={{ marginLeft: '10px' }}
                checked={selectedFormsIds.includes(form._id)}
                onChange={() => handleFormCheckboxChange(form._id)}
              />

              {/* Info Div */}
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                <h3 className="section-date" style={{ fontSize: '10px' }}>
                  Date: {formattedDate}
                </h3>
                <h4 className="section-user" style={{ fontSize: '10px' }}>
                  User: {form.user}
                </h4>
                <h4 className="section-crew" style={{ fontSize: '10px' }}>
                  Crew: {form.crew}
                </h4>
              </div>
            </div>

            {/* Sections */}
            {formData.sectionsSerialized.map((section) => (
              <div key={section.title} className="mb-3">
                <h5 className="section-title">{section.title}</h5>

                {/* Section Items */}
                {section.items.map((item) => {
                  console.log('item:', item);
                  // Render each form element based on item type
                  switch (item.type) {
                    case 'check':
                      return CheckboxElement(item.value, item.checked);
                    case 'freeform':
                      return FreeformElement(item.label, item.value);
                    case 'number':
                      return NumberElement(item.label, item.value);
                    case 'list':
                      return ListElement(item.label, item.selectedPerson);
                    case 'date':
                      return DateElement(item.label, item.value);
                    case 'time':
                      return TimeElement(item.label, item.value);
                    case 'selectlist':
                      return SelectlistElement(item.label, item.selected);
                    case 'image':
                      return ImageElement(item.label, item.image);
                    case 'signature':
                      return SignatureElement(item.label, item.image);
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
          </form>
        </div>
      );
    });
  };

  return (
    <Modal show={isVisible} onHide={onClose} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>View Forms</Modal.Title>
      </Modal.Header>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Sort</Accordion.Header>
          <Accordion.Body>
            <Form className="search-container p-2">
              <Form.Control
                id="searchInput"
                className="mb-2"
                placeholder="Search forms... (e.g. 5/7/2023, etc)"
                onChange={handleSearchChange}
              />
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Label htmlFor="startDateInput" className="dateInput">
                    Start Date
                  </Form.Label>
                  <Form.Control
                    id="startDateInput"
                    type="date"
                    className="mb-2"
                    onChange={handleStartDateChange}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="endDateInput" className="dateInput">
                    End Date
                  </Form.Label>
                  <Form.Control
                    id="endDateInput"
                    type="date"
                    className="mb-2"
                    onChange={handleEndDateChange}
                  />
                </Col>
              </Row>
              <Row className="g-2">
                <Col md={6}>
                  <Button id="filterByDate" className="btn-secondary">
                    Filter by Day
                  </Button>
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Form.Check checked={selectAll} label="Select All" onChange={handleSelectAllChange} />

      <Modal.Body style={{ overflowY: 'auto', maxHeight: '70vh' }}>
        <Form>
          <div ref={modalBodyRef}>{renderForms()}</div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => printModalBody()}>Print Selected</Button>
        <Button variant="danger" onClick={removeSelected}>
          Remove Selected
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

FilledFormsModal.propTypes = {
  forms: PropTypes.array.isRequired,
  setForms: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FilledFormsModal;
