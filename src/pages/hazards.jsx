/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import HazardCard from '../components/Card/HazardCard';
import CreateHazardModal from '../components/Modal/CreateHazardModal';
import HazardReviewModal from '../components/Modal/HazardReviewModal';
import { useAlertMessage } from '../components/AlertMessage';
import { useConfirmationModal } from '../components/ConfirmationModalContext';

const Hazards = () => {
  const [hazards, setHazards] = useState([]);
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedHazardIds, setSelectedHazardIds] = useState([]);
  const { addToast } = useAlertMessage();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const [searchTerm, setSearchTerm] = useState('');

  const [edit, setEdit] = useState(false); // used to determine if the user is editing a hazard
  const [showAddHazardModal, setShowAddHazardModal] = useState(false); // used to determine if the add hazard modal is visible
  const [selectedHazard, setSelectedHazard] = useState(null); // used to store the selected hazard

  const resetHazard = () => {
    setSelectedHazard({
      title: '',
      sev: 'LOW',
      reviewDate: null,
      reviewReason: null,
      category: 'Health',
      harmFields: [{ category: '', description: [''] }]
    });
    setSelectAll(false);
    setSelectedHazardIds([]);
  };

  const toggleSelectAll = () => {
    setSelectAll((prevSelectAll) => {
      const allHazardIds = hazards.map((hazard) => hazard._id);
      setSelectedHazardIds(prevSelectAll ? [] : allHazardIds);
      return !prevSelectAll;
    });
  };

  const handleHazardChange = (id) => {
    const updatedSelectedHazardIds = selectedHazardIds.includes(id)
      ? selectedHazardIds.filter((hazardId) => hazardId !== id)
      : [...selectedHazardIds, id];
    setSelectedHazardIds(updatedSelectedHazardIds);
  };

  const deleteSelected = () => {
    if (selectedHazardIds.length === 0) {
      return;
    }
    const hazardNames = hazards
      .filter((hazard) => selectedHazardIds.includes(hazard._id))
      .map((hazard) => hazard.id)
      .join(',');
    console.log('delelele', hazardNames);
    setConfirmationModalState((prevState) => ({
      ...prevState,
      show: true,
      confirmed: false,
      label: 'Remove Hazard',
      message: <>Are you sure you want to remove hazard: {hazardNames}</>
    }));
  };

  useEffect(() => {
    if (!confirmationModalState.confirmed) return;

    const submit = async () => {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_URL}/deleteHazard`, {
          withCredentials: true,
          data: { hazardIds: selectedHazardIds }
        });

        if (response.status === 200) {
          resetHazard();
          setHazards(response.data.hazards);
          addToast('Hazard Removed', 'Success! Removed Hazard', 'success', 'white');
        } else {
          console.error('Error deleting hazards');
        }
      } catch (error) {
        addToast('Remove Hazard', 'Error! An error has occurred while removing hazard', 'danger');
        console.error(error);
      }
    };

    submit();
  }, [confirmationModalState.confirmed]);

  const updateSelected = () => {
    setShowReviewModal(true);
  };

  const editHazard = () => {
    const selectedHazardObj = hazards.find((hazard) => hazard._id === selectedHazardIds[0]);

    const harmFields = Object.entries(selectedHazardObj.harms).map(([category, descriptions]) => {
      return {
        category,
        description: descriptions
      };
    });
    console.log('selectedHazardObj', selectedHazardObj);
    setEdit(true); // set the edit state to true
    setShowAddHazardModal(true);
    setSelectedHazard({
      _id: selectedHazardObj._id,
      title: selectedHazardObj.title,
      sev: selectedHazardObj.sev,
      reviewDate: selectedHazardObj.reviewDate,
      reviewReason: selectedHazardObj.reviewReason,
      category: selectedHazardObj.cat,
      harmFields: harmFields
    })
  };

  const addHazard = () => {
    setShowAddHazardModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/hazard`, {
          withCredentials: true
        });
        if (response.status === 200) {
          if (response.data.isLoggedIn) {
            const data = response.data;
            setHazards(data.hazards);
          } else {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('An error has occuring fetching person data', error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      <Container style={{ marginTop: '50px' }}>
        <Row>
          <Col md={6}>
            <h2>Hazard Register</h2>
          </Col>
          <Col md={6} className="text-end">
            <Form.Control
              type="text"
              size="30"
              placeholder="Search"
              id="search-criteria"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Check
              id="selectall"
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              label="Select All"
            />
          </Col>
          <Col md={6} className="text-md-end p-3">
            {selectedHazardIds.length > 0 && (
              <>
                <Button
                  variant="outline-secondary"
                  className="selective"
                  style={{ marginRight: '8px' }}
                  onClick={deleteSelected}>
                  <i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete
                </Button>
                <Button
                  variant="outline-secondary"
                  className="selective"
                  style={{ marginRight: '8px' }}
                  onClick={updateSelected}>
                  <i className="fa fa-magic" aria-hidden="true"></i>&nbsp;Update Review
                </Button>
                <Button
                  variant="outline-secondary"
                  className="selective"
                  style={{ marginRight: '8px' }}
                  data-testid="edit-hazard"
                  onClick={editHazard}>
                  <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit Hazard
                </Button>
              </>
            )}
            <Button variant="outline-secondary" onClick={addHazard} data-testid="add-hazard">
              <i className="fa fa-plus-square-o" aria-hidden="true"></i>&nbsp;Add Hazard
            </Button>
          </Col>
        </Row>

        {hazards &&
          hazards
            .filter((hazard) => hazard.searchText.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((hazard) => (
              <HazardCard
                key={hazard._id}
                hazard={hazard}
                selectAll={selectedHazardIds.includes(hazard._id)}
                handleHazardChange={handleHazardChange}
              />
            ))}
      </Container>

      <HazardReviewModal
        show={showReviewModal}
        onHide={handleCloseReviewModal}
        selectedHazardsId={selectedHazardIds}
        hazards={hazards}
        setHazards={setHazards}
      />

      <CreateHazardModal show={showAddHazardModal} handleClose={() => setShowAddHazardModal(false)} initialValues={selectedHazard} isEditing={edit} updateHazards={setHazards} />
    </>
  );
};

export default Hazards;
