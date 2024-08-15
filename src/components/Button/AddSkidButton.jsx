import React from 'react';
import { Button } from 'react-bootstrap';
import { useMap } from '../Map/MapContext';

const AddSkidButton = () => {
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
      setMapState((prevState) => ({
        ...prevState,
        enableMarker: true
      }));
    }
  };

  return (
      <Button variant="outline-secondary" onClick={addPoint}>
        {mapState.enableMarker ? 'Cancel' : 'Add Point'}
      </Button>
  );
};

export default AddSkidButton;
