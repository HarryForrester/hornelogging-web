import React, { useState, useEffect } from 'react';
import RemoveSkidButton from '../Button/RemoveSkidButton';
import EditSkidButton from '../Button/EditSkidButton';
import { useSkidModal } from '../Modal/Skid/SkidModalContext';
import { useMap } from '../Map/MapContext';
import { useAlertMessage } from '../AlertMessage';
import { useSkidMarker } from '../SkidMarkerContext';
import axios from 'axios';
import { deletePresignedUrl } from '../../hooks/useFileDelete';
import { useSkid } from '../../context/SkidContext';
const SkidMarkerPopover = () => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { setAlertMessageState } = useAlertMessage();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const { skidState, setSkidState } = useSkid(); // holds information about the skid

  useEffect(() => {
    console.log('skidState', skidState)

    console.log('formik', skidState?.formik?.values)
  }, [skidState]);
  const toggleSkidCrew = (crew) => {
    setSkidMarkerState((prevState) => ({
      ...prevState,
      selectedSkidCrew: crew,
      popoverCrewVisible: !prevState.popoverCrewVisible,
      popoverPersonVisible: prevState.popoverPersonVisible ? false : prevState.popoverPersonVisible
    }));
  };

  const handleHazardClick = (hazard) => {
    setSkidModalState((prevState) => ({
      ...prevState,
      hazardModalVisible: true,
      isSkidModalVisible: false,
      selectedHazardData: hazard
    }));
  };

  // Used to convert base64String to  blob to view file on new tab
  const openPdfInNewTab = (item) => {
    window.open(item.url, '_blank');
  /*   const byteCharacters = atob(item.base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);

    window.open(item, '_blank'); */
  };

  const editSelectedSkid = async () => {
    const { formik } = skidState;

    const id = new Date().getTime();
    //console.log('dddddddd',skidMarkerState.selectedMarker.info.siteHazards)
    try {
      /* if(skidMarkerState.selectedMarker.info.siteHazards && skidMarkerState.selectedMarker.info.siteHazards.length > 0) {
        const response = await axios.get('http://localhost:3001/findhazard', {
          params: {
            name: skidMarkerState.selectedMarker.info.siteHazards.join(',') // Convert the array to a comma-separated string
          },
          withCredentials: true
        });
  
        if (response.status === 200) {
          setSkidModalState((prevState) => ({
            ...prevState,
            _id: skidMarkerState.selectedMarker._id,
            isSkidModalVisible: true,
            skidName: skidMarkerState.selectedMarker.info.pointName,
            selectedCrew: skidMarkerState.selectedMarker.info.crews,
            selectedDocuments: skidMarkerState.selectedMarker.info.selectedDocuments,
            selectedSkidHazards: skidMarkerState.selectedMarker.info.siteHazards,
            selectedSkidHazardsData: response.data,
            selectedCutPlan: skidMarkerState.selectedMarker.info.cutPlans,
            isSkidModalEdit: true
          }));
        }
      } */ //else {
        
        /* setSkidModalState((prevState) => ({
          ...prevState,
          _id: skidMarkerState.selectedMarker._id,
          isSkidModalVisible: true,
          skidName: skidMarkerState.selectedMarker.info.pointName,
          selectedCrew: skidMarkerState.selectedMarker.info.crews,
          selectedDocuments: skidMarkerState.selectedMarker.info.selectedDocuments,
          selectedSiteHazards: skidMarkerState.selectedMarker.info.siteHazards,
          selectedCutPlan: skidMarkerState.selectedMarker.info.cutPlans,
          isSkidModalEdit: true
        })); */
      //}
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
    //setEditSkid(true);
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
    
  /*   const skidObj = {
      _id: skidModalState._id,
      mapName: mapState.currentMapName,
      info: {
        crews: skidModalState.selectedCrew,
        cutPlans: skidModalState.selectedCutPlan,
        pointName: skidModalState.skidName,
        selectedDocuments: skidModalState.selectedDocuments,
        siteHazards: skidModalState.selectedSkidHazards
      },
      point: {
        originalWidth: mapState.originalWidth,
        originalHeight: mapState.originalHeight,
        x: skidMarkerState.mousePosition.x,
        y: skidMarkerState.mousePosition.y
      }
    }; */

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

  return (
    <>
      {skidMarkerState.popoverVisible && (
        <div
          className="popover"
          data-bs-placement="top"
          style={{
            position: 'absolute',
            left: `${skidState.selectedSkidPos.x}px`,
            top: `${skidState.selectedSkidPos.y}px`,
            width: '250px',

            zIndex: 99
          }}
        >
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

            <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
              {/* Filters out crews that do not exist anymore */}
              {skidState?.formik?.values?.selectedCrew
                .filter((crew) => mapState.crewTypes.some((mapCrew) => mapCrew === crew))
                .map((crew) => (
                  <li
                    key={crew}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    onClick={() => toggleSkidCrew(crew)}
                    style={{ cursor: 'pointer' }}
                  >
                    {crew}
                  </li>
                ))}
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
                Site Documents:
              </div>
              
                <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                  {skidState?.formik?.values?.selectedDocuments.map(id => mapState.files.find(file => file._id === id)).filter(file => file).map((item, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                      onClick={() => window.open(item.fileUrl, '_blank')}
                    >
                      {item.fileName}
                    </li>
                  ))}
                </ul></>
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

            {mapState.generalHazardsData && mapState.generalHazardsData.length > 0 && (
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
                    key={hazard._id}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    style={{ textAlign: 'center' }}
                    onClick={() => handleHazardClick(hazard)}
                  >
                    {hazard.id} : {hazard.title}
                  </li>
                ))}
              </ul>
            </div>
            </>
            )}

            
            { skidMarkerState.selectedSkidHazardsData && skidMarkerState.selectedSkidHazardsData.length > 0 && (
              <>
               <div
              style={{
                fontWeight: 'bold',
                fontSize: '100%',
                textAlign: 'center',
                paddingBottom: '10px'
              }}
            >
              Site Hazards:
            </div>

            <div>
              <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {skidMarkerState.selectedSkidHazardsData.map((hazard) => (
                  <li
                    key={hazard.id}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    style={{ textAlign: 'center' }}
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
        </div>
      )}
    </>
  );
};

export default SkidMarkerPopover;
