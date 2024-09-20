import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import HazardModal from './Modal/HazardModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useMap } from './Map/MapContext';
import { useAlertMessage } from './AlertMessage';
import { useSkidMarker } from './SkidMarkerContext';
//import AddOrEditSkidModal from './Modal/Skid/AddOrEditSkidModal';
//import SelectHazardsModal from './Modal/SelectHazardsModal';
import EditGeneralHazardModal from './Modal/EditGeneralHazardsModal';
import AddSkidHazardModal from './Modal/AddSkidHazardModal';
import SkidMarkerPopover from './Popover/SkidMarkerPopover';
import Spinner from 'react-bootstrap/Spinner';
import { useSkid } from '../context/SkidContext';
/**
 * 
 * @param {*} param0 
 * @returns 
 */
const MapViewer = ({ enableMarker, setShowSkidModal, editGeneralHazardsModalVisible, setEditGeneralHazardsModalVisible }) => {

  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const { mapState, setMapState } = useMap();
  const { skidState, setSkidState } = useSkid();
  const { addToast } = useAlertMessage();
  const [pdf, setPdf] = useState(null);
  //const [generalHazardsModalVisible, setGeneralHazardsModalVisible] = useState(false); // Shows or hides the SelectHazardModal when the user clicks "Add Hazard" inside 'EditGeneralHazardsModal.jsx'
  /**
   * Handles the mouse move even when user is adding a point to a pdf
   * This function sets the mouse position event the mouse postion is on the page
   * @param {MouseEvent} event  - The mouse event accociated with adding a new point
   */
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSkidMarkerState((prevState) => ({
      ...prevState,
      mousePosition: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
    }));
  };

  /**
   * Handles the event triggered when a user clicks (sumbits) there position.
   * This function opens the add skid modal
   */
  const addPointToPDF = () => {
    setSkidState((prevState) => ({
      ...prevState,
      formik: null,
      //skidModalVisible: true,
    }))

    setShowSkidModal(true);
    /* setSkidModalState((prevState) => ({
      ...prevState,
      isSkidModalEdit: false,
      isSkidModalAdd: true
    })); */
  };

  /**
   * Handles the clicked skid point when a user clicks the marker
   * This function opens and the skid modal where the clicked point ish
   * @param {*} clickedPoint
   */
  const handleMarkerClick = async (clickedPoint) => {
    console.log('handleMarkerClick', clickedPoint);
    const { formik } = skidState;

    // if the clicked marker is already visible then hide it
    if (skidState.selectedSkidId === clickedPoint._id) {
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: !prevState.popoverVisible,
        popoverCrewVisible: false,
        popoverPersonVisible: false
      }));
      
    } else {
      // If it's a different point, close the existing popover and then open it for the new popovers
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: true,
        popoverCrewVisible: false,
        popoverPersonVisible: false
      }));

      setSkidState((prevState) => ({
        ...prevState,
        selectedSkidId: clickedPoint._id,
        selectedSkidPos: {x: clickedPoint.point.x, y: clickedPoint.point.y},
        formik: {
          ...formik,
          values: {
            skidName: clickedPoint.info.pointName,
            selectedCrew: clickedPoint.info.crews,
            selectedDocuments: clickedPoint.info.selectedDocuments,
            selectedCutPlan: clickedPoint.info.cutPlans,
            selectedSkidHazards: clickedPoint.info.siteHazards
          }
        }
      }))      
    }

  };

  

  /* const submitSelectedHazards = async (selectedHazards) => {
    const id = new Date().getTime();

    try {
      const response = await axios.get('http://localhost:3001/findhazard', {
        params: {
          name: selectedHazards.join(',') // Convert the array to a comma-separated string
        },
        withCredentials: true
      });

      if (response.status === 200) {
        if (skidModalState.isSelectHazardsGeneral) {
          setSkidModalState((prevState) => ({
            ...prevState,
            isGeneralHazardsModalVisible: true,
            isSelectHazardModalVisible: false
          }));
          setMapState((prevState) => {
            const existingIds = prevState.generalHazardsData.map((hazard) => hazard.id);
            const newData = response.data.filter(
              (newHazard) => !existingIds.includes(newHazard.id)
            );

            return {
              ...prevState,
              generalHazards: selectedHazards,
              generalHazardsData: [...prevState.generalHazardsData, ...newData]
            };
          });
        } else {
          setSkidModalState((prevState) => {
            const existingIds = prevState.selectedSkidHazardsData.map((hazard) => hazard._id);
            const newData = response.data.filter(
              (newHazard) => !existingIds.includes(newHazard._id)
            );
            return {
              ...prevState,
              isSelectHazardModalVisible: false,
              isSkidModalVisible: true,
              selectedSkidHazards: [...existingIds, ...selectedHazards],
              selectedSkidHazardsData: [...prevState.selectedSkidHazardsData, ...newData]
            };
          });
        }
      }
    } catch (error) {
      addToast('Error!', `Error! fetching hazard data ${error}`, 'danger', 'white');
      console.error('Error fetching hazard data:', error);
    }
  }; */

  /* const submitGeneralHazardModal = async () => {
    //const id = new Date().getTime();
    
    try {
      const resp = await axios.post(
        'http://localhost:3001/submitGeneralHazards',
        selectedGeneralHazards,
        { withCredentials: true }
      );
      if (resp.status === 200) {
        /* setMapState((prevState) => ({
          ...prevState,
          generalHazards: selectedGeneralHazards
        })); 
        setSelectedGeneralHazards(selectedGeneralHazards);
        setEditGeneralHazardsModalVisible(false);
        //setSkidModalState((prevState) => ({ ...prevState, isGeneralHazardsModalVisible: false }));
        addToast('General Hazards Updated!', `Success! General hazards have been updated.`, 'success', 'white');
      }
    } catch (error) {
      addToast('Error!', `An error has occurred while updating general hazards. Please try again later.`, 'danger', 'white');
      console.error('An error hsa occcured while updating general hazards: ', error);
    }
  }; */
/* 
  const handleClose = () => {
/*     setSkidModalState((prevState) => ({
      ...prevState,
      isGeneralHazardsModalVisible: false // or false based on your logic
    })); 
    setEditGeneralHazardsModalVisible(false);
  }; */

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        if (mapState.currentMapUrl) {
          setPdf(mapState.currentMapUrl);
        }
      } catch (error) {
        console.error('Error fetching PDF data:', error);
      }
    };
  
    const fetchCrewData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/people', { withCredentials: true });
        const data = response.data;
        console.log('Fetched people data:', data);
  
        if (!data.people || !data.files) {
          console.error('People or files data is missing');
          return;
        }
  
        const files = data.files;
  
        // Create a map of files by person ID
        const filesByPerson = files.reduce((acc, file) => {
          if (!acc[file.owner]) {
            acc[file.owner] = [];
          }
          acc[file.owner].push(file);
          return acc;
        }, {});
  
        console.log('Files mapped by person:', filesByPerson);
  
        setSkidMarkerState((prevState) => {
          if (!data.people) {
            return prevState;
          }
  
          const updatedPeopleByCrew = data.people.reduce((updatedCrews, item) => {
            if (item.archive === 'on') return updatedCrews;
            console.log('item bro', item.crew)
            const crewId = item.crew;
  
            if (!updatedCrews[crewId]) {
              updatedCrews[crewId] = [];
            }
  
            const existingPerson = updatedCrews[crewId].find(
              (person) => person._id === item._id
            );
  
            if (!existingPerson) {
              updatedCrews[crewId].push({
                _id: item._id,
                name: item.name,
                role: item.role,
                filesByPerson: filesByPerson[item._id] || []
              });
            }
  
            return updatedCrews;
          }, { ...prevState.peopleByCrew });
  
          console.log('Updated people by crew:', updatedPeopleByCrew);
  
          return {
            ...prevState,
            peopleByCrew: updatedPeopleByCrew
          };
        });
      } catch (error) {
        console.error('Error fetching crew data:', error);
      }
    };
  
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/files-for-map', {
          withCredentials: true
        });
        const data = response.data;
        console.log('Fetched files for map:', data);
        setSkidMarkerState((prevState) => ({
          ...prevState,
          personFiles: data.file
        }));
      } catch (error) {
        console.error('Error fetching files data:', error);
      }
    };
  
    fetchFiles();
    fetchPdfData();
    fetchCrewData();
  }, [mapState.currentMapUrl]);
  
  // Closes the SelectGeneralHazards Modal and opens EditGeneralHazardsModal
  /* const handleGeneralHazardsClose = () => {
    setGeneralHazardsModalVisible(false);
    setEditGeneralHazardsModalVisible(true);
  }
 */
  /* const handleCheckboxChange = (hazard) => {
    const hazardId = hazard._id;

   /*  const selectedGeneralHazards = Array.isArray(mapState.selectedGeneralHazards)
        ? mapState.selectedGeneralHazards
        : []; 

      const updatedHazards = selectedGeneralHazards.includes(hazardId)
        ? selectedGeneralHazards.filter((id) => id !== hazardId)
        : [...selectedGeneralHazards, hazardId];

     /*  setMapState((prevState) => ({
        ...prevState,
        selectedGeneralHazards: updatedHazards,
      })); 
      setSelectedGeneralHazards(updatedHazards)
  } */

  return (
    <>
      <EditGeneralHazardModal
        showModal={editGeneralHazardsModalVisible}
        setShowModal={setEditGeneralHazardsModalVisible}
      />
      {/* <SelectHazardsModal
        title='Select General Hazards'
        showModal={generalHazardsModalVisible}
        handleClose={handleGeneralHazardsClose}
        handleCheckboxChange={handleCheckboxChange}
        selectedHazards={selectedGeneralHazards}
      /> */}
      <AddSkidHazardModal />
      {/* <AddOrEditSkidModal
        mousePosition={skidMarkerState.mousePosition}
        editSkid={skidMarkerState.editSkid}
        _account={_account}
      /> */}
      {/*       <HazardModal />
       */}
      {/*       {mapState.currentMapName ? (
       */}{' '}
      <div
        id="pdf-container"
        data-testid="map-viewer-pdf-container"
        style={{
          border: '2px solid #000',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
          overflow: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, 0%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        {pdf && (
          <Document
            file={pdf}
            onMouseMove={handleMouseMove}
            loading={<Spinner animation="border" role="status" />}>
            <Page
              pageNumber={1}
              renderMode="canvas"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              onLoadSuccess={(page) => {
                const { width, height } = page;
                setMapState((prevState) => ({
                  ...prevState,
                  originalWidth: width,
                  originalHeight: height
                }));
              }}
              style={{}}
            />
          </Document>
        )}

        {enableMarker === true && (
          <div
            className="red-dot"
            data-testid="cursor-red-dot"
            style={{
              position: 'absolute',
              left: `${skidMarkerState.mousePosition.x}px`,
              top: `${skidMarkerState.mousePosition.y}px`,
              width: '20px',
              height: '20px',
              backgroundColor: 'red',
              transform: 'translate(-50%, -50%)' // Center the marker on the mouse position
            }}
            onClick={(e) => {
              addPointToPDF();
            }}></div>
        )}
        {/* Renders map of markers onto map */}
        {Array.isArray(mapState.currentMapMarkers) &&
          mapState.currentMapMarkers.map((point, index) => (
            <button
              key={index}
              data-testid={`red-dot-${index}`}
              className="red-dot"
              style={{
                position: 'absolute',
                left: `${point.point.x}px`,
                top: `${point.point.y}px`,
                width: '20px',
                height: '20px',
                backgroundColor: 'red',
                transform: 'translate(-50%, -50%)',
                border: 'none',
                padding: '0',
                cursor: 'pointer'
              }}
              onClick={() => handleMarkerClick(point)}
              data-bs-toggle="popover"
              data-bs-placement="top"
              data-bs-content={point}
              data-bs-trigger="click">
              <span className="visually-hidden">Map Marker</span>
            </button>
          ))}
        {/* {percentage > 0 && percentage < 100 && (
            <ProgressBar
              variant="info"
              now={percentage}
              label={`Uploading: ${percentage}%`}
              className="mt-2"
            />
          )} */}
      </div>
      {/* ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          
          
        </div>
        
      )} */}
      <SkidMarkerPopover />
    </>
  );
};

MapViewer.propTypes = {
  enableMarker: PropTypes.bool.isRequired,
  setShowSkidModal: PropTypes.func.isRequired,
  editGeneralHazardsModalVisible: PropTypes.bool.isRequired,
  setEditGeneralHazardsModalVisible: PropTypes.func.isRequired
};

export default MapViewer;
