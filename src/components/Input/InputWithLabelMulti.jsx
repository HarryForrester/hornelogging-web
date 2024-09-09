import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';

const InputWithLabelMulti = ({ label, name, rows, placeholder }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Field name={name}>
        {({ field, form }) => (
          <>
            <Form.Control
              as="textarea"
              id={name}
              {...field}
              rows={rows}
              placeholder={placeholder}
              isInvalid={form.touched[name] && form.errors[name]}
              style={{ width: '100%' }}
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

InputWithLabelMulti.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
  placeholder: PropTypes.string
};

InputWithLabelMulti.defaultProps = {
  rows: 3,
  placeholder: ''
};

export default InputWithLabelMulti;