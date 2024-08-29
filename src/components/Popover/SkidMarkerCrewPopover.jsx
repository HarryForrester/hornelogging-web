import React, { useState } from 'react';
import RemoveSkidButton from '../Button/RemoveSkidButton';
import EditSkidButton from '../Button/EditSkidButton';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { useAlertMessage } from '../AlertMessage';
import { useSkidMarker } from '../SkidMarkerContext';
import { useSkid } from '../../context/SkidContext';
import axios from 'axios';

const SkidMarkerCrewPopover = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const { skidState, setSkidState } = useSkid();

  const closeCrewPopover = () => {
    //setPopoverCrewVisible(false);
    //setPopoverPersonVisible(false);
    setSkidMarkerState((prevState) => ({
      ...prevState,
      popoverCrewVisible: false,
      popoverPersonVisible: false
    }));
  };

  const handleSkidPersonClick = (person) => {
    ///setSelectedSkidPersonFiles([]); // clears stale person files
    //setPopoverPersonVisible(true); // shows person popover with persons files
    //setSelectedSkidPerson(person); // stores the person object of the selected person
    setSkidMarkerState((prevState) => ({
      ...prevState,
      selectedSkidPersonFiles: [],
      popoverPersonVisible: true,
      selectedSkidPerson: person
    }));

    skidMarkerState.personFiles.forEach((file) => {
      if (file.owner === person._id) {
        //setSelectedSkidPersonFiles(prevFiles => [...prevFiles, file]);
        setSkidMarkerState((prevState) => ({
          ...prevState,
          selectedSkidPersonFiles: [...prevState.selectedSkidPersonFiles, file]
        }));
      }
    });
  };

  return (
    <>
      {skidMarkerState.popoverCrewVisible && (
        <div
          className="popover nested-popover"
          data-testid={`popover-crew'`}
          data-bs-placement="top"
          style={{
            position: 'absolute',
            left: `${skidState.selectedSkidPos.x + 260}px`,
            top: `${skidState.selectedSkidPos.y}px`,
            width: '250px'
          }}
        >
          <div className="popover-header">
            <div className="d-flex justify-content-between align-items-center">
              {skidMarkerState.selectedSkidCrew}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeCrewPopover}
                style={{ order: 2 }}
              />
            </div>
          </div>

          <div className="popover-body">
            <div>
              <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {skidMarkerState.peopleByCrew[skidMarkerState.selectedSkidCrew].map((crew) => (
                  <li
                    key={crew._id}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    style={{ textAlign: 'center' }}
                    onClick={() => handleSkidPersonClick(crew)}
                  >
                    {crew.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkidMarkerCrewPopover;
