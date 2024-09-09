import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Field, ErrorMessage } from 'formik';

const SelectRoleType = ({ name }) => {
  const roleOptions = [
    'Loader Operator',
    'Hauler Operator',
    'Feller',
    'Skiddy',
    'Skidder Operator',
    'Breaker Out',
    'Health And Safety',
    'Office',
    'Crew Leader',
    'Foreman'
  ];

  return (
    <Form.Group>
      <Form.Label htmlFor={name} className="form-label">
        Role
      </Form.Label>
      <Field name={name}>
        {({ field, form }) => (
          <>
            <Form.Select
              id={name}
              {...field}
              isInvalid={form.touched[name] && form.errors[name]}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              <ErrorMessage name={name} />
            </Form.Control.Feedback>
          </>
        )}
      </Field>
    </Form.Group>
  );
};

SelectRoleType.propTypes = {
  name: PropTypes.string.isRequired
};

export default SelectRoleType;