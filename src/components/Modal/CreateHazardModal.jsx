import React, { useState } from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import { useHazardState } from '../HazardContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const CreateHazardModal = ({ handleSubmit }) => {
  const { hazardState, setHazardState } = useHazardState();

  const handleClose = () => {
    setHazardState((prevState) => ({
      ...prevState,
      isCreateHazardModalVisible: false,
      title: null,
      sev: 'LOW',
      reviewDate: null,
      reviewReason: null,
      category: 'Health',
      harmFields: [
        { category: '', description: [""] }
      ],
    }))
  }

  const addHarmRow = () => {
    let obj = {
      category: '',
      description: [""]
    }
    setHazardState((prevState) => ({
      ...prevState,
      harmFields: [...hazardState.harmFields, obj]
    }))
  };

  const addDescription = (harmIndex) => {
    setHazardState((prevState) => ({
      ...prevState,
      harmFields: prevState.harmFields.map((harmField, index) => ({
        ...harmField,
        description: index === harmIndex ? [...harmField.description, ''] : harmField.description,
      })),
    }));
  };

  const handleRemoveHarm = (index) => {
    let data = [...hazardState.harmFields];
    data.splice(index, 1);
    setHazardState((prevState) => ({
      ...prevState,
      harmFields: data
    }))

  };

  const handleRemoveDesc = (harmIndex, descriptionIndex) => {
    const updatedHarmFields = [...hazardState.harmFields];
    updatedHarmFields[harmIndex].description.splice(descriptionIndex, 1);
    setHazardState({ ...hazardState, harmFields: updatedHarmFields });
  };

  const handleHarmChange = (event, index) => {
    let data = [...hazardState.harmFields];
    data[index][event.target.name] = event.target.value;
    setHazardState((prevState) => ({
      ...prevState,
      harmFields: data
    }))
  };

  const handleDescriptionChange = (event, harmIndex, descriptionIndex) => {
    const newValue = event.target.value;
    const updatedHarmFields = [...hazardState.harmFields];
    updatedHarmFields[harmIndex].description[descriptionIndex] = newValue;
    setHazardState({ ...hazardState, harmFields: updatedHarmFields });
  };

  return (
    <Modal show={hazardState.isCreateHazardModalVisible} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title id="createModalLabel">{hazardState.isEditing ? 'Edit' : 'Add'} Hazard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="createHazardForm" onSubmit={handleSubmit}>
          <Form.Group as={Col} controlId="newHazardTitle">
            <Form.Label>Hazard Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="E.g. Early over-exertion"
              value={hazardState.title}
              onChange={(e) => setHazardState((prevState) => ({
                ...prevState,
                title: e.target.value
              }
              ))}
            />
          </Form.Group>
          <Row >

            <Col>
              <Form.Group as={Col} controlId="newHazardSev">
                <Form.Label>Severity</Form.Label>
                <Form.Select
                  value={hazardState.sev}
                  onChange={(e) => setHazardState((prevState) => ({
                    ...prevState,
                    sev: e.target.value
                  }))}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="newHazardCat" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={hazardState.category}
                  onChange={(e) => setHazardState((prevState) => ({
                    ...prevState,
                    category: e.target.value
                  }))}
                >
                  <option value="Health">Health</option>
                  <option value="Generic">Generic</option>
                  <option value="Environmental">Environmental</option>
                  <option value="HazardousSubstances">Hazardous Substances</option>
                  <option value="Fire">Fire</option>
                  <option value="ChainsawUse">Chainsaw Use</option>
                  <option value="TreeFelling(Manual)">Tree Felling (Manual)</option>
                  <option value="TreeFelling(Mechanical)">Tree Felling (Mechanical)</option>
                  <option value="BreakingOut">Breaking Out</option>
                  <option value="Machine Ops">Machine Ops</option>
                  <option value="MachinesinCutover">Machines in Cutover</option>
                  <option value="RiggingSupport">Rigging Support</option>
                  <option value="Poleman">Poleman</option>
                  <option value="Skidwork">Skid work</option>
                  <option value="MechanicalProcessingonSkid">Mechanical Processing on Skid</option>
                  <option value="Loading">Loading</option>
                  <option value="Office">Office</option>
                  <option value="Workshop">Workshop</option>
                  <option value="TetherSteepSlopeHarvesting">Tether Steep Slope Harvesting</option>
                </Form.Select>
              </Form.Group>
            </Col>

          </Row>

          <Form.Group controlId="newHazardReviewDate" className="mb-3">
            <Form.Label>Review Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="E.g. 3/5/2024"
              value={hazardState.reviewDate}
              onChange={(e) => setHazardState((prevState) => ({
                ...prevState,
                reviewDate: e.target.value,
              }))}
            />
          </Form.Group>

          <Form.Group controlId="newHazardReviewReason" className="mb-3">
            <Form.Label>Review Reason</Form.Label>
            <Form.Control
              type="text"
              placeholder="E.g. General Review"
              value={hazardState.reviewReason}
              onChange={(e) => setHazardState((prevState) => ({
                ...prevState,
                reviewReason: e.target.value,
              }))}
            />
          </Form.Group>

          {hazardState.harmFields.map((harm, harmIndex) => {
            return (
              <div key={harmIndex} style={{ border: '1px solid #000', borderRadius: '5px 5px 5px 5px', padding: '15px', marginBottom: '10px', position: 'relative' }}>
                <Button variant='danger' onClick={() => handleRemoveHarm(harmIndex)} style={{ position: 'absolute', top: '0', right: '0', background: 'none', border: 'none' }}><FontAwesomeIcon color="red" size="lg" icon={faCircleMinus} /></Button>
                <Row className="harm-row">

                  <Col md={5}>
                    <Form.Control
                      id={harmIndex}
                      name='category'
                      className='form-control mb-2'
                      placeholder='Category (E.g. Fire)'
                      value={harm.category}
                      onChange={(event) => handleHarmChange(event, harmIndex)}
                    />
                  </Col>

                  <Col md={12}>
                    {harm.description.map((description, descriptionIndex) => {
                      return (
                        <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px', marginBottom: '10px' }}>
                          <Form.Control
                            key={descriptionIndex}
                            id={descriptionIndex}
                            name="description"
                            as="textarea"
                            rows={1}
                            className="form-control mb-2"
                            placeholder="Description (E.g. Do not light fires)"
                            value={description}
                            onChange={(event) => handleDescriptionChange(event, harmIndex, descriptionIndex)}
                            style={{ flex: '1', borderRadius: '5px 5px 5px 5px' }}
                          />

                          {descriptionIndex !== 0 && (
                            <Button
                              onClick={() => handleRemoveDesc(harmIndex, descriptionIndex)}
                              style={{ flex: 'none', alignSelf: 'stretch', borderRadius: '5px 5px 5px 5px', backgroundColor: '#dc3545', color: '#fff', border: 'none', height: '100%', background: 'none', border: 'none' }}
                            >
                              <FontAwesomeIcon color="red" size="lg" icon={faCircleMinus} />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </Col>
                </Row>
                <Button onClick={() => addDescription(harmIndex)} style={{ background: 'none', border: 'none' }}><FontAwesomeIcon color="blue" size="lg" icon={faCirclePlus} /></Button>
              </div>
            );
          })}

          <Form.Group controlId="hazardHarms" className="mb-3">
            <Button type="button" variant="primary" className="mt-2" onClick={addHarmRow} >
              Add Harm
            </Button>
          </Form.Group>
          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateHazardModal;
