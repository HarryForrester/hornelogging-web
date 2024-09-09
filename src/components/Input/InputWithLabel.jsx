import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { ErrorMessage, Field } from 'formik';

const InputWithLabel = ({ type, label, name }) => {
  return (
    <Form.Group controlId={name} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Field name={name}>
        {({ field, form }) => (
          <>
            <Form.Control
              type={type}
              {...field}
              isInvalid={form.touched[name] && form.errors[name]}
              style={{ height: '38px', width: '100%' }}
            />
            <Form.Control.Feedback type="invalid">
              <ErrorMessage name={name} />
            </Form.Control.Feedback>
          </>
        )}
      </Field>
    </Form.Group>
  );
};

InputWithLabel.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default InputWithLabel;