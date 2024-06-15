import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import HazardModal from './Modal/HazardModal';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext';
import { useMap } from './Map/MapContext';
import { useAlertMessage } from './AlertMessage';
import { useSkidMarker } from './SkidMarkerContext';
import AddOrEditSkidModal from './Modal/Skid/AddOrEditSkidModal';
import AddDocModal from './Modal/AddDocModal';
import AddCutPlanModal from './Modal/AddCutPlanModal';
import SelectHazardsModal from './Modal/SelectHazardsModal';
import EditGeneralHazardModal from './Modal/EditGeneralHazardsModal';
import SkidMarkerPopover from './Popover/SkidMarkerPopover';
import SkidMarkerCrewPopover from './Popover/SkidMarkerCrewPopover';
import SkidMarkerPersonPopover from './Popover/SkidMarkerPersonPopover';

const PDFViewer = ({ hazards, percentage }) => {
  const [pdfData, setPdfData] = useState(null);
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const { mapState, setMapState } = useMap();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const [tempHazards, setTempHazards] = useState([]);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const pdfContainerRef = useRef();

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
    setSkidModalState((prevState) => ({
      ...prevState,
      isSkidModalVisible: true,
      isSkidModalEdit: false
    }));
  };

  /**
   * Handles the clicked skid point when a user clicks the marker
   * This function opens and the skid modal where the clicked point is
   * @param {*} clickedPoint
   */
  const handleMarkerClick = async (clickedPoint) => {
    if (skidMarkerState.selectedMarker === clickedPoint) {
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: !prevState.popoverVisible
      }));
    } else {
      // If it's a different point, close the popover and then open it for the new point
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: false
      }));

      try {
        const response = await axios.get('http://localhost:3001/findhazard', {
          params: {
            name: clickedPoint.info.siteHazards.join(',') // Convert the array to a comma-separated string
          },
          withCredentials: true
        });

        setSkidMarkerState((prevState) => ({
          ...prevState,
          selectedMarkerSiteHazards: response.data
        }));
      } catch (error) {
        console.error('Error fetching hazard data:', error);
      }
      setSkidMarkerState((prevState) => ({
        ...prevState,
        popoverVisible: true
      }));
    }

    setSkidMarkerState((prevState) => ({
      ...prevState,
      selectedMarker: clickedPoint
    }));
  };

  /**
   * Used For Add Skid
   * Adds selected files from Add Doc Modal and adds to skid state
   * @param {*} selectedFiles
   */
  const submitDoc = (selectedFiles) => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddDocModalVisible: false,
      isSkidModalVisible: true,
      selectedDocuments: selectedFiles
    }));
  };

  /**
   * Handles the submission of a cut plan, converting the selected PDF file to base64.
   * Updates the Skid Modal state with the cut plan information and transitions back to the Skid Modal.
   * @param {string} fileName - The name of the cut plan file.
   * @param {File} selectedFile - The selected PDF file for the cut plan.
   * @returns {void}
   */
  const submitCutPlan = (fileName, selectedFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.substring('data:application/pdf;base64,'.length);
      setSkidModalState((prevState) => ({
        ...prevState,
        isAddDocModalVisible: false,
        isSkidModalVisible: true,
        selectedCutPlan: [{ fileName: fileName, base64String: base64String }]
      }));
    };

    reader.onerror = (error) => {
      console.error('File reading error:', error);
    };

    reader.onabort = () => {
      console.warn('File reading aborted');
    };

    reader.readAsDataURL(selectedFile);
  };

  const submitSelectedHazards = async (selectedHazards) => {
    console.log("hey harry cunt, there are the hazards you wanted", selectedHazards);
    const id = new Date().getTime();
    setTempHazards(mapState.generalHazardsData);

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
          //setSkidModalState((prevState) => ({ ...prevState, isSelectHazardModalVisible: false, isSkidModalVisible: true, selectedSkidHazards: selectedHazards, selectedSkidHazardsData: response.data }));
          setSkidModalState((prevState) => {
            const existingIds = prevState.selectedSkidHazardsData.map((hazard) => hazard._id);
            const newData = response.data.filter(
              (newHazard) => !existingIds.includes(newHazard._id)
            );
            console.log('exisinfIds: ', existingIds);
            console.log('newData:', newData);
            console.log('selectHazaaa', selectedHazards);

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
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error!',
            show: true,
            message: `Error! fetching hazard data ${error}`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error fetching hazard data:', error);
    }
  };

  const submitGeneralHazardModal = async () => {
    const id = new Date().getTime();

    const updatedGeneralHazards = [
      ...mapState.generalHazards,
      ...tempHazards.map((hazard) => hazard.id),
      ...mapState.generalHazardsData.map((hazard) => hazard.id)
    ];
    try {
      const resp = await axios.post(
        'http://localhost:3001/submitGeneralHazards',
        updatedGeneralHazards,
        { withCredentials: true }
      );
      if (resp.status === 200) {
        setMapState((prevState) => ({
          ...prevState,
          generalHazards: updatedGeneralHazards
        }));

        setSkidModalState((prevState) => ({ ...prevState, isGeneralHazardsModalVisible: false }));

        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Updated General Hazards',
              show: true,
              message: `Success! General hazards have been updated`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      }
    } catch (error) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Update General Hazards',
            show: true,
            message: `Error! General hazards have not been updated. Please try again.`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An error hsa occcured while updating general hazards: ', error);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleClose = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isGeneralHazardsModalVisible: false // or false based on your logic
    }));
  };

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        if (mapState.currentMapUrl) {
          console.log('current MAP URL: ' + mapState.currentMapUrl);
          const response = await axios.get(mapState.currentMapUrl, {
            responseType: 'arraybuffer', // Set the responseType to 'arraybuffer' for binary data
            withCredentials: true // Include credentials (cookies) in the request
          });

          if (response.status !== 200) {
            throw new Error(`Error loading PDF: ${response.statusText}`);
          }

          // Convert the arraybuffer to a Blob
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          setPdfData(pdfBlob);
        }
      } catch (error) {
        console.error('Error fetching PDF data:', error);
      }
    };

    const fetchCrewData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/people', { withCredentials: true });
        const data = response.data;

        setSkidMarkerState((prevState) => {
          const updatedPeopleByCrew =
            data.people !== undefined
              ? data.people.reduce(
                  (updatedCrews, item) => {
                    if (item.archive === 'on') return updatedCrews;

                    const crewName = item.crew;
                    const existingCrew = updatedCrews[crewName] || [];
                    const existingPerson = existingCrew.find((person) => person._id === item._id);

                    if (!existingPerson) {
                      updatedCrews[crewName] = [
                        ...existingCrew,
                        {
                          _id: item._id,
                          name: item.name,
                          role: item.role
                        }
                      ];
                    }

                    return updatedCrews;
                  },
                  { ...prevState.peopleByCrew }
                )
              : { ...prevState.peopleByCrew };

          return {
            ...prevState,
            peopleByCrew: updatedPeopleByCrew
          };
        });
      } catch (error) {
        console.error('Error fetching hazard data:', error);
      }
    };

    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/files-for-map', {
          withCredentials: true
        });
        const data = response.data;
        setSkidMarkerState((prevState) => ({
          ...prevState,
          personFiles: data.file
        }));
      } catch (error) {
        console.error('Error fetching hazard data:', error);
      }
    };

    fetchFiles();
    fetchPdfData();
    fetchCrewData();
  }, [mapState.currentMapUrl]);
  const canvasElement = document.querySelector('.react-pdf__Page__canvas');

  /* useEffect(() => {
    console.log("mapState", mapState.originalWidth)
    if (canvasElement) {
      const canvasWidth = canvasElement.getAttribute('width');
      const canvasHeight = canvasElement.getAttribute('height');
      console.log("canvas width: " + canvasWidth + ", canvas height: " + canvasHeight);
  
      setPdfSize({ width: canvasWidth/2, height: canvasHeight/2 });
    } else {
      console.error('Canvas element not found');
    }
  }, [mapState.maps]);
   */

  // Use useEffect to get the width and height after the component has mounted
  useEffect(() => {
    if (pdfContainerRef.current) {
      console.log('pdf: ', pdfContainerRef);
      const width = pdfContainerRef.current.offsetWidth;
      const height = pdfContainerRef.current.offsetHeight;

      // Do something with the width and height values, such as logging them
      console.log('Width:', width, 'Height:', height);
    }
  }, [mapState]);

  return (
    <>
      
      <AddDocModal docSumbit={submitDoc} />
      <AddCutPlanModal submitCutPlan={submitCutPlan} />
      <SelectHazardsModal hazards={hazards} submitSelectedHazards={submitSelectedHazards} />
      <HazardModal />
     
      <EditGeneralHazardModal
        submitGeneralHazardModal={submitGeneralHazardModal}
        handleClose={handleClose}
      />
 <AddOrEditSkidModal
        mousePosition={skidMarkerState.mousePosition}
        editSkid={skidMarkerState.editSkid}
      />
      {percentage >= 100 ? (
        pdfData && mapState.currentMapName ? (
          <div
            id="pdf-container"
            style={{
              width: pdfSize.width,
              height: pdfSize.height,
              border: '2px solid #000',
              borderRadius: '8px',
              boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
              overflow: 'auto',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, 0%)'
            }}
          >
            <Document file={pdfData} onMouseMove={handleMouseMove}>
              <Page
                pageNumber={1}
                renderMode="canvas"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={mapState.originalWidth}
                onLoadSuccess={(page) => {
                  const { width, height } = page;
                  //console.log("width: " + width + " height: " + height)
                  setMapState((prevState) => ({
                    ...prevState,
                    originalWidth: width,
                    originalHeight: height
                  }));
                  setPdfSize({ width, height });
                }}
              />
            </Document>

            {mapState.enableMarker === true && (
              <div
                className="red-dot"
                style={{
                  position: 'absolute',
                  left: `${skidMarkerState.mousePosition.x}px`,
                  top: `${skidMarkerState.mousePosition.y}px`,
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'red',
                  transform: 'translate(-50%, -50%)' // Center the marker on the mouse position
                }}
                onClick={(e) => {
                  addPointToPDF();
                }}
              ></div>
            )}
            {/* Renders map of markers onto map */}
            {mapState.currentMapMarkers.map((point, index) => (
              <div
                key={index}
                className="red-dot"
                style={{
                  position: 'absolute',
                  left: `${point.point.x}px`,
                  top: `${point.point.y}px`,
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'red',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleMarkerClick(point)}
                data-bs-toggle="popover"
                data-bs-placement="top"
                data-bs-content={point}
                data-bs-trigger="click"
              ></div>
            ))}

            <SkidMarkerPopover />
            <SkidMarkerCrewPopover />
            <SkidMarkerPersonPopover />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80vh'
            }}
          >
            <h2 style={{ textAlign: 'center', color: '#555', fontSize: '24px' }}>
              No maps loaded.
            </h2>
          </div>
        )
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          {percentage > 0 && percentage < 100 && (
            <ProgressBar
              variant="info"
              now={percentage}
              label={`Uploading: ${skidMarkerState.personFiles}%`}
              className="mt-2"
            />
          )}
        </div>
      )}
    </>
  );
};

PDFViewer.propTypes = {
  hazards: PropTypes.array.isRequired,
  percentage: PropTypes.number.isRequired
};

export default PDFViewer;
