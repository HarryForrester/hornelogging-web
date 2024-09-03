import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import PropTypes from 'prop-types';
/**
 * Adds a new crew
 * @returns
 */
const NewCrewButton = ({handleClick}) => {
  const { setSkidModalState } = useSkidModal();

 /*  const handleClick = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddCrewModalVisible: true
    }));
  }; */
  return (
    <Button variant="outline-dark" onClick={handleClick}>
      <FontAwesomeIcon icon={faUserPlus} data-testid="fontawesome-icon" />
      &nbsp; New Crew
    </Button>
  );
};

NewCrewButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
}
export default NewCrewButton;
