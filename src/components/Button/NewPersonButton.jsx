import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types'

/**
 * Adds a new person to a crew
 * @returns
 */
const NewPersonButton = ({handleClick}) => {
  return (
    <Button variant="outline-dark" onClick={handleClick} style={{ marginRight: '10px' }}>
      <FontAwesomeIcon icon={faUserPlus} data-testid="fontawesome-icon"/>
      &nbsp; New Person
    </Button>
  );
};

NewPersonButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

export default NewPersonButton;
