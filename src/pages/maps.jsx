import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorConfirmationModal from '../components/Modal/ErrorConfirmationModal';
import MapViewer from '../components/MapViewer.jsx';
import UploadMapButton from '../components/Button/UploadMapButton';
import { useMap } from '../components/Map/MapContext.js';
import { useSkidModal } from '../components/Modal/Skid/SkidModalContext.js';
import { useConfirmationModal } from '../components/ConfirmationModalContext.js';
import { Button } from 'react-bootstrap';
import AddSkidButton from '../components/Button/AddSkidButton.jsx';
import { useAlertMessage } from '../components/AlertMessage.js';
import { deletePresignedUrl } from '../hooks/useFileDelete.js';
import { useSkidMarker } from '../components/SkidMarkerContext.js';
import { SkidProvider } from '../context/SkidContext.js';
const Maps = () => {
  const [isErrorConfirmationModalVisible, setIsErrorConfirmationModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddPoint, setShowAddPoint] = useState(false); // used to show/hide Add Point Button for map
  const [showRemoveMap, setShowRemoveMap] = useState(false); // used to show/hide Remove Map Button for map
  const [percentage, setPercentage] = useState(0);
  const pdfContainerRef = useRef(null);
  const { mapState, setMapState } = useMap();
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const [account, setAccount] = useState(null);
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/maps', {
          withCredentials: true,
          onDownloadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setPercentage(percentage);
          }
        });

        if (response.data.isLoggedIn) {
          const data = response.data;
          setAccount(data._account);
          setMapState((prevState) => ({
            ...prevState,
            files: data.files,
            crewTypes: data.crew,
            maps: data.maps,
            username: data.username,
            hazards: data.hazards,
            selectedGeneralHazards: data.generalHazards
          }));
        } else {
          navigate('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          // Redirect to the login page if the error is due to unauthorized access
          navigate('/login');
        } else {
          console.error('Error fetching crews:', error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const openEditGeneralHazards = () => {
    
    setSkidModalState((prevState) => ({
      ...prevState,
      isGeneralHazardsModalVisible: true, // or false based on your logic
      isSelectHazardsGeneral: true // will display Edit General Hazards as modal label for selecting general hazards
    }));
  };

  const hideErrorConfirmationModal = () => {
    setIsErrorConfirmationModalVisible(false);
  };

  const handleMapClick = (map) => {
    const mapId = map._id;
    const mapName = map.name;
    const points = map.points;
    const mapKey = map.map.key

    const parsePoints = points;
    var pdfButtons = document.querySelectorAll('.pdf-button');

    pdfButtons.forEach((button) => {
      button.classList.remove('active');
      button.disabled = false;
    });

    const clickedButton = document.querySelector(`.pdf-button[data-id="${mapId}"]`);
    clickedButton.disabled = true;
    clickedButton.classList.add('active');

    setMapState((prevState) => ({
      ...prevState,
      currentMapId: mapId,
      currentMapKey: mapKey,
      currentMapName: mapName,
      currentMapMarkers: parsePoints,
    }));

    setSkidMarkerState((prevState) => ({
      ...prevState,
      popoverVisible: false,
      selectedMarker: null
    }));

    loadFromDB(mapName);
  };

  const openConfirmRemoveMap = async () => {

    try {
      //TODO add confirm modal

      setConfirmationModalState((prevState) => ({
        ...prevState,
        show: true,
        label: 'Remove Map',
        message: `Are you sure you want to delete ${mapState.currentMapName}?`,
        confirmed: false
      }));

      //setSkidModalState((prevState) => ({ ...prevState, isConfirmModalVisible: true }));
    } catch (err) {
      console.error('An error has occurred while removing map', err);
    }
  };

  useEffect(() => {
    const deleteMap = async () => {
      if (confirmationModalState.confirmed) {
        const id = new Date().getTime();

        setShowSpinner(true);

        setMapState((prevState) => {
          const newData = mapState.maps.filter((map) => map._id !== mapState.currentMapId);
          return {
            ...prevState,
            maps: newData
          };
        });
        //TODO: reenable - a

        try {
          const resp = await axios.delete(`http://localhost:3001/map/${mapState.currentMapId}`, {
            withCredentials: true
          });
          if (resp.status === 200) {
            await deletePresignedUrl([mapState.currentMapKey])
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: [
                ...prevState.toasts,
                {
                  id: id,
                  heading: 'Remove Map',
                  show: true,
                  message: `Success! ${mapState.currentMapName}  has been removed.`,
                  background: 'success',
                  color: 'white'
                }
              ]
            }));
          } else {
            console.log('Failed to remove map');
          }
        } catch (error) {
          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Remove Map',
                show: true,
                message: `Error! An error occurred while removing map: ${mapState.currentMapName}`,
                background: 'danger',
                color: 'white'
              }
            ]
          }));
          console.error('An error occurred while removing map: ', error);
        } finally {
          setShowSpinner(false);

          setTimeout(() => {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: prevState.toasts.filter((toast) => toast.id !== id)
            }));
          }, 10000);
        }
      }
    };

    deleteMap();
  }, [confirmationModalState.confirmed]);

  useEffect(() => {
    // Access the DOM element using the ref
    const container = pdfContainerRef.current;

    // Check if the container exists before attempting to manipulate it
    if (container) {
      // Set the 'position' style property to 'relative'
      container.style.position = 'relative';

      // Create a new div, add a class, and append it to the container
      const pageContainer = document.createElement('div');
      pageContainer.classList.add('page-container');
      container.appendChild(pageContainer);

      // If you're using jQuery for specific functionality, you can use it here
      // $(pageContainer).doSomething();

      // Clean up code, if needed
      return () => {
        // Clean up code, if needed
      };
    }
  }, []); // Empty dependency array ensures that this effect runs once after the initial render

  const loadFromDB = async (mapName) => {
    try {
      const res = await axios.get(`http://localhost:3001/loadfromdb/${mapName}`, {
        withCredentials: true
      }); // Replace with your API endpoint

      /* if (!res.ok) {
       throw new Error(`Error loading map from server: ${res.statusText}`);
     } */

      const map = res.data;
      //          navigate('/login');
      if (res.status === 200) {
        if (map.pdfData.map) {
          // pdfBlob = new Blob([map.pdfData.map], { type: 'application/pdf' });
          const pdfUrl = map.pdfData.map;

          setMapState((prevState) => ({
            ...prevState,
            currentMapUrl: pdfUrl
          }));
          setShowAddPoint(true); // shows the add point button
          setShowRemoveMap(true);
        }

        return map;
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading map from server:', error);
      throw error;
    }
  };

  // selects first map in list and calls handleMapClick to render the first map
  useEffect(() => {
    const length = mapState.maps.length
    if (length > 0) {
      const firstMap = mapState.maps[length-1];
      handleMapClick(firstMap);
    } else {
      setShowAddPoint(false);
      setShowRemoveMap(false);
      setMapState((prevState) => ({
        ...prevState,
        currentMapUrl: null,
        currentMapId: null,
        currentMapName: null,
        currentMapMarkers: []
      }));
    }
  }, [mapState.maps]);

  return (
    <>
      <div className="container" style={{ marginTop: '50px' }}>
        <div id="map-buttons">
          <div style={{ float: 'right' }}>
            <div className="btn-group mb-3" id="button-container" role="group">
              {showAddPoint && <AddSkidButton pdfContainerRef={pdfContainerRef} />}

              <Button variant="outline-secondary" onClick={openEditGeneralHazards}>
                Edit General Hazards
              </Button>

              {showRemoveMap && (
                <Button variant="outline-danger" onClick={openConfirmRemoveMap}>
                  Delete
                </Button>
              )}

              <UploadMapButton _account={account} />

              {isErrorConfirmationModalVisible && (
                <ErrorConfirmationModal
                  message={errorMessage}
                  onClose={hideErrorConfirmationModal}
                />
              )}
            </div>
          </div>

          <div className="btn-group mb-3" id="button-container" role="group">
            <Button variant="outline-secondary" disabled>
              Current Maps
            </Button>

            {mapState.maps.length > 0 &&
              mapState.maps.map((map) => (
                <Button
                  key={map._id}
                  className="pdf-button"
                  variant="outline-secondary"
                  data-id={map._id}
                  value={map.name}
                  onClick={() => handleMapClick(map)}
                >
                  {map.name}
                </Button>
              ))}
          </div>
        </div>
        <div ref={pdfContainerRef} id="pdf-container" className="pdf-container" style={{zIndex: 1 }}>
          <SkidProvider>
          <MapViewer percentage={percentage} _account={account} />
          </SkidProvider>
        </div>
      </div>
    </>
  );
};

export default Maps;
