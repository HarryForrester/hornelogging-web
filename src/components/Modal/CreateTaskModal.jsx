import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import Select from 'react-select';
import axios from 'axios';

const CreateTaskModal = ({ show, onHide, crews, people }) => {
  console.log('sick pe me', people);

  const crewOptions = (crews || []).map((crew) => ({
    value: crew._id,
    label: crew.name
  }));

  const peopleOptions = (people || []).map((person) => ({
    value: person._id,
    label: person.name
  }));

  const testGroup = [
    {
      label: 'Crews',
      options: crewOptions
    },
    {
      label: 'Employees',
      options: peopleOptions
    }
  ];

  const formik = useFormik({
    initialValues: {
      to: [],
      from: 'Office',
      subject: '',
      priority: '',
      body: '',
      date: new Date()
    },
    /* validationSchema: Yup.object().shape({
      to: Yup.array().required('Attn is required').min(1, 'At least one attn must be selected'),
      from: Yup.string().required('from is required'),
      subject: Yup.string().required('Subject is required'),
      priority: Yup.string().required('Priority is required'),
      body: Yup.string().required('body is required'),
      date: Yup.date().required('date is required'),
    }),
 */ onSubmit: async (values, { resetForm }) => {
      // Handle form submission here
      console.log('the sre;', values);
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/addTask`, values, {
          withCredentials: true
        });

        if (response.status === 200) {
          console.log('success: ', response.data);
        }
      } catch (error) {
        console.error('An error occured while submiting task to db: ', error);
      }
      onHide(); // Close the modal after form submission
      resetForm(); // Reset the form fields
    }
  });

  return (
    <Modal
      show={show}
      onHide={() => {
        formik.handleReset();
        onHide();
      }}
      aria-labelledby="myModalLabel"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="myModalLabel">Create Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="taskForm" onSubmit={formik.handleSubmit}>
          <Form.Group controlId="inputTo3">
            <Form.Label>Attn</Form.Label>
            <Select
              isMulti
              options={testGroup}
              name="to"
              value={testGroup.find((option) => option.value === formik.values.to)}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : [];
                console.log('se;', selectedValues);
                formik.setFieldValue('to', selectedValues);
              }}
              onBlur={formik.handleBlur}
              className={formik.touched.to && formik.errors.to ? 'is-invalid' : ''}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused
                    ? 'grey'
                    : formik.touched.to && formik.errors.to
                      ? 'red'
                      : 'grey'
                })
              }}
            />

            {/* <Form.Control
              type="text"
              placeholder="Attn"
              name="to"
              value={formik.values.to}
              onChange={formik.handleChange}
              isInvalid={formik.touched.to && !!formik.errors.to}
            /> */}
            <Form.Control.Feedback type="invalid">{formik.errors.to}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="inputSubject3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Subject"
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              isInvalid={formik.touched.subject && !!formik.errors.subject}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.subject}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="inputPriority3">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              as="select"
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              isInvalid={formik.touched.priority && !!formik.errors.priority}
            >
              <option value="" disabled>
                Select Priority
              </option>

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">{formik.errors.priority}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="inputBody3">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Body"
              name="body"
              value={formik.values.body}
              onChange={formik.handleChange}
              isInvalid={formik.touched.body && !!formik.errors.body}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.body}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="saveNewTaskBtn">
            Save Task
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CreateTaskModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  crews: PropTypes.array.isRequired,
  people: PropTypes.array.isRequired
};

export default CreateTaskModal;
