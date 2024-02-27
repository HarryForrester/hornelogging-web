import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import FormTemplateModal from '../components/Modal/FormTemplateModal';
import AddFormModal from '../components/Modal/AddFormModal';


const Forms = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [forms, setForms] = useState([]);
    const [crews, setCrews] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [isFormTemplateModalVisible, setFormTemplateModalVisible] = useState(false);




    const openCreateFormModal = () => {
        console.log("openCreateFormModal")
    }

    const openTimeSheetModal = () => {
        console.log("openTimeSheetModal")
    }

    const handleEditOrder = () => {
        console.log("handleEditOrder");
    }

    const handleSaveOrder = () => {
        console.log("handleSaveOrder")
    }

    const deleteFormTemplate = () => {
        console.log("deleteFormTemplate");
    }

    const openEditFormModal = () => {
        console.log("openEditFormModal");
    }

    const openViewFormModal = (form) => {
        console.log("openViewFormModal", form);
        setSelectedForm(form);
        setFormTemplateModalVisible(true);

        const sections = JSON.parse(form.sectionsSerialized);

        console.log("sections: ", sections);

       


    }

    const openFormDocsModal = () => {
        console.log("openFormDocsModal")
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/forms`, { withCredentials: true });
                if (response.status === 200) {
                    console.log('forms: ',response.data)
                    setForms(response.data.forms);
                    setCrews(response.data.crew)

                   

                } else {
                    navigate('/login');
                }

            } catch (error) {
                console.error("An error has occuring fetching person data", error);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <h2>Forms</h2>
                </Col>
            </Row>

            <Button id="openCreateFormModalBtn" onClick={openCreateFormModal}>Create Form</Button>
            <Button id="openTimesheetModalBtn" onClick={openTimeSheetModal}>Time Sheet</Button>

            <div className="d-flex justify-content-end">
                <Button id="editOrderButton" onClick={handleEditOrder}>Edit Order</Button>
                <Button id="saveOrderButton" onClick={handleSaveOrder} disabled>Save Order</Button>
            </div>

            <ListGroup id="sortable-list">
      {forms.map(item => (
        <ListGroup.Item
          key={item._id}
          className="d-flex justify-content-between align-items-center sortable-item"
          draggable="true"
        >
          <div>
            {item.title}
          </div>
          <div>
            <Button variant="link" onClick={() => deleteFormTemplate(item._id)}>
              <i className="fa-solid fa-trash" style={{ color: '#ff0000' }}></i>
            </Button>
            <Button variant="secondary" size="sm" onClick={() => openEditFormModal(item._id)}>
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

    <FormTemplateModal show={isFormTemplateModalVisible} onClose={() => setFormTemplateModalVisible(false)} form={selectedForm} />
        <AddFormModal crews={crews} />
        </Container>
    );
};

export default Forms;
