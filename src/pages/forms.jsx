import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import FormTemplateModal from '../components/Modal/FormTemplateModal';
import AddFormModal from '../components/Modal/AddFormModal';
import FilledFormsModal from '../components/Modal/FilledFormsModal';
import TimeSheetModal from '../components/Modal/TimeSheetModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAlertMessage } from '../components/AlertMessage';

const Forms = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [crews, setCrews] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFilledForms, setSelectedFilledForms] = useState([]);
  const [isFormTemplateModalVisible, setFormTemplateModalVisible] = useState(false);
  const [isCreateFormModalVisibile, setCreateFormModalVisible] = useState(false);
  const [isFilledFormsModalVisible, setFilledFormsModalVisible] = useState(false);
  const [isTimeSheetModalVisible, setTimeSheetModalVisible] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server

  const handleShowTimeSheetModal = () => setTimeSheetModalVisible(true);
  const handleHideTimeSheetModal = () => setTimeSheetModalVisible(false);

  const [isEditing, setIsEditing] = useState(false);
  const [orderedIds, setOrderedIds] = useState([]);
  const [draggedItemId, setDraggedItemId] = useState(null);

  const openCreateFormModal = () => {
    console.log('openCreateFormModal');
    setCreateFormModalVisible(true);
  };

  const openTimeSheetModal = () => {
    console.log('openTimeSheetModal');
    handleShowTimeSheetModal();
  };

  const handleEditOrder = () => {
    console.log('handleEditOrder enabled');
    setIsEditing(true);
  };

  const handleSaveOrder = () => {
    setIsEditing(false);
    const list = document.getElementById('sortable-list');
    list.classList.remove('sortable');
    console.log('eyah ode', Array.from(list.querySelectorAll('.sortable-list')));
    const newOrderedIds = forms.map((item) => item._id);
    console.log('Ordered IDs:', newOrderedIds);
    setOrderedIds(newOrderedIds);

    updateDatabasePosition(newOrderedIds);
  };

  const updateDatabasePosition = (orderedIds) => {
    const id = new Date().getTime();

    axios
      .post(`${process.env.REACT_APP_URL}/formPosition`, { orderedIds }, { withCredentials: true })
      .then((response) => {
        console.log(response.data.message);
        // If needed, handle successful response
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Form Position Updated',
              show: true,
              message: `Success! Form position has been updated`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      })
      .catch((error) => {
        console.error('Failed to update document positions:', error);
        // If needed, handle error
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Error: Form Position Update',
              show: true,
              message: `Success! Form position could not be updated, Please try again`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      });
  };
  const confirmDeleteFormTemplate = (id) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    deleteFormTemplate(id);
  }

  const deleteFormTemplate = async (formId) => {
    setShowSpinner(true);
    const id = new Date().getTime();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/deleteFormTemplate`,
        { id: formId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setCrews(response.data.crew);
        setForms(response.data.forms);

        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Form Removed',
              show: true,
              message: `Success! Form has been deleted`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Remove Form',
            show: true,
            message: `Error! An error has occured while removing form. Please try again.`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An error occurred while deleting form');
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

  const openEditFormModal = (form) => {
    console.log('formy my cuntL :m', form);
    setCreateFormModalVisible(true);
    setSelectedForm(form);
  };

  const openViewFormModal = (form) => {
    console.log('openViewFormModal', form);
    setSelectedForm(form);
    setFormTemplateModalVisible(true);

    const sections = JSON.parse(form.sectionsSerialized);

    console.log('sections: ', sections);
  };

  const openFormDocsModal = async (form) => {
    setFilledFormsModalVisible(true);
    console.log('openFormDocsModal', form);
    try {
      let url = `http://localhost:3001/findCompletedForms?formId=${encodeURIComponent(form._id)}`;

      const response = await axios.get(url, { withCredentials: true });

      if (response.status === 200) {
        console.log('Success! ', response.data);
        setSelectedFormId(response.data.docs[0].formId);
        setSelectedFilledForms(response.data.docs);
      }
    } catch (error) {
      console.error('An error has occurred while fetching form data', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/forms`, {
          withCredentials: true
        });
        if (response.status === 200) {
          if (response.data.isLoggedIn) {
            setForms(response.data.forms);
            setCrews(response.data.crew);
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

  const onDragStart = (e, id) => {
    if (isEditing) {
      setDraggedItemId(id);
      e.dataTransfer.setData('text/custom-id', id);
      e.dataTransfer.effectAllowed = 'move';
    } else {
      e.preventDefault();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, id) => {
    e.preventDefault();
    if (draggedItemId && id !== draggedItemId) {
      const updatedForms = forms.slice();
      const draggedItemIndex = updatedForms.findIndex((item) => item._id === draggedItemId);
      const targetItemIndex = updatedForms.findIndex((item) => item._id === id);
      const [removed] = updatedForms.splice(draggedItemIndex, 1);
      updatedForms.splice(targetItemIndex, 0, removed);
      setForms(updatedForms);
      setDraggedItemId(null);
    }
  };

  const editOrder = () => {
    setIsEditing(true);
  };

  const saveOrder = () => {
    setIsEditing(false);
    const orderedIds = forms.map((item) => item.id);
    console.log('Ordered IDs:', forms);
    //updateDatabasePosition(orderedIds);
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <h2>Forms</h2>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            id="openCreateFormModalBtn"
            onClick={openCreateFormModal}
            style={{ height: '40px' }}
          >
            Create Form
          </Button>
          <Button
            id="openTimesheetModalBtn"
            onClick={openTimeSheetModal}
            style={{ height: '40px' }}
          >
            Time Sheet
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            id="editOrderButton"
            onClick={handleEditOrder}
            disabled={isEditing}
            style={{ height: '40px' }}
          >
            Edit Order
          </Button>
          <Button
            id="saveOrderButton"
            onClick={handleSaveOrder}
            disabled={!isEditing}
            style={{ height: '40px' }}
          >
            Save Order
          </Button>
        </div>
      </div>

      <ListGroup id="sortable-list" onDragOver={onDragOver}>
        {forms.map((item) => (
          <ListGroup.Item
            key={item._id}
            className="d-flex justify-content-between align-items-center sortable-item"
            draggable={isEditing}
            onDragStart={(e) => onDragStart(e, item._id)}
            onDrop={(e) => onDrop(e, item._id)}
          >
            <div>{item.title}</div>
            <div>
              <Button variant="link">
                <FontAwesomeIcon icon={faTrash} onClick={() => confirmDeleteFormTemplate(item._id)} />
              </Button>
              {/* Add your other buttons here */}

              <Button variant="secondary" size="sm" onClick={() => openEditFormModal(item)}>
                Edit Form Template
              </Button>
              <Button variant="secondary" size="sm" onClick={() => openViewFormModal(item)}>
                View Form Template
              </Button>
              <Button variant="secondary" size="sm" onClick={() => openFormDocsModal(item._id)}>
                View Forms
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <FormTemplateModal
        show={isFormTemplateModalVisible}
        onClose={() => setFormTemplateModalVisible(false)}
        form={selectedForm}
      />
      <AddFormModal
        crews={crews}
        setForms={setForms}
        setCrews={setCrews}
        selectedForm={selectedForm}
        isVisible={isCreateFormModalVisibile}
        onClose={() => {
          setCreateFormModalVisible(false);
          setSelectedForm(null);
        }}
      />

      <FilledFormsModal
        isVisible={isFilledFormsModalVisible}
        forms={selectedFilledForms}
        setForms={setSelectedFilledForms}
        formId={selectedFormId}
        onClose={() => setFilledFormsModalVisible(false)}
      />

      <TimeSheetModal handleClose={handleHideTimeSheetModal} showModal={isTimeSheetModalVisible} />
    </Container>
  );
};

export default Forms;
