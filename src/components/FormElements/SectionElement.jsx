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
  //const [formElements, setFormElements] = useState([]);

  const handleSectionLabelChange = () => {
    console.log('handleSectionLabelChange');
  };

  /**
   * Adds a Check, Text, Number, Date, Time, Image, Singature, SelectList, and Crew List Element to given section
   */
  const handleAddElement = (elementType) => {
    const key = `${elementType}_${Date.now()}`;

    const newSection = { key, type: elementType, label: '', value: '' };

    onAddSection(sectionKey, newSection);

    // Create a unique key for the new element
  };

  const handleAddItem = (key) => {
    console.log('Before Update:', formSections);

    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) => {
        console.log('sectionKey: ', section.sectionKey);
        console.log('key: ', key);
        if (section.sectionKey === sectionKey) {
          return {
            ...section,
            items: section.items.map((element) => {
              if (element.key === key) {
                const updatedItemLabels = [...element.items, '']; // Add an empty string as a new item
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

    console.log('After Update:', formSections);
  };

  const handleRemoveItem = (key) => {
    console.log('Before Update:', formSections);

    setFormSections((prevSections) => {
      const updatedSections = prevSections.map((section) => {
        console.log('sectionKey: ', section.sectionKey);
        console.log('key: ', key);
        if (section.sectionKey === sectionKey) {
          return {
            ...section,
            items: section.items.map((element) => {
              if (element.key === key) {
                const updatedItemLabels = [...element.items];
                updatedItemLabels.pop(); // Remove the last item
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

    console.log('After Update:', formSections);
  };

  const handleAddCrewListElement = (elementType, crew) => {
    const key = `${elementType}_${Date.now()}`;

    const newSection = { key, type: elementType, label: '', value: crew };
    onAddSection(sectionKey, newSection);

    // Create a unique key for the new element

    // Add the new element to the state
    //setFormElements((prevElements) => [...prevElements, {  }]);
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
      console.log('Updated sections:', updatedSections);
      return updatedSections;
    });

    /* setFormElements((prevElements) => {
      const updatedElements = prevElements.map((element) => {
        if (element.key === key) {
          const updatedItemLabels = [...element.itemLabels];
          updatedItemLabels[index] = value;
          return { ...element, itemLabels: updatedItemLabels };
        } else {
          return element;
        }
      });
      console.log("Updated elements:", updatedElements);
  
      // Now use the updatedElements array for any immediate logic
      return updatedElements;
    });
 */
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
    return items.map((element) => {
      console.log('test: ', element);

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
        // Add other cases as needed...
        default:
          return null;
      }
    });
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
        <Button
          className="add-check-btn btn btn-secondary"
          onClick={() => handleAddElement('check')}
        >
          <i className="fa-solid fa-circle-check"></i>
          <span className="span-text"> Check</span>
        </Button>
        <Button
          className="add-freeform-btn btn btn-secondary"
          onClick={() => handleAddElement('freeform')}
        >
          <i className="fa-solid fa-font"></i>
          <span className="span-text"> Text</span>
        </Button>
        <Button
          className="add-number-btn btn btn-secondary"
          onClick={() => handleAddElement('number')}
        >
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
        <Button
          className="add-image-btn btn btn-secondary"
          onClick={() => handleAddElement('image')}
        >
          <i className="fa-solid fa-image"></i>
          <span className="span-text"> Image</span>
        </Button>
        <Button
          className="add-signature-btn btn btn-secondary"
          onClick={() => handleAddElement('signature')}
        >
          <i className="fa-solid fa-signature"></i>
          <span className="span-text"> Signature</span>
        </Button>
        <Button
          className="add-selectlist-btn btn btn-secondary"
          onClick={() => handleAddSelectlistElement('selectlist')}
        >
          <i className="fa-solid fa-rectangle-list"></i>
          <span className="span-text"> Select List</span>
        </Button>

        {/* Dropdown for Crew List */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-crew-list">
            <i className="fa-solid fa-rectangle-list"></i>
            <span className="span-text"> Crew List</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {crews.map((crewMember, index) => (
              <Dropdown.Item
                key={index}
                className="crew-item"
                onClick={() => handleAddCrewListElement('list', crewMember.name)}
              >
                {crewMember.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Item
              className="crew-item"
              onClick={() => handleAddCrewListElement('list', 'All')}
            >
              All
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="form-container">
        {/* Free-form text elements will be dynamically added here */}
        {renderFormElements()}
      </div>

      <div className="dropdown-form-designer-crew">{/* Dropdown Form Designer Crew content */}</div>

      <br />
      <div className="mt-3 remove-section-btn">
        <Button
          className="remove-section-btn btn btn-danger"
          onClick={() => onRemoveSection(sectionKey)}
        >
          Remove Section
        </Button>
      </div>
      <br />
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

export default SectionElement;
