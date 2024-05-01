import React from 'react';
import { Button } from 'react-bootstrap';
import { useMap } from '../Map/MapContext';
import PropTypes from 'prop-types';

const AddSkidButton = ({ pdfContainerRef }) => {
  const { mapState, setMapState } = useMap();

  const addPoint = () => {
    if (mapState.enableMarker) {
      // If enableMarker is true, cancel the operation
      setMapState((prevState) => ({
        ...prevState,
        enableMarker: false
      }));
    } else {
      // If enableMarker is false, perform the addPoint operation
      const { height, width } = pdfContainerRef.current.getBoundingClientRect();

      setMapState((prevState) => ({
        ...prevState,
        // originalHeight: height,
        //originalWidth: width,
        enableMarker: true
      }));
    }
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={addPoint}>
        {mapState.enableMarker ? 'Cancel' : 'Add Point'}
      </Button>
    </>
  );
};

AddSkidButton.propTypes = {
  pdfContainerRef: PropTypes.func.isRequired
}

export default AddSkidButton;
