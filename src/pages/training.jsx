import React, { useState, useEffect } from 'react';
import { Container, Form, Table, Button } from 'react-bootstrap';
import TrainingProgramme from '../components/TrainingProgramme';
import AddTime from '../components/AddFormElements/AddTime';
import AddTrainingRecordModal from '../components/Modal/AddTrainingRecordModal';
import AddOnjobTrainingRecordModal from '../components/Modal/AddOnjobTrainingRecordModal';
import { usePersonData } from '../components/PersonData';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import OnJobTraining from '../components/OnJobTraining';

const Training = () => {
  const [isTRModalVisble, setTRModalVisble] = useState(false); // Training Record Modal Visible
  const [isOJModalVisible, setOJModalVisible] = useState(false); // On Job Training Record Modal Visible
  const { personDataState, setPersonDataState } = usePersonData();
  const [people, setPeople] = useState([]);
  const navigate = useNavigate();
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [trainingRecords, setTrainingRecords] = useState([]);
  const [outstanding, setOutstanding] = useState([]);
  const [onjobRecords, setOnjobRecords] = useState([]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editTrainingRecordModal, setEditTrainingRecordModal] = useState(false);

  const { id } = useParams();

  const handleEdit = (record) => {
    console.log('handleEdit: ', record);
    setTRModalVisble(true);
    setSelectedRecord(record);
    setEditTrainingRecordModal(true);
  };

  const handleAdd = () => {
    setTRModalVisble(true);
    setEditTrainingRecordModal(false);
  };

  const handleEmployeeChange = async (employee) => {
    console.log('selected value: ', employee);
    setCurrentEmployeeId(employee);
    navigate(`/training/${employee}`);
    /*     try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/training/${employee}`, {
        withCredentials: true
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('meme data :', data);
        setTrainingRecords(data.trainingRecords);
        setOnjobRecords(data.onjobTraining);
        //setPeople(data.people);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('An error occurred while fetching training data', error);
    } */
  };

  const getEmployeeById = (personId) => {
    const person = people.find((person) => person._id === personId);
    return person?.name;
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = id
        ? `${process.env.REACT_APP_URL}/training/${id}`
        : `${process.env.REACT_APP_URL}/training`;

      try {
        const response = await axios.get(url, {
          withCredentials: true
        });

        if (response.data.isLoggedIn && response.status === 200) {
          const data = response.data;
          console.log('training data :', data);
          setPeople(data.people);
          setOutstanding(data.outstanding);
          setOnjobRecords(data.onjobTraining);
          setTrainingRecords(data.trainingRecords);
          setCurrentEmployeeId(id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('An error occurred while fetching training data', error);
      }
    };
    fetchData();
  }, [navigate]);
  return (
    <Container style={{ marginTop: '50px' }}>
      <AddTrainingRecordModal
        show={isTRModalVisble}
        hide={() => setTRModalVisble(false)}
        employeeId={currentEmployeeId}
        setTrainingRecords={setTrainingRecords}
        setOutstanding={setOutstanding}
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        editMode={editTrainingRecordModal}
      />

      <AddOnjobTrainingRecordModal
        showModal={isOJModalVisible}
        handleClose={() => setOJModalVisible(false)}
        userId={currentEmployeeId}
        updateOnjobTrainingRecords={setOnjobRecords}
      />
      <div>
        <h1>Training Records</h1>
      </div>

      <Form.Group>
        <Form.Label>Employee</Form.Label>
        <Form.Select
          aria-label="Training Record"
          style={{ width: '400px' }}
          onChange={(e) => handleEmployeeChange(e.target.value)}
          value={id}
        >
          <option value="">All Outstanding</option>
          {people &&
            people.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
        </Form.Select>
      </Form.Group>
      <br />
      {currentEmployeeId && (
        <>
          <TrainingProgramme
            records={trainingRecords}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
          />
          <OnJobTraining
            person={getEmployeeById(currentEmployeeId)}
            onjobs={onjobRecords}
            showModal={() => setOJModalVisible(true)}
            updateOnjobTrainingRecords={setOnjobRecords}
          />
        </>
      )}

      {!currentEmployeeId && (
        <Table striped bordered condensed>
          <thead>
            <tr>
              <th width="200">Name</th>
              <th>Training Required</th>
              <th width="130">Units to be Achieved</th>
              <th width="130">Target Date</th>
              <th width="60">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {outstanding &&
              outstanding.map((record) => (
                <tr key={record._id}>
                  <td>{getEmployeeById(record.employee)}</td>
                  <td>{record.requirement}</td>
                  <td>{record.unit}</td>
                  <td>{record.targetDate}</td>
                  <td align="center">
                    <Button variant="outline-dark" onClick={() => handleEdit(record)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

Training.propTypes = {};

export default Training;
