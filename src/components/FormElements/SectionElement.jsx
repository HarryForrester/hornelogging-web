import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AddCheckbox from '../AddFormElements/AddCheckbox';
import AddFreeform from '../AddFormElements/AddFreeform';
import AddNumber from '../AddFormElements/AddNumber';
import AddDate from '../AddFormElements/AddDate';
import AddTime from '../AddFormElements/AddTime';
import AddImage from '../AddFormElements/AddImage';
import AddSignature from '../AddFormElements/AddSignature';
import AddSelectlist from '../AddFormElements/AddSelectList';
import AddCrewList from '../AddFormElements/AddCrewList';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareCheck,
  faFont,
  fa9,
  faHashtag,
  faCalendarDays,
  faClock,
  faImage,
  faSignature,
  faRectangleList,
  faPeopleGroup,
  faArrowsUpDown
} from '@fortawesome/free-solid-svg-icons';
const SectionElement = ({
  sectionKey,
  crews,
  onAddSection,
  onRemoveSection,
  items,
  setFormElements,
  setFormSections,
  formSections,
  sectionTitle
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.key === active.id);
      const newIndex = items.findIndex((item) => item.key === over.id);
      const updatedItems = arrayMove(items, oldIndex, newIndex);
      setFormSections((prevSections) => {
        return prevSections.map((section) =>
          section.sectionKey === sectionKey ? { ...section, items: updatedItems } : section
        );
      });
    }
  };

  const handleAddCheckbox = (elementType) => {
    const key = `${elementType}_${Date.now()}`;
    const newSection = { key, type: elementType, label: '', checked: false, order: items.length + 1 };
    onAddSection(sectionKey, newSection);
  };

  const handleAddElement = (elementType) => {
    const key = `${elementType}_${Date.now()}`;
    const newSection = { key, type: elementType, label: '', value: '', order: items.length + 1, isRequired: false };
    onAddSection(sectionKey, newSection);
  };

  const handleAddItem = (key) => {
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) => {
        if (section.sectionKey === sectionKey) {
          return {
            ...section,
            items: section.items.map((element) => {
              if (element.key === key) {
                const updatedItemLabels = [...element.items, ''];
                return { ...element, items: updatedItemLabels };
              } else {
                return element;
              }
            })
          };
        }
        return section;
      });
      return updatedSections;
    });
  };

  const handleRemoveItem = (key) => {
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) => {
        if (section.sectionKey === sectionKey) {
          return {
            ...section,
            items: section.items.map((element) => {
              if (element.key === key) {
                const updatedItemLabels = [...element.items];
                updatedItemLabels.pop();
                return { ...element, items: updatedItemLabels };
              } else {
                return element;
              }
            })
          };
        }
        return section;
      });
      return updatedSections;
    });
  };

  const handleAddCrewListElement = (elementType, crew) => {
    const key = `${elementType}_${Date.now()}`;
    const newSection = { key, type: elementType, label: '', value: crew };
    onAddSection(sectionKey, newSection);
  };

  const handleAddSelectlistElement = (elementType) => {
    const key = `${elementType}_${Date.now()}`;
    const newSection = { type: elementType, key, label: '', items: [''], value: '' };
    onAddSection(sectionKey, newSection);
  };

  const handleElementChange = (elementKey, event) => {
    console.log('event.target', event.target);
    const { value, checked, type } = event.target;
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) =>
        section.sectionKey === sectionKey
          ? {
              ...section,
              items: section.items.map((element) =>
                element.key === elementKey
                  ? {
                      ...element,
                      label: type === 'checkbox' ? element.label : value,
                      isRequired: type === 'checkbox' ? checked : element.isRequired
                    }
                  : element
              )
            }
          : section
      );
      return updatedSections;
    });
  };

  const handleSectionTitleChange = (event) => {
    const { value } = event.target;
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) =>
        section.sectionKey === sectionKey
          ? {
              ...section,
              title: value
            }
          : section
      );
      return updatedSections;
    });
  };

  const handleItemLabelChange = (elementKey, index, event) => {
    const { value } = event.target;
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) =>
        section.sectionKey === sectionKey
          ? {
              ...section,
              items: section.items.map((element) =>
                element.key === elementKey
                  ? {
                      ...element,
                      items: element.items.map((label, idx) => (idx === index ? value : label))
                    }
                  : element
              )
            }
          : section
      );
      return updatedSections;
    });
  };

  const handleRemoveElement = (key) => {
    setFormSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.filter((element) => element.key !== key)
      }))
    );
  };

  const renderFormElements = () => {
    return items.map((element) => (
      <SortableFormElement
        key={element.key}
        id={element.key}
        element={element}
        handleElementChange={handleElementChange}
        handleRemoveElement={handleRemoveElement}
        handleItemLabelChange={handleItemLabelChange}
        handleAddItem={handleAddItem}
        handleRemoveItem={handleRemoveItem}
        setFormElements={setFormElements}
      />
    ));
  };

  return (
    <div className="section-container">
      <div className="flex-grow-1" style={{ height: '25px', marginBottom: '25px' }}>
        <Form.Control
          type="text"
          className="section-title form-control"
          placeholder="Enter Section Name"
          value={sectionTitle}
          onChange={handleSectionTitleChange}
          isInvalid={!sectionTitle}
          required
        />
        <Form.Control.Feedback type="invalid">Checkbox title is required</Form.Control.Feedback>
      </div>
      <br />

      <div className="button-container">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Checkbox</Tooltip>}>
          <Button
            className="add-check-btn btn btn-outline-secondary"
            onClick={() => handleAddCheckbox('check')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faSquareCheck} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Text</Tooltip>}>
          <Button
            className="add-freeform-btn btn btn-secondary"
            onClick={() => handleAddElement('freeform')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faFont} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Number</Tooltip>}>
          <Button
            className="add-number-btn btn btn-secondary"
            onClick={() => handleAddElement('number')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faHashtag} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Date</Tooltip>}>
          <Button
            className="add-date-btn btn btn-secondary"
            onClick={() => handleAddElement('date')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faCalendarDays} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Clock</Tooltip>}>
          <Button
            className="add-time-btn btn btn-secondary"
            onClick={() => handleAddElement('time')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faClock} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Image</Tooltip>}>
          <Button
            className="add-image-btn btn btn-secondary"
            onClick={() => handleAddElement('image')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faImage} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Signature</Tooltip>}>
          <Button
            className="add-signature-btn btn btn-secondary"
            onClick={() => handleAddElement('signature')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faSignature} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Select List</Tooltip>}>
          <Button
            className="add-selectlist-btn btn btn-secondary"
            onClick={() => handleAddSelectlistElement('selectlist')}
            style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faRectangleList} style={{ color: '#242424' }} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-add-checkbox">Add Crew List</Tooltip>}>
          <Dropdown>
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-crew-list"
              style={{ backgroundColor: 'transparent', color: 'black' }}>
              <FontAwesomeIcon icon={faPeopleGroup} style={{ color: '#242424' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {crews.map((crewMember, index) => (
                <Dropdown.Item
                  key={index}
                  className="crew-item"
                  onClick={() => handleAddCrewListElement('list', crewMember.name)}>
                  {crewMember.name}
                </Dropdown.Item>
              ))}
              <Dropdown.Item
                className="crew-item"
                onClick={() => handleAddCrewListElement('list', 'All')}>
                All
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </OverlayTrigger>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.key)}
          strategy={verticalListSortingStrategy}>
          <div className="form-container">{renderFormElements()}</div>
        </SortableContext>
        <DragOverlay>{/* Render a drag overlay if needed */}</DragOverlay>
      </DndContext>

      <div className="dropdown-form-designer-crew">{/* Dropdown Form Designer Crew content */}</div>

      <br />
      <div className="mt-3 remove-section-btn">
        <Button
          className="remove-section-btn btn btn-danger"
          onClick={() => onRemoveSection(sectionKey)}>
          Remove Section
        </Button>
      </div>
      <br />
    </div>
  );
};

const SortableFormElement = ({
  id,
  element,
  handleElementChange,
  handleRemoveElement,
  handleItemLabelChange,
  handleAddItem,
  handleRemoveItem,
  setFormElements
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const renderElement = () => {
    console.log('element', element);    
    switch (element.type) {
      case 'check':
        return (
          <AddCheckbox
            key={element.key}
            labelValue={element.label}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
            attributes={attributes}
            listeners={listeners}
          />
        );
      case 'freeform':
        return (
          <AddFreeform
            key={element.key}
            labelValue={element.label}
            isRequired={element.isRequired}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
            attributes={attributes}
            listeners={listeners}
          />
        );
      case 'number':
        return (
          <AddNumber
            key={element.key}
            labelValue={element.label}
            value={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
            attributes={attributes}
            listeners={listeners}
          />
        );
      case 'date':
        return (
          <AddDate
            key={element.key}
            labelValue={element.label}
            date={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
            attributes={attributes}
            listeners={listeners}
          />
        );
      case 'time':
        return (
          <AddTime
            key={element.key}
            labelValue={element.label}
            date={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
            attributes={attributes}
            listeners={listeners}
          />
        );
      case 'image':
        return (
          <AddImage
            key={element.key}
            labelValue={element.label}
            date={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
          />
        );
      case 'signature':
        return (
          <AddSignature
            key={element.key}
            labelValue={element.label}
            date={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
          />
        );
      case 'selectlist':
        return (
          <AddSelectlist
            itemKey={element.key}
            label={element.label}
            items={element.items}
            onChange={(event) => handleElementChange(element.key, event)}
            onItemLabelChange={handleItemLabelChange}
            addItem={() => handleAddItem(element.key)}
            onRemove={() => handleRemoveElement(element.key)}
            onRemoveItem={handleRemoveItem}
            setFormElements={setFormElements}
          />
        );
      case 'list':
        return (
          <AddCrewList
            key={element.key}
            label={element.label}
            value={element.value}
            crew={element.crew}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
          />
        );
      default:
        return null;
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ? `${transition}, opacity 0.2s ease-in-out` : 'opacity 0.2s ease-in-out',
    margin: isDragging ? '10px' : '20px',
    backgroundColor: isDragging ? '#e6f7ff' : '#ffffff', // Highlight when dragging
    border: '1px solid #cccccc',
    borderRadius: '4px',
    opacity: isDragging ? 0.5 : 1 // Smooth transition for opacity
  };

  return (
    <div ref={setNodeRef} style={style}>
        {renderElement(attributes, listeners)}
    </div>
  );
};

SectionElement.propTypes = {
  sectionKey: PropTypes.string.isRequired,
  crews: PropTypes.array.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onRemoveSection: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  setFormElements: PropTypes.func.isRequired,
  formSections: PropTypes.array.isRequired,
  setFormSections: PropTypes.func.isRequired,
  sectionTitle: PropTypes.string.isRequired
};

SortableFormElement.propTypes = {
  id: PropTypes.string.isRequired,
  element: PropTypes.shape({
    key: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    items: PropTypes.array,
    checked: PropTypes.bool,
    crew: PropTypes.string,
    isRequired: PropTypes.bool
  }).isRequired,
  handleElementChange: PropTypes.func.isRequired,
  handleRemoveElement: PropTypes.func.isRequired,
  handleItemLabelChange: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  handleRemoveItem: PropTypes.func.isRequired,
  setFormElements: PropTypes.func.isRequired
};

export default SectionElement;
