import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PersonInfoArticle from '../components/Article/PersonInfoArticle';
import PersonDocumentArticle from '../components/Article/PersonDocumentArticle';
import PersonFormAccessArticle from '../components/Article/PersonFormAccessArticle';
import EditPersonModal from '../components/Modal/EditPersonModal';
import RemovePersonButton from '../components/Button/RemovePersonButton';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { Button } from 'react-bootstrap';
import { usePersonData } from '../components/PersonData';

const Person = () => {
  const { id } = useParams();
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { personDataState, setPersonDataState } = usePersonData();
  const navigate = useNavigate();

  const handleEditPerson = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isEditPersonModalVisible: true
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/person/${id}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          const data = response.data;
          setPersonDataState((prevState) => ({
            ...prevState,
            person: data.person,
            files: data.files,
            fileTypes: data.fileTypes,
            crewTypes: data.crewTypes,
            timesheetAccess: data.timesheetAccess,
            forms: data.forms
          }));
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
    <div className="container">
      <div>
        <h1>
          {personDataState.person?.name}{' '}
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
        <RemovePersonButton person={personDataState.person} />
      </div>

      <br style={{ clear: 'left' }} />
      <PersonInfoArticle person={personDataState.person} />
      <br />
      <PersonDocumentArticle />
      <br />
      <PersonFormAccessArticle />
      <EditPersonModal />
    </div>
  );
};

export default Person;
