import React from 'react';
import { Button } from 'react-bootstrap';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';

const AddSkidButton = ({enableMarker, setEnableMarker}) => {
  const { mapState, setMapState } = useMap();

  const addPoint = () => {
    if (enableMarker) {
      // If enableMarker is true, cancel the operation
/*       setMapState((prevState) => ({
        ...prevState,
        enableMarker: false
      })); */
      setEnableMarker(false)
    } else {
      // If enableMarker is false, perform the addPoint operation
      /* setMapState((prevState) => ({
        ...prevState,
        enableMarker: true
      })); */
      setEnableMarker(true);
    }
  };

  return (
      <Button variant="outline-secondary" onClick={addPoint}>
        {enableMarker ? 'Cancel' : 'Add Point'}
      </Button>
  );
};

AddSkidButton.propTypes = {
  enableMarker: PropTypes.bool.isRequired,
  setEnableMarker: PropTypes.func.isRequired,
}

export default AddSkidButton;
