import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PersonInfoCard from '../components/Card/PersonInfoCard';
import PersonDocumentCard from '../components/Card/PersonDocumentCard';
import PersonFormAccessCard from '../components/Card/PersonFormAccessCard';
import AddOrEditPersonModal from '../components/Modal/AddOrEditPersonModal';
import RemovePersonButton from '../components/Button/RemovePersonButton';
import { Button } from 'react-bootstrap';
import QualificationsCard from '../components/Card/QualificationsCard';
import { usePersonFile } from '../context/PersonFileContext';
const Person = () => {
  const { id } = useParams();
  const [_account, setAccount] = useState(null);
  const { setPersonFiles} = usePersonFile();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserFiles, setCurrentUserFiles] = useState(null);
  const [forms, setForms] = useState(null);
  const [timesheetAccess, setTimesheetAccess] = useState(null);
  const [quals, setQuals] = useState([]);
  const [showEditPersonModal, setShowEditPersonModal] = useState(false);
  const [crews, setCrews] = useState([]);
  
  const handleEditPerson = () => {
    setShowEditPersonModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-undef
        const response = await axios.get(`${process.env.REACT_APP_URL}/person/${id}`, {
          withCredentials: true
        });
        if (response.data.isLoggedIn) {
          const data = response.data;
          setCurrentUser(data.person);
          setCurrentUserFiles(data.files);
          setPersonFiles((prevState) => ({
            ...prevState,
            personFileTypes: data.fileTypes,
            personFiles: data.personFiles,
          }))
          setTimesheetAccess(data.timesheetAccess);
          setForms(data.forms);
          setQuals(data.quals);
          setAccount(data._account);
          setCrews(data.crews);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('An error has occuring fetching person data', error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div>
        <h1>
          {currentUser?.firstName + ' ' + currentUser?.lastName}
          <span
            id="spinny"
            style={{ display: 'none' }}
            className="spinner-grow text-secondary"
          ></span>
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          type="button"
          className="btn btn-secondary"
          onClick={handleEditPerson}
          style={{ height: '39px', marginTop: '10px', marginLeft: '10px' }}
        >
          Edit
        </Button>
        {currentUser && _account && (
          <RemovePersonButton person={currentUser} _account={_account} />
        )}
      </div>

      <br style={{ clear: 'left' }} />
      {currentUser && (
        <PersonInfoCard person={currentUser} crews={crews}/>
      )}
      <br />
      { _account && currentUser && (
        <PersonDocumentCard _account={_account} currentUser={currentUser} currentUserFiles={currentUserFiles} setCurrentUserFiles={setCurrentUserFiles}/>
      )}
      <br />
      {currentUser && quals && (
        <QualificationsCard person={currentUser} quals={quals} setQuals={setQuals} />

      )}
      {currentUser && timesheetAccess && forms && (
      <PersonFormAccessCard currentUser={currentUser} timeSheetAccess={timesheetAccess} forms={forms} updateForms={setForms} />

      )}
      {_account && currentUser && (
        <AddOrEditPersonModal show={showEditPersonModal} hideModal={() => setShowEditPersonModal(false)} _account={_account} person={currentUser} updatePerson={setCurrentUser} crews={crews} title={"Edit"} edit={true} />
      )}
    </div>
  );
};

export default Person;
