import React, { useState, useEffect } from 'react';
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

const SectionElement = ({ crews, onAddSection, formElements, setFormElements }) => {
    //const [formElements, setFormElements] = useState([]);


  const handleAddElement = (elementType) => {
    const newSection = { type: elementType, /* other properties */ };
    onAddSection(newSection);

    // Create a unique key for the new element
    const key = `${elementType}_${Date.now()}`;

    // Add the new element to the state
    setFormElements((prevElements) => [...prevElements, { key, type: elementType, label: '', value: '', isChecked: false }]);
  };

  const handleAddCrewListElement = (elementType, crew) => {
    const newSection = { type: elementType, crew: crew };
    onAddSection(newSection);

    // Create a unique key for the new element
    const key = `${elementType}_${Date.now()}`;

    // Add the new element to the state
    setFormElements((prevElements) => [...prevElements, { key, type: elementType, label: '', value: '', crew, isChecked: false }]);
  };

  const handleAddSelectlistElement = (elementType) => {
    const newSection = { type: elementType, /* other properties */ };
    onAddSection(newSection);

    // Create a unique key for the new element
    const key = `${elementType}_${Date.now()}`;

    // Add the new element to the state
    setFormElements((prevElements) => [...prevElements, { key, type: elementType, label: '', itemLabels: [], value: '', isChecked: false }]);
  };

  const handleElementChange = (key, event) => {
    const { value } = event.target;
    setFormElements((prevElements) => {
      const updatedElements = prevElements.map((element) =>
        element.key === key ? { ...element, label:value } : element
      );
      // Now use the updatedElements array for any immediate logic
      return updatedElements;
    });
  };
  

  const handleRemoveElement = (key) => {
    setFormElements((prevElements) => prevElements.filter((element) => element.key !== key));
  };

  const renderFormElements = () => {
    return formElements.map((element) => {
      switch (element.type) {
        case 'checkbox':
          return (
            <AddCheckbox
              key={element.key}
              label={element.label}
              onChange={(event) => handleElementChange(element.key, event)}
              onRemove={() => handleRemoveElement(element.key)}
            />
          );
        case 'freeform':
        return (
        <AddFreeform
            key={element.key}
            label={element.label}
            value={element.value}
            onChange={(event) => handleElementChange(element.key, event)}
            onRemove={() => handleRemoveElement(element.key)}

        />
        );
         case 'number':
            return (
                <AddNumber
                    key={element.key}
                    label={element.label}
                    value={element.value}
                    onChange={(event) => handleElementChange(element.key, event)}
                    onRemove={() => handleRemoveElement(element.key)}
                />

            ); 
         case 'date':
          return (
            <AddDate
              key={element.key}
              label={element.label}
              date={element.value}
              onChange={(event) => handleElementChange(element.key, event)}
              onRemove={() => handleRemoveElement(element.key)}

            />
            );
            
        case 'time':
            return (
                <AddTime
                    key={element.key}
                    label={element.label}
                    date={element.value}
                    onChange={(event) => handleElementChange(element.key, event)}
                    onRemove={() => handleRemoveElement(element.key)}

                />
            );
            
        case 'image':
            return (
                <AddImage
                    key={element.key}
                    label={element.label}
                    date={element.value}
                    onChange={(event) => handleElementChange(element.key, event)}
                    onRemove={() => handleRemoveElement(element.key)}

                />
            );
            
        case 'signature':
            return (
                <AddSignature
                    key={element.key}
                    label={element.label}
                    date={element.value}
                    onChange={(event) => handleElementChange(element.key, event)}
                    onRemove={() => handleRemoveElement(element.key)}

                />
                
            );
            
        case 'selectlist':
            return (
                <AddSelectlist 
                    key={element.key}
                    label={element.label}
                    items={element.items}
                    onChange={(event) => handleElementChange(element.key, event)}
                    onRemove={() => handleRemoveElement(element.key)}

                />
            );
            
        case 'crewlist':
            return (
                <AddCrewList
                    key={element.key}
                    label={element.label}
                    value={element.value}

                    crew={element.crew}
                    onChange={(event) => handleElementChange(element.key, event)}
                    onRemove={() => handleRemoveElement(element.key)}


                />
            )
         // Add other cases as needed...
        default:
          return null;
      }
    });
  };
    
  return (
    <div className="section-container">
      <Form.Control type="text" className="section-title form-control" placeholder="Enter Section Name" />
      <br />

      <div className="button-container">
        <Button className="add-check-btn btn btn-secondary" onClick={() =>handleAddElement('checkbox')}>
          <i className="fa-solid fa-circle-check"></i><span className='span-text'> Check</span>
        </Button>
        <Button className="add-freeform-btn btn btn-secondary" onClick={() => handleAddElement('freeform')}>
          <i className="fa-solid fa-font"></i><span className='span-text'> Text</span>
        </Button>
        <Button className="add-number-btn btn btn-secondary" onClick={() => handleAddElement('number')}>
          <i className="fa-solid fa-hashtag"></i><span className='span-text'> Number</span>
        </Button>
        <Button className="add-date-btn btn btn-secondary" onClick={() => handleAddElement('date')}>
          <i className="fa-solid fa-calendar-days"></i><span className='span-text'> Date</span>
        </Button>
        <Button className="add-time-btn btn btn-secondary" onClick={() => handleAddElement('time')}>
          <i className="fa-solid fa-clock"></i><span className='span-text'> Time</span>
        </Button>
        <Button className="add-image-btn btn btn-secondary" onClick={() => handleAddElement('image')}>
          <i className="fa-solid fa-image"></i><span className='span-text'> Image</span>
        </Button>
        <Button className="add-signature-btn btn btn-secondary" onClick={() => handleAddElement('signature')}>
          <i className="fa-solid fa-signature"></i><span className='span-text'> Signature</span>
        </Button>
        <Button className="add-selectlist-btn btn btn-secondary" onClick={() => handleAddSelectlistElement('selectlist')}>
          <i className="fa-solid fa-rectangle-list"></i><span className='span-text'> Select List</span>
        </Button>

        {/* Dropdown for Crew List */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-crew-list">
            <i className="fa-solid fa-rectangle-list"></i><span className='span-text'> Crew List</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {crews.map((crewMember, index) => (
              <Dropdown.Item key={index} className="crew-item" onClick={() => handleAddCrewListElement('crewlist', crewMember.name)}>{crewMember.name}</Dropdown.Item>
            ))}
            <Dropdown.Item className="crew-item"onClick={() => handleAddCrewListElement('crewlist', "All")}>All</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="form-container">
        {/* Free-form text elements will be dynamically added here */}
        {renderFormElements()}

      </div>

      <div className="dropdown-form-designer-crew">
        {/* Dropdown Form Designer Crew content */}
      </div>

      <br />
      <div className="mt-3 remove-section-btn">
        <Button className="remove-section-btn btn btn-danger">Remove Section</Button>
      </div>
      <br />
    </div>
  );
};

export default SectionElement;
