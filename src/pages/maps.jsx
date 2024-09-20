import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { usePersonFile } from '../context/PersonFileContext.js';
import { useLibraryFile } from '../context/LibraryFileContext.js';
import { useCrews } from '../context/CrewContext.js';
import AddOrEditSkidModal from '../components/Modal/Skid/AddOrEditSkidModal.jsx';
const Maps = () => {
  const [showAddPoint, setShowAddPoint] = useState(false); // used to show/hide Add Point Button for map
  const [showRemoveMap, setShowRemoveMap] = useState(false); // used to show/hide Remove Map Button for map
  const [percentage, setPercentage] = useState(0);
  const pdfContainerRef = useRef(null);
  const { mapState, setMapState } = useMap();
  const { setSkidModalState } = useSkidModal();
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const { addToast } = useAlertMessage();
  const [account, setAccount] = useState(null);
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const { personFiles, setPersonFiles } = usePersonFile();
  const { libraryFiles, setLibraryFiles } = useLibraryFile();
  const { crews, setCrews } = useCrews();

  const [showAddSkidModal, setShowSkidModal] = useState(false);
  const [enableMarker, setEnableMarker] = useState(false); // Used to hide or show the marker when the user clicks "Add" or "Cancel"
  const [maps, setMaps] = useState([]); 
  const navigate = useNavigate();

  const [editGeneralHazardsModalVisible, setEditGeneralHazardsModalVisible] = useState(false); // Shows or hides the EditGeneralHazardsModal when the user clicks "Edit General Hazards"

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
          console.log('dara', data)
          setAccount(data._account);
          setLibraryFiles({
            types: data.libraryFileTypes,
            files: data.libraryFiles
          });

          setPersonFiles({
            personFileTypes: data.personFileTypes,
            personFiles: data.personFiles
          });

          setCrews(data.crews)
          setMaps(data.maps);
          //setSelectedGeneralHazards(data.generalHazards);
           setMapState((prevState) => ({
            ...prevState,
            //crews: data.crew,
            //maps: data.maps,
            //username: data.username,
            hazards: data.hazards,
            generalHazards: data.generalHazards
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
    
   /*  setSkidModalState((prevState) => ({
      ...prevState,
      isGeneralHazardsModalVisible: true, // or false based on your logic
      isSelectHazardsGeneral: true // will display Edit General Hazards as modal label for selecting general hazards
    })); */
    setEditGeneralHazardsModalVisible(true);
  };

  const handleMapClick = (map) => {
    const mapId = map._id;
    const mapName = map.name;
    const points = map.points;
    const mapKey = map.map.key

    const parsePoints = points;
    console.log('pints ', parsePoints);
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
      setConfirmationModalState((prevState) => ({
        ...prevState,
        show: true,
        label: 'Remove Map',
        message: `Are you sure you want to delete ${mapState.currentMapName}?`,
        confirmed: false
      }));

    } catch (err) {
      console.error('An error has occurred while removing map', err);
    }
  };

  useEffect(() => {
    const deleteMap = async () => {
      if (confirmationModalState.confirmed) {
        const newData = maps.filter((map) => map._id !== mapState.currentMapId);

        setMaps(newData);

        try {
          const resp = await axios.delete(`http://localhost:3001/map/${mapState.currentMapId}`, {
            withCredentials: true
          });
          if (resp.status === 200) {
            await deletePresignedUrl([mapState.currentMapKey])
            addToast('Remove Map!', `Success! ${mapState.currentMapName} has been removed.`, 'success', 'white');
          } else {
            console.log('Failed to remove map');
          }
        } catch (error) {
          addToast('Remove Map!', `Error! An error occurred while removing map: ${mapState.currentMapName}`, 'danger', 'white');
          console.error('An error occurred while removing map: ', error);
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

      return () => {
        // Clean up code, if needed
      };
    }
  }, []); // Empty dependency array ensures that this effect runs once after the initial render

  const loadFromDB = async (mapName) => {
    try {
      const res = await axios.get(`http://localhost:3001/loadfromdb/${mapName}`, {
        withCredentials: true
      });

      const map = res.data;
      if (res.status === 200) {
        if (map.pdfData.map) {
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
    const length = maps.length
    if (length > 0) {
      const firstMap = maps[length-1];
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
  }, [maps]);

  return (
    <SkidProvider>
      <AddOrEditSkidModal
        mousePosition={skidMarkerState.mousePosition}
        editSkid={skidMarkerState.editSkid}
        _account={account}
        showModal={showAddSkidModal}
        setShowModal={setShowSkidModal}
      />
      <div className="container" style={{ marginTop: '50px' }}>
        <div id="map-buttons">
          <div style={{ float: 'right' }}>
            <div className="btn-group mb-3" id="button-container" role="group">
              {showAddPoint && (
                <AddSkidButton
                  enableMarker={enableMarker}
                  setEnableMarker={setEnableMarker}
                  pdfContainerRef={pdfContainerRef}
                />
              )}

              <Button variant="outline-secondary" onClick={openEditGeneralHazards}>
                Edit General Hazards
              </Button>

              {showRemoveMap && (
                <Button variant="outline-danger" onClick={openConfirmRemoveMap}>
                  Delete
                </Button>
              )}

              <UploadMapButton _account={account} />
            </div>
          </div>

          <div className="btn-group mb-3" id="button-container" role="group">
            <Button variant="outline-secondary" disabled>
              Current Maps
            </Button>

            {maps.length > 0 &&
              maps.map((map) => (
                <Button
                  key={map._id}
                  className="pdf-button"
                  variant="outline-secondary"
                  data-id={map._id}
                  value={map.name}
                  onClick={() => handleMapClick(map)}>
                  {map.name}
                </Button>
              ))}
          </div>
        </div>
        <div
          ref={pdfContainerRef}
          id="pdf-container"
          className="pdf-container"
          style={{ zIndex: 1 }}>
          <MapViewer
            percentage={percentage}
            enableMarker={enableMarker}
            setShowSkidModal={setShowSkidModal}
            editGeneralHazardsModalVisible={editGeneralHazardsModalVisible}
            setEditGeneralHazardsModalVisible={setEditGeneralHazardsModalVisible}
          />
        </div>
      </div>
    </SkidProvider>
  );
};

export default Maps;
