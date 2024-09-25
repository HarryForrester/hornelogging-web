import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Dropdown } from 'react-bootstrap';
import AddCheckbox from '../AddFormElements/AddCheckbox';
import AddFreeform from '../AddFormElements/AddFreeform';
import AddNumber from '../AddFormElements/AddNumber';
import AddDate from '../AddFormElements/AddDate';
import AddTime from '../AddFormElements/AddTime';
import AddImage from '../AddFormElements/AddImage';
import AddSignature from '../AddFormElements/AddSignature';
import AddSelectlist from '../AddFormElements/AddSelectList';
import AddCrewList from '../AddFormElements/AddCrewList';
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
      coordinateGetter: sortableKeyboardCoordinates,
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
          section.sectionKey === sectionKey
            ? { ...section, items: updatedItems }
            : section
        );
      });
    }
  };

  const handleAddElement = (elementType) => {
    const key = `${elementType}_${Date.now()}`;
    const newSection = { key, type: elementType, label: '', value: '', order: items.length + 1 };
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
    const { value } = event.target;
    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) =>
        section.sectionKey === sectionKey
          ? {
              ...section,
              items: section.items.map((element) =>
                element.key === elementKey ? { ...element, label: value } : element
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
        <Button className="add-check-btn btn btn-secondary" onClick={() => handleAddElement('check')}>
          <i className="fa-solid fa-circle-check"></i>
          <span className="span-text"> Check</span>
        </Button>
        <Button className="add-freeform-btn btn btn-secondary" onClick={() => handleAddElement('freeform')}>
          <i className="fa-solid fa-font"></i>
          <span className="span-text"> Text</span>
        </Button>
        <Button className="add-number-btn btn btn-secondary" onClick={() => handleAddElement('number')}>
          <i className="fa-solid fa-hashtag"></i>
          <span className="span-text"> Number</span>
        </Button>
        <Button className="add-date-btn btn btn-secondary" onClick={() => handleAddElement('date')}>
          <i className="fa-solid fa-calendar-days"></i>
          <span className="span-text"> Date</span>
        </Button>
        <Button className="add-time-btn btn btn-secondary" onClick={() => handleAddElement('time')}>
          <i className="fa-solid fa-clock"></i>
          <span className="span-text"> Time</span>
        </Button>
        <Button className="add-image-btn btn btn-secondary" onClick={() => handleAddElement('image')}>
          <i className="fa-solid fa-image"></i>
          <span className="span-text"> Image</span>
        </Button>
        <Button className="add-signature-btn btn btn-secondary" onClick={() => handleAddElement('signature')}>
          <i className="fa-solid fa-signature"></i>
          <span className="span-text"> Signature</span>
        </Button>
        <Button className="add-selectlist-btn btn btn-secondary" onClick={() => handleAddSelectlistElement('selectlist')}>
          <i className="fa-solid fa-rectangle-list"></i>
          <span className="span-text"> Select List</span>
        </Button>

        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-crew-list">
            <i className="fa-solid fa-rectangle-list"></i>
            <span className="span-text"> Crew List</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {crews.map((crewMember, index) => (
              <Dropdown.Item key={index} className="crew-item" onClick={() => handleAddCrewListElement('list', crewMember.name)}>
                {crewMember.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Item className="crew-item" onClick={() => handleAddCrewListElement('list', 'All')}>
              All
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.key)} strategy={verticalListSortingStrategy}>
          <div className="form-container">
            {renderFormElements()}
          </div>
        </SortableContext>
        <DragOverlay>
          {/* Render a drag overlay if needed */}
        </DragOverlay>
      </DndContext>

      <div className="dropdown-form-designer-crew">{/* Dropdown Form Designer Crew content */}</div>

      <br />
      <div className="mt-3 remove-section-btn">
        <Button className="remove-section-btn btn btn-danger" onClick={() => onRemoveSection(sectionKey)}>
          Remove Section
        </Button>
      </div>
      <br />
    </div>
  );
};

const SortableFormElement = ({ id, element, handleElementChange, handleRemoveElement, handleItemLabelChange, handleAddItem, handleRemoveItem, setFormElements }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'move'
  };

  const renderElement = () => {
    switch (element.type) {
      case 'check':
        return (
          <AddCheckbox
            key={element.key}
            labelValue={element.label}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
          />
        );
      case 'freeform':
        return (
          <AddFreeform
            key={element.key}
            labelValue={element.label}
            value={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}
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
    <div ref={setNodeRef} style={style} >
      <button style={handleStyle} {...attributes} {...listeners}>
        Move Item
      </button>
      {renderElement()}
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
    crew: PropTypes.string
  }).isRequired,
  handleElementChange: PropTypes.func.isRequired,
  handleRemoveElement: PropTypes.func.isRequired,
  handleItemLabelChange: PropTypes.func.isRequired,
  handleAddItem: PropTypes.func.isRequired,
  handleRemoveItem: PropTypes.func.isRequired,
  setFormElements: PropTypes.func.isRequired
};

export default SectionElement;