import React, { useState } from 'react';
import RemoveSkidButton from '../Button/RemoveSkidButton';
import EditSkidButton from '../Button/EditSkidButton';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { useAlertMessage } from '../AlertMessage';
import { useSkidMarker } from '../SkidMarkerContext';
import axios from 'axios';

const SkidMarkerPersonPopover = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();

  const closePersonPopover = () => {
    //setPopoverPersonVisible(false);
    setSkidMarkerState((prevState) => ({
      ...prevState,
      popoverPersonVisible: false
    }));
  };

  return (
    <>
      {skidMarkerState.popoverPersonVisible && (
        <div
          className="popover nested-popover"
          data-bs-placement="top"
          style={{
            position: 'absolute',
            left: `${skidMarkerState.selectedMarker.point.x + 520}px`,
            top: `${skidMarkerState.selectedMarker.point.y}px`,
            width: '250px'
          }}
        >
          <div className="popover-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {skidMarkerState.selectedSkidPerson.name}{' '}
                <span className="smaller-text"> ({skidMarkerState.selectedSkidPerson.role})</span>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closePersonPopover}
              />
            </div>
          </div>

          <div className="popover-body">
            <div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '100%',
                  textAlign: 'center',
                  paddingBottom: '10px'
                }}
              >
                Files:
              </div>
              <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {skidMarkerState.selectedSkidPersonFiles.length === 0 ? (
                  <p>No files available</p>
                ) : (
                  Array.from(
                    new Set(skidMarkerState.selectedSkidPersonFiles.map((item) => item.type))
                  ).map((type) => (
                    <div key={type}>
                      <div
                        style={{
                          fontWeight: 'bold',
                          fontSize: '100%',
                          textAlign: 'center',
                          paddingBottom: '10px'
                        }}
                      >
                        {type}
                      </div>
                      <ul className="list-group">
                        {skidMarkerState.selectedSkidPersonFiles
                          .filter((item) => item.type === type)
                          .map((item) => (
                            <li
                              key={item._id}
                              className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                              onClick={() =>
                                window.open('http://localhost:3001' + item.uri, '_blank')
                              }
                            >
                              {item.fileName}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkidMarkerPersonPopover;
