import React, { useState, useEffect } from 'react';
import RemoveSkidButton from '../Button/RemoveSkidButton';
import EditSkidButton from '../Button/EditSkidButton';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { useAlertMessage } from '../AlertMessage';
import { useSkidMarker } from '../SkidMarkerContext';
import axios from 'axios';
import { deletePresignedUrl } from '../../hooks/useFileDelete';
import { useNavigate } from 'react-router-dom';
import { useSkid } from '../../context/SkidContext';
const SkidMarkerPopover = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { setAlertMessageState } = useAlertMessage();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const { skidState, setSkidState } = useSkid(); // holds information about the skid
  const navigate = useNavigate();

  const toggleSkidCrew = (crew) => {
    console.log('toggleSkidCrew clicked', crew);
    setSkidMarkerState((prevState) => ({
      ...prevState,
      selectedSkidCrew: crew,
      popoverCrewVisible: !prevState.popoverCrewVisible,
      popoverPersonVisible: prevState.popoverPersonVisible ? false : prevState.popoverPersonVisible
    }));
  };

  const handleHazardClick = (hazard) => {
    console.log('hazard color', hazard.color);
    setSkidModalState((prevState) => ({
      ...prevState,
      hazardModalVisible: true,
      isSkidModalVisible: false,
      selectedHazardData: hazard
    }));

  };

  const openPdfInNewTab = (item) => {
    window.open(item.url, '_blank');
  };

  const editSelectedSkid = async () => {
    const { formik } = skidState;

    const id = new Date().getTime();
    try {
      setSkidState((prevState) => ({
        ...prevState,
        skidModalVisible: true,
      }))
      
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Selected General Hazards',
            show: true,
            message: `Error! cannot save general hazards. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error fetching hazard data:', error);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
    setSkidMarkerState((prevState) => ({
      ...prevState,
      editSkid: true
    }));
  };

  const removeSelectedSkid = async () => {
    const id = new Date().getTime();

    if (skidState.formik.selectedCutPlan) {
      const cutPlanKey = skidMarkerState.selectedMarker.info.cutPlans.key;

      await deletePresignedUrl([cutPlanKey]); // removes cutplan file from s3
    }

    const response = await axios.delete(
      `http://localhost:3001/pointonmap/${skidState.selectedSkidId}/${mapState.currentMapId}`,
      { withCredentials: true }
    );

    if (response.status === 200) {
      //call api to delete file 
      setMapState((prevState) => {
        const updatedMarkers = prevState.currentMapMarkers.filter(
          (marker) => marker._id !== skidState.selectedSkidId
        );
        return {
          ...prevState,
          currentMapMarkers: updatedMarkers
        };
      });

      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Remove Skid',
            show: true,
            message: `Success! Skid: ${skidModalState.skidName} has been removed`,
            background: 'success',
            color: 'white'
          }
        ]
      }));
    }

    setSkidMarkerState((prevState) => ({
      ...prevState,
      popoverVisible: false,
      selectedMarker: null
    }));

    setMapState((prevState) => ({
      ...prevState,
      enableMarker: false
    }));  
  };
  
  const handlePersonClick = async (person) => {
    /* try {
      // eslint-disable-next-line no-undef
      const response = await axios.get(`${process.env.REACT_APP_URL}/person-files/${person._id}`, {
        withCredentials: true
      });
      if (response.data.isLoggedIn) {
        const data = response.data;
        console.log('dtat', data)
       
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('An error has occuring fetching person data', error);
    } */
    
    setSkidMarkerState((prevState) => ({
      ...prevState,
      selectedSkidPerson: person,
      popoverPersonVisible: !prevState.popoverPersonVisible
    }))
  }
  return (
    <>
      {skidMarkerState.popoverVisible && (
        <div
          className="popover"
          data-testid="popover"
          data-bs-placement="top"
          style={{
            position: 'absolute',
            left: `${skidState?.selectedSkidPos?.x}px`,
            top: `${skidState?.selectedSkidPos?.y}px`,
            width: '250px',

            zIndex: 99
          }}
        >
          {!skidMarkerState.popoverCrewVisible ? (
            <>
              <div className="popover-header">
                Skid: {skidState?.formik?.values?.skidName}
                <RemoveSkidButton onClick={removeSelectedSkid} />
                <EditSkidButton onClick={editSelectedSkid} />
              </div>
              <div className="popover-body">
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '100%',
                    textAlign: 'center'
                  }}
                >
                  Crew:
                </div>
                <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }} data-testid="crew-list">
                {skidState?.formik?.values?.selectedCrew
                  .map((crewId) => {
                    // Find the corresponding crew object in mapState.crewTypes
                    const crew = mapState.crews.find((mapCrew) => mapCrew._id === crewId);
                    return crew ? (
                      <li
                        key={crewId}
                        data-testid={`crew_list_${crewId}`}
                        className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                        onClick={() => toggleSkidCrew(crew)}
                        style={{ cursor: 'pointer' }}
                      >
                        {crew.name}
                      </li>
                    ) : null;
                  })
                  .filter(Boolean) // Remove nulls in case crew was not found
                }

                </ul>
                <div>
                  {skidState?.formik?.values?.selectedDocuments && skidState?.formik?.values?.selectedDocuments.length > 0 && (
                    <>
                      <div
                        style={{
                          fontWeight: 'bold',
                          fontSize: '100%',
                          textAlign: 'center',
                          paddingBottom: '10px'
                        }}
                      >
                        Skid Documents:
                      </div>
                      <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {skidState?.formik?.values?.selectedDocuments.map(id => mapState.files.find(file => file._id === id)).filter(file => file).map((item, index) => (
                          <li
                            data-testid={`skid-doc-${index}`}
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                            onClick={() => window.open(item.fileUrl, '_blank')}
                          >
                            {item.fileName}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div>
                  {skidState?.formik?.values?.selectedCutPlan !== null && (
                    <>
                      <div
                        style={{
                          fontWeight: 'bold',
                          fontSize: '100%',
                          textAlign: 'center',
                          paddingBottom: '10px'
                        }}
                      >
                        Weekly Cut Plans:
                      </div>
                      <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        <li
                          data-testid={`skid-cut-plan`}
                          className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                          onClick={() => openPdfInNewTab(skidState.formik.values.selectedCutPlan)}
                          style={{ cursor: 'pointer' }}
                        >
                          {skidState?.formik?.values?.selectedCutPlan?.fileName}
                        </li>
                      </ul>
                    </>
                  )}
                </div>
                {/* {mapState.generalHazardsData && mapState.generalHazardsData.length > 0 && (
                  <>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '100%',
                        textAlign: 'center',
                        paddingBottom: '10px'
                      }}
                    >
                      General Hazards:
                    </div>
                    <div>
                      <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {mapState.generalHazardsData.map((hazard) => (
                          <li
                            data-testid={``}
                            key={hazard._id}
                            className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                            style={{ textAlign: 'center', backgroundColor: hazard.color }}
                            onClick={() => handleHazardClick(hazard)}
                          >
                            {hazard.id} : {hazard.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )} */}
                {skidState?.formik?.values?.selectedSkidHazards && skidState?.formik?.values?.selectedSkidHazards.length > 0 && (
                  <>
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '100%',
                        textAlign: 'center',
                        paddingBottom: '10px'
                      }}
                    >
                      Skid Hazards:
                    </div>
                    <div>
                      <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                      {Array.isArray(skidState?.formik.values.selectedSkidHazards) && skidState?.formik.values.selectedSkidHazards
                      .map(id => mapState.hazards.find(hazard => hazard._id === id))
                      .filter(hazard => hazard)
                      .map((hazard, index) => (
                        <li
                          data-testid={`skid-hazard-${index}`}
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center list-group-item-action skid-hazard-item"
                          style={{ textAlign: 'center', backgroundColor: hazard.color }}
                          onClick={() => handleHazardClick(hazard)}
                        >
                          {hazard.id} : {hazard.title}
                        </li>
                      ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : !skidMarkerState.popoverPersonVisible ? (
            <>
              <div className="popover-header">
                <button type="button" className="btn btn-link" onClick={() => toggleSkidCrew(null)}>
                  ←
                </button>
                Crew: {skidMarkerState.selectedSkidCrew.name}
              </div>
              <div className="popover-body">
                <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '100%',
                        textAlign: 'center',
                        paddingBottom: '10px'
                      }}
                    >
                      People:
                    </div>
                  {skidMarkerState.peopleByCrew[skidMarkerState.selectedSkidCrew._id] && skidMarkerState.peopleByCrew[skidMarkerState.selectedSkidCrew._id].map((person) => (
                    <li
                      key={person._id}
                      data-testid={`popover_${person._id}`}
                      className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                      style={{ textAlign: 'center' }}
                      onClick={() => {
                        console.log("memeoww", person);
                        handlePersonClick(person);
                        }}
                    >
                      {person.name}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="popover-header">
                <button type="button" className="btn btn-link" onClick={() => setSkidMarkerState((prevState) => ({
                  ...prevState,
                  popoverPersonVisible: !prevState.popoverPersonVisible
                }))}>
                  ←
                </button>
                {skidMarkerState.selectedSkidPerson.name} <span className="smaller-text">({skidMarkerState.selectedSkidPerson.role})</span>
              </div>
              <div className="popover-body">
                <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {Object.keys(skidMarkerState?.selectedSkidPerson?.filesByPerson || {}).length === 0 ? (
                    <p>No files available</p>
                  ) : (
                    Array.from(new Set(skidMarkerState?.selectedSkidPerson?.filesByPerson?.map((item) => item.type))).map((type) => (
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
                          {skidMarkerState?.selectedSkidPerson?.filesByPerson?.filter((item) => item.type === type).map((item) => (
                            <li
                              key={item._id}
                              className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                              onClick={() => window.open(item.fileUrl, '_blank')}
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SkidMarkerPopover;
