import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Table, Accordion, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import printTimeSheetBody from './PrintTimesheetBody';
import { useNavigate } from 'react-router-dom';
import { useAlertMessage } from '../AlertMessage';
const TimeSheetModal = ({ showModal, handleClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [crewToNameHoursMap, setCrewToNameHoursMap] = useState(new Map());
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTimesheetIds, setSelectedTimesheetIds] = useState([]);
  const modalBodyRef = useRef(null);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const navigate = useNavigate();

  useEffect(() => {
    handleSearchClickWithDefaultDates();
  }, [showModal]);

  const handleSearchClickWithDefaultDates = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7)); // Go back to the most recent Monday

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // Go forward to the upcoming Sunday

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);

    await handleSearchClick();
  };

  // Helper function to format dates (adjust this based on your API requirements)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRemoveSelected = async () => {
    const id = new Date().getTime();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/removeSelectedTimeSheetForms`,
        { selectedTimesheetIds },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Removed Timesheets',
              show: true,
              message: `Success! Selected timesheets were removed`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        handleSearchClickWithDefaultDates();
      }
    } catch (e) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Remove Timesheet',
            show: true,
            message: `Error! Removing selected timesheets. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An error occurred while removing selected timesheets', e);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };
  useEffect(() => {
    if (selectedTimesheetIds.length <= 0 && selectAll) {
      setSelectAll(false);
      setSelectedTimesheetIds([]);
    }
  }, [selectedTimesheetIds, selectAll]);

  const printModalBody = () => {
    const modalBody = modalBodyRef.current;
    printTimeSheetBody(modalBody);
  };

  const handleFormTimesheetChange = (formIds) => {
    formIds.forEach((formId) => {
      if (Array.isArray(formId)) {
        formId.forEach((innerId) => {
          if (selectedTimesheetIds.includes(innerId)) {
            // If the innerId is already selected, remove it from the selection
            setSelectedTimesheetIds((prevSelection) =>
              prevSelection.filter((id) => id !== innerId)
            );
          } else {
            // If the innerId is not selected, add it to the selection
            setSelectedTimesheetIds((prevSelection) => [...prevSelection, innerId]);
          }
        });
      } else {
        // If it's a single value, handle it similarly as before
        if (selectedTimesheetIds.includes(formId)) {
          // If the formId is already selected, remove it from the selection
          setSelectedTimesheetIds((prevSelection) => prevSelection.filter((id) => id !== formId));
        } else {
          // If the formId is not selected, add it to the selection
          setSelectedTimesheetIds((prevSelection) => [...prevSelection, formId]);
        }
      }
    });
  };

  const handleSelectAllChange = () => {
    const allTimesheetIds = timesheets.map((timesheet) => timesheet._id);

    if (selectAll) {
      // If all forms are selected, clear the selection
      setSelectedTimesheetIds([]);
    } else {
      // If not all forms are selected, select all forms
      setSelectedTimesheetIds([...allTimesheetIds]);
    }

    setSelectAll(!selectAll);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/timesheet?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTimesheets(response.data.timesheets);
        renderTimeSheet(response.data.timesheets);
      }
    } catch (error) {
      console.error('An error occurred while fetching timesheets', error);
      setCrewToNameHoursMap(new Map());
    }
  };

  const renderTimeSheet = (timesheets) => {
    setCrewToNameHoursMap(new Map());
    timesheets.forEach((timesheet) => {
      const crewId = timesheet._id;
      const crew = timesheet.crew;
      const parsedData = JSON.parse(timesheet.data);

      setCrewToNameHoursMap((prevMap) => {
        const updatedMap = new Map(prevMap);

        if (!updatedMap.has(crew)) {
          updatedMap.set(crew, {
            crewName: crew,
            data: new Map()
          });
        }

        const crewEntry = updatedMap.get(crew);

        parsedData.name.forEach((name) => {
          if (!crewEntry.data.has(name)) {
            crewEntry.data.set(name, {
              crewId: [crewId],
              hours: 0,
              uniqueDates: new Set(),
              days: 0
            });
          }

          const personData = crewEntry.data.get(name);
          if (!personData.crewId.includes(crewId)) {
            personData.crewId.push(crewId); // Add the crewId to the array
          }
          personData.hours += Number(parsedData.hours);

          const date = new Date(timesheet.date);
          const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

          if (!personData.uniqueDates.has(dateString)) {
            personData.uniqueDates.add(dateString);
            personData.days += 1;
          }
        });

        return updatedMap;
      });
    });
  };

  const togglePerson = (crew, name) => {
    setSelectedPerson(selectedPerson === `${crew}_${name}` ? null : `${crew}_${name}`);
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="timesheetModalLabel">Time Sheet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Filter/Search</Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="startDate">
                    <Form.Label>Start Date:</Form.Label>
                    <Form.Control
                      type="date"
                      className="mb-4"
                      value={startDate}
                      onChange={handleStartDate}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="endDate">
                    <Form.Label>End Date:</Form.Label>
                    <Form.Control
                      type="date"
                      className="mb-4"
                      value={endDate}
                      onChange={handleEndDate}
                    />
                  </Form.Group>
                </Col>
                <Col md={12} className="text-center">
                  <Button variant="secondary" onClick={handleSearchClick}>
                    Search
                  </Button>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <div className="modal-dialog-footer">
          <Form.Check
            type="checkbox"
            id="toggleAllCheckboxTimeSheet"
            label="Select All"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
        </div>
        <div
          className="modal-data"
          style={{ overflowY: 'auto', maxHeight: '50vh' }}
          ref={modalBodyRef}
        >
          {Array.from(crewToNameHoursMap)?.length > 0 ? (
            Array.from(crewToNameHoursMap).map(([crewId, { crewName, data }]) => (
              <Card key={crewId}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <Form.Check
                      key={crewId}
                      className="timesheet-check"
                      checked={Array.from(data.values()).every((personData) => {
                        if (
                          Array.isArray(selectedTimesheetIds) &&
                          selectedTimesheetIds.length > 0
                        ) {
                          return personData.crewId.every((id) =>
                            selectedTimesheetIds.flat().includes(id)
                          );
                        }
                        return false;
                      })}
                      onChange={() =>
                        handleFormTimesheetChange(
                          Array.from(data.values()).map((personData) => personData.crewId)
                        )
                      }
                    />
                  </div>
                  <h6 className="mb-0">{`Crew: ${crewName}`}</h6>

                  <div className="text-end">
                    <h6 className="mb-0">
                      Date: ({startDate} - {endDate})
                    </h6>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Hours</th>
                        <th>Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(data).map(([name, personData]) => (
                        <React.Fragment key={name}>
                          <tr
                            onClick={() => togglePerson(crewId, name)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{name}</td>
                            <td>{personData.hours}</td>
                            <td>{personData.days}</td>
                          </tr>
                          {selectedPerson === `${crewId}_${name}` && (
                            <tr className="timesheetPerson">
                              <td colSpan={3}>
                                {/* Render timesheets for the selected person */}
                                <Form>
                                  <Form.Label>Timesheets for {name}</Form.Label>
                                  <Table>
                                    <thead>
                                      <tr>
                                        <th>Date</th>
                                        <th>Hours</th>
                                        <th>Comments</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Ensure that personData is available within the scope */}
                                      {timesheets
                                        .filter((timesheet) => timesheet.crew === crewName) // Filter timesheets for the selected crew
                                        .map((timesheet, index) => {
                                          const parsedData = JSON.parse(timesheet.data);

                                          return (
                                            <tr key={index}>
                                              <td>{timesheet.date}</td>
                                              <td>{parsedData.hours}</td>
                                              <td>{parsedData.comments}</td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </Table>
                                </Form>
                                {/* ... */}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p>No timesheets found.</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={printModalBody}>
          Print Forms
        </Button>
        <Button variant="danger" onClick={handleRemoveSelected}>
          Remove Selected
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

TimeSheetModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default TimeSheetModal;
