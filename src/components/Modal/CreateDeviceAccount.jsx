import React, { useState } from 'react';
import { useSkidModal } from './Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormLabel, FormControl, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from '../AlertMessage';

const CreateDeviceAccount = ({ crewsData, submit, show, close }) => {
  const [selectedCrew, setSelectedCrew] = useState('');
  const [people, setPeople] = useState([]);
  const [showPeopleContainer, setShowPeopleContainer] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedPersonEmail, setSelectedPersonEmail] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [emailLoginDetails, setEmailLoginDetails] = useState(false);

  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  const handleEmailChange = (event) => {
    setSelectedPersonEmail(event.target.value)
  }

  const handleCheckboxChange = () => {
    setEmailLoginDetails(!emailLoginDetails);
  };

  const handleToggleChange = (event, toggleId) => {
    const newSelectedAccountType = event.target.checked ? toggleId : '';
    setSelectedAccountType(newSelectedAccountType);
  };

  const handleCrewChange = (event) => {
    const selectedCrew = event.target.value;
    setSelectedCrew(selectedCrew);

    const selectedCrewObj = crewsData.find((crew) => crew.name === selectedCrew);

    if (selectedCrewObj && selectedCrewObj.people.length > 0) {
      setPeople(selectedCrewObj.people);
      setShowPeopleContainer(true);
      setSelectedPerson('');
      setSelectedPersonEmail('');
    } else {
      setShowPeopleContainer(false);
      setSelectedPerson('');
      setSelectedPersonEmail('');
    }
  };

  const handlePersonChange = (event) => {
    const selectedPerson = event.target.value;
    setSelectedPerson(selectedPerson);

    const selectedPersonData = people.find((person) => person.name === selectedPerson);

    if (selectedPersonData && selectedPersonData.email) {
      setSelectedPersonEmail(selectedPersonData.email);
    } else {
      setSelectedPersonEmail('');
    }
  };

  return (
    <Modal show={show} onHide={close} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="crew">
            <Form.Label>Select Crew</Form.Label>
            <Form.Control as="select" value={selectedCrew} onChange={handleCrewChange} required>
              <option disabled value="">
                Select Crew
              </option>
              {crewsData.map((crew) => (
                <option key={crew.name} value={crew.name}>
                  {crew.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {showPeopleContainer && (
            <div id="peopleContainer">
              <FormGroup controlId="person">
                <FormLabel>Select Person</FormLabel>
                <FormControl as="select" value={selectedPerson} onChange={handlePersonChange}>
                  <option disabled value="">
                    Select Person
                  </option>
                  {people.map((person) => (
                    <option key={person.name} value={person.name}>
                      {person.name}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
              <FormGroup controlId="personEmail">
                <FormLabel>Enter Email</FormLabel>
                <FormControl type="text" value={selectedPersonEmail} onChange={handleEmailChange} />
              </FormGroup>

              <label>Select Account Type</label>
              <span style={{ fontSize: '12px', color: '#888' }}>
                (Office User - Has access to employee files)
              </span>
              <div
                className="form-group"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div
                  className="form-check form-switch"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="accessLevelAdmin"
                    name="accessLevelAdmin"
                    checked={selectedAccountType === 'accessLevelAdmin'}
                    onChange={(event) => handleToggleChange(event, 'accessLevelAdmin')}
                  />
                  <label className="form-check-label" htmlFor="accessLevelAdmin">
                    Office User
                  </label>
                </div>

                <div
                  className="form-check form-switch"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="accessLevelForeman"
                    name="accessLevelForeman"
                    checked={selectedAccountType === 'accessLevelForeman'}
                    onChange={(event) => handleToggleChange(event, 'accessLevelForeman')}
                  />
                  <label className="form-check-label" htmlFor="accessLevelForeman">
                    Foreman User
                  </label>
                </div>

                <div
                  className="form-check form-switch"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="accessLevelNormal"
                    name="accessLevelNormal"
                    checked={selectedAccountType === 'accessLevelNormal'}
                    onChange={(event) => handleToggleChange(event, 'accessLevelNormal')}
                  />
                  <label className="form-check-label" htmlFor="accessLevelNormal">
                    Normal User
                  </label>
                </div>
                <div className="invalid-feedback" style={{ display: 'none' }}>
                  Please select account type.
                </div>
              </div>
              <label>Email Login Details</label>
              <input
                type="checkbox"
                className="form-check-input"
                id="emailLoginDetails"
                name="emailLoginDetails"
                checked={emailLoginDetails}
                onChange={handleCheckboxChange}
              />
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() =>
            submit(
              selectedCrew,
              selectedPerson,
              selectedPersonEmail,
              selectedAccountType,
              emailLoginDetails
            )
          }
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CreateDeviceAccount.propTypes = {
  crewsData: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};
export default CreateDeviceAccount;
