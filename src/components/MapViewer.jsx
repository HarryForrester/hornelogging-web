import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useMap } from './Map/MapContext';
import { useSkidMarker } from './SkidMarkerContext';
import EditGeneralHazardModal from './Modal/EditGeneralHazardsModal';
import SkidMarkerPopover from './Popover/SkidMarkerPopover';
import Spinner from 'react-bootstrap/Spinner';
import { useSkid } from '../context/SkidContext';

/**
 * The MapViewer component displays a PDF map and allows users to interact with it by adding skid markers,
 * viewing details, and editing general hazards. It utilizes various state contexts and modals to manage
 * its functionalities.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.enableMarker - Flag to enable or disable adding markers on the map.
 * @param {function} props.setShowSkidModal - Function to set the visibility of the skid modal.
 * @param {boolean} props.editGeneralHazardsModalVisible - Flag to control the visibility of the edit general hazards modal.
 * @param {function} props.setEditGeneralHazardsModalVisible - Function to set the visibility of the edit general hazards modal.
 *
 * @returns {JSX.Element} MapViewer component.
 */
const MapViewer = ({
  enableMarker,
  setShowSkidModal,
  editGeneralHazardsModalVisible,
  setEditGeneralHazardsModalVisible
}) => {

  const { skidMarkerState, setSkidMarkerState } = useSkidMarker(); // Access and manage skid marker state.
  const { mapState, setMapState } = useMap(); // Access and manage map state.
  const { skidState, setSkidState } = useSkid(); // Access and manage skid state.
  const [pdf, setPdf] = useState(null); // State for holding the PDF file URL.

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
      formik: null
    }));
    setShowSkidModal(true);
  };

  /**
   * Handles the event triggered when a user clicks on a skid marker.
   * This function opens the skid modal with the details of the clicked skid point.
   *
   * @param {Object} clickedPoint - The clicked skid point object.
   */
  const handleMarkerClick = async (clickedPoint) => {
    const { formik } = skidState;

    // Toggle popover visibility if the clicked marker is already selected.
    if (skidState.selectedSkidId === clickedPoint._id) {
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: !prevState.popoverVisible,
        popoverCrewVisible: false,
        popoverPersonVisible: false
      }));
    } else {
      // If it's a different point, close existing popovers and open for the new one.
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: true,
        popoverCrewVisible: false,
        popoverPersonVisible: false
      }));

      setSkidState((prevState) => ({
        ...prevState,
        selectedSkidId: clickedPoint._id,
        selectedSkidPos: { x: clickedPoint.point.x, y: clickedPoint.point.y },
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
      }));
    }
  };

  /**
   * Fetches the PDF data based on the current map URL.
   */
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
    
    /**
     * Fetches the crew data and updates the state with people and their associated files.
     */
    const fetchCrewData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/people', { withCredentials: true });
        const data = response.data;

        if (!data.people || !data.files) {
          console.error('People or files data is missing');
          return;
        }

        const files = data.files;

        // Create a map of files by person ID.
        const filesByPerson = files.reduce((acc, file) => {
          if (!acc[file.owner]) {
            acc[file.owner] = [];
          }
          acc[file.owner].push(file);
          return acc;
        }, {});

        setSkidMarkerState((prevState) => {
          if (!data.people) {
            return prevState;
          }

          const updatedPeopleByCrew = data.people.reduce(
            (updatedCrews, item) => {
              if (item.archive === 'on') return updatedCrews;
              const crewId = item.crew;

              if (!updatedCrews[crewId]) {
                updatedCrews[crewId] = [];
              }

              const existingPerson = updatedCrews[crewId].find((person) => person._id === item._id);

              if (!existingPerson) {
                updatedCrews[crewId].push({
                  _id: item._id,
                  name: item.name,
                  role: item.role,
                  filesByPerson: filesByPerson[item._id] || []
                });
              }

              return updatedCrews;
            },
            { ...prevState.peopleByCrew }
          );

          return {
            ...prevState,
            peopleByCrew: updatedPeopleByCrew
          };
        });
      } catch (error) {
        console.error('Error fetching crew data:', error);
      }
    };

    /**
     * Fetches the files data for the map and updates the state.
     */
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

  return (
    <>
      <EditGeneralHazardModal
        showModal={editGeneralHazardsModalVisible}
        setShowModal={setEditGeneralHazardsModalVisible}
      />
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
      </div>
      <SkidMarkerPopover />
    </>
  );
};

// Prop type validation for MapViewer component props.
MapViewer.propTypes = {
  enableMarker: PropTypes.bool.isRequired,
  setShowSkidModal: PropTypes.func.isRequired,
  editGeneralHazardsModalVisible: PropTypes.bool.isRequired,
  setEditGeneralHazardsModalVisible: PropTypes.func.isRequired
};

export default MapViewer;
