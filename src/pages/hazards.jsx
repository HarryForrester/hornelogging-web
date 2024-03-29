import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PersonInfoArticle from '../components/Article/PersonInfoArticle';
import PersonDocumentArticle from '../components/Article/PersonDocumentArticle';
import PersonFormAccessArticle from '../components/Article/PersonFormAccessArticle';
import EditPersonModal from '../components/Modal/EditPersonModal';
import RemovePersonButton from '../components/Button/RemovePersonButton';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { usePersonData } from '../components/PersonData';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import HazardCard from '../components/Card/HazardCard';
import CreateHazardModal from '../components/Modal/CreateHazardModal';
import HazardReviewModal from '../components/Modal/HazardReviewModal';
import { useHazardState } from '../components/HazardContext';
import UpdateReviewHazardModal from '../components/Modal/UpdateReviewHazardModal';
import { useAlertMessage } from '../components/AlertMessage';
import { useConfirmationModal } from '../components/ConfirmationModalContext';

const Hazards = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { personDataState, setPersonDataState } = usePersonData();
  const { hazardState, setHazardState } = useHazardState();
  const [hazards, setHazards] = useState([]);
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedHazardIds, setSelectedHazardIds] = useState([]);
  const { alertMesssageState, setAlertMessageState } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const [searchTerm, setSearchTerm] = useState('');

  const resetHazard = () => {
    setHazardState({
      isCreateHazardModalVisible: false,
      isUpdateReviewModalVisible: false,
      title: null,
      sev: 'LOW',
      reviewDate: null,
      reviewReason: null,
      category: 'Health',
      harmFields: [{ category: '', description: [''] }]
    });
    setSelectAll(false);
    setSelectedHazardIds([]);
  };

  /**
   * Handles the submission of hazard review updates
   * @param {string} comment - The review comment given by user
   */
  const handleUpateReviewSubmit = async (comment) => {
    const id = new Date().getTime();
    const hazardObj = {
      _ids: selectedHazardIds,
      comment: comment
    };

    try {
      const response = await axios.post(process.env.REACT_APP_URL + '/hazardreview', hazardObj, {
        withCredentials: true
      });
      var message;

      if (response.status === 200) {
        if (selectedHazardIds.length === 1) {
          const hazardObj = hazards.find((hazard) => hazard._id == selectedHazardIds[0]);
          message = `Success! ${hazardObj.title} review comment has been updated`;
        } else {
          message = `Success! multiple hazard review comments has been updated`;
        }
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Hazard Review Updated',
              show: true,
              message: message,
              background: 'success',
              color: 'white'
            }
          ]
        }));
        setHazards(response.data.hazards);
        resetHazard();
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Add Person',
            show: true,
            message: `Error! An error has occured while updating hazard review`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error updating review:', error);
    } finally {
      setShowSpinner(false);
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  /**
   * Handles the submission of adding/editing a hazard
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    const id = new Date().getTime();
    setShowSpinner(true);
    e.preventDefault();

    try {
      var response;
      if (hazardState.isEditing) {
        response = await axios.post(process.env.REACT_APP_URL + '/hazardedit', hazardState, {
          withCredentials: true
        });
      } else {
        response = await axios.post(process.env.REACT_APP_URL + '/hazardcreate', hazardState, {
          withCredentials: true
        });
      }

      if (response.status === 200) {
        setHazards(response.data.hazards);
        resetHazard();

        if (hazardState.isEditing) {
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: `Hazard Updated`,
                show: true,
                message: `Success! ${hazardState.title} has been updated`,
                background: 'success',
                color: 'white'
              }
            ]
          }));
        } else {
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Hazard Added',
                show: true,
                message: `Success! ${hazardState.title} has beeen added`,
                background: 'success',
                color: 'white'
              }
            ]
          }));
        }
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Add Hazard',
            show: true,
            message: `Error! An Error has occurred adding editing or adding ${hazardState.title} hazard`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
    } finally {
      setTimeout(() => {
        setShowSpinner(false);
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
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

    setConfirmationModalState((prevState) => ({
      ...prevState,
      show: true,
      confirmed: false,
      label: 'Remove Hazard',
      message: <>Are you sure you want to remove hazard:</>
    }));
  };

  useEffect(() => {
    const submit = async () => {
      if (confirmationModalState.confirmed) {
        const id = new Date().getTime();

        axios
          .delete(process.env.REACT_APP_URL + '/deleteHazard', {
            withCredentials: true,
            data: { hazardIds: selectedHazardIds }
          })
          .then((response) => {
            if (response.status === 200) {
              resetHazard();
              setHazards(response.data.hazards);
              setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: [
                  ...prevState.toasts,
                  {
                    id: id,
                    heading: 'Hazard Removed',
                    show: true,
                    message: `Success! Removed Hazard`,
                    background: 'success',
                    color: 'white'
                  }
                ]
              }));
              setConfirmationModalState((prevState) => ({
                ...prevState,
                confirmed: false
              }));
            } else {
              console.error('Error deleting hazards');
            }
          })
          .catch((error) => {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: [
                ...prevState.toasts,
                {
                  id: id,
                  heading: 'Remove Hazard',
                  show: true,
                  message: `Error! An error has occured while removing hazard`,
                  background: 'danger',
                  color: 'white'
                }
              ]
            }));
            console.error(error);
          })
          .finally(() => {
            setTimeout(() => {
              setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: prevState.toasts.filter((toast) => toast.id !== id)
              }));
            }, 10000);
          });
      }
    };
    submit();
  }, [confirmationModalState.confirmed]);

  const updateSelected = () => {
    console.log('updateSelected called');

    console.log('memes: ', selectedHazardIds);

    setHazardState((prevState) => ({
      ...prevState,
      isUpdateReviewModalVisible: true
    }));
  };

  const editHazard = () => {
    console.log('editHazard called');
    const selectedHazardObj = hazards.find((hazard) => hazard._id === selectedHazardIds[0]);

    const harmFields = Object.entries(selectedHazardObj.harms).map(([category, descriptions]) => {
      return {
        category,
        description: descriptions
      };
    });

    setHazardState((prevState) => ({
      ...prevState,
      isCreateHazardModalVisible: true,
      isEditing: true,
      _id: selectedHazardObj._id,
      title: selectedHazardObj.title,
      sev: selectedHazardObj.sev,
      reviewDate: selectedHazardObj.reviewDate,
      reviewReason: selectedHazardObj.reviewReason,
      category: selectedHazardObj.cat,
      harmFields: harmFields
    }));

    console.log('selected hazard :$: ', selectedHazardObj);
  };

  const addHazard = () => {
    console.log('add Hazard called');
    setHazardState((prevState) => ({
      ...prevState,
      isCreateHazardModalVisible: true,
      isEditing: false
    }));
  };

  //HazardReviewModal
  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleReviewSubmit = (comment) => {
    // Process the comment as needed
    console.log('Submitted comment:', comment);
    // Close the modal
    handleCloseReviewModal();
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
            console.log('data: ', data.hazards);
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
      <Container>
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
                  onClick={deleteSelected}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete
                </Button>
                <Button
                  variant="outline-secondary"
                  className="selective"
                  style={{ marginRight: '8px' }}
                  onClick={updateSelected}
                >
                  <i className="fa fa-magic" aria-hidden="true"></i>&nbsp;Update Review
                </Button>
                <Button
                  variant="outline-secondary"
                  className="selective"
                  style={{ marginRight: '8px' }}
                  onClick={editHazard}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit Hazard
                </Button>
              </>
            )}
            <Button variant="outline-secondary" onClick={addHazard}>
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
        onSubmit={handleReviewSubmit}
      />

      <CreateHazardModal handleSubmit={handleSubmit} />
      <UpdateReviewHazardModal submit={handleUpateReviewSubmit} />
    </>
  );
};

export default Hazards;
