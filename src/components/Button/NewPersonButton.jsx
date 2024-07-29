import React from 'react';
import { Button } from 'react-bootstrap';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * Adds a new person to a crew
 * @returns
 */
const NewPersonButton = () => {
  const { setSkidModalState } = useSkidModal();

  const handleClick = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddPersonModalVisible: true
    }));
  };

  return (
    <Button variant="outline-dark" onClick={handleClick} style={{ marginRight: '10px' }}>
      <FontAwesomeIcon icon={faUserPlus} data-testid="fontawesome-icon"/>
      &nbsp; New Person
    </Button>
  );
};

export default NewPersonButton;
