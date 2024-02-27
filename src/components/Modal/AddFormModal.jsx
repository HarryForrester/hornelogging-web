import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

import SectionElement from '../FormElements/SectionElement';

const AddFormModal = ({crews}) => {
    const [showSection, setShowSection] = useState(false);
    const [formSections, setFormSections] = useState([]);

    const [formElements, setFormElements] = useState([]);

   
    

    const handleButtonClick = () => {
        setShowSection(true);
      };

    const handleAddSection = (newSection) => {
        console.log("newSection: " + JSON.stringify(newSection))
    setFormSections((prevSections) => [...prevSections, newSection]);
    };

    const handleSubmit = () => {
        console.log("formy:", formElements)
    }

  

  return (
      <Modal show={false} backdrop="static" size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Form Designer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Control 
                        type="text"
                        placeholder="Enter Form Name"
                    />
                </Form.Group>
                {showSection && <SectionElement crews={crews} onAddSection={handleAddSection} formElements={formElements} setFormElements={setFormElements} />}                
                <Form.Group>
                    <Button onClick={handleButtonClick}>Add new section</Button>

                </Form.Group>
            </Form> 
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default AddFormModal;
