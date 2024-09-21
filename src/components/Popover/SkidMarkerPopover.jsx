import React, { useState } from 'react';
import RemoveSkidButton from '../Button/RemoveSkidButton';
import EditSkidButton from '../Button/EditSkidButton';
import HazardModal from '../Modal/HazardModal';
import { useMap } from '../Map/MapContext';
import { useAlertMessage } from '../AlertMessage';
import axios from 'axios';
import { deletePresignedUrl } from '../../hooks/useFileDelete';
import { useSkid } from '../../context/SkidContext';
import { useLibraryFile } from '../../context/LibraryFileContext';
import { usePersonFile } from '../../context/PersonFileContext';
import { useCrews } from '../../context/CrewContext';
import PropTypes from 'prop-types';
import AddOrEditSkidModal from '../Modal/Skid/AddOrEditSkidModal';

const SkidMarkerPopover = ({showPopover, setShowPopover, peopleByCrew}) => {
  const { mapState, setMapState } = useMap();
  const { addToast } = useAlertMessage();
  const { libraryFiles} = useLibraryFile();
  const { personFiles} = usePersonFile();
  const { crews } = useCrews();
  const { skidState } = useSkid(); // holds information about the selected skid
  console.log('meow!', skidState)

  const [popoverPersonVisible, setPopoverPersonVisible] = useState(false);
  const [popoverCrewVisible, setpopoverCrewVisible] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedHazard, setSelectedHazard] = useState({});
  const [editSkid, setEditSkid] = useState(false);
  const [hazardModalVisible, setHazardModalVisible] = useState(false);
  const [editSkidModalVisible, setEditSkidModalVisible] = useState(false);

  const toggleSkidCrew = (crew) => {
    setSelectedCrew(crew);
    setpopoverCrewVisible((prev) => !prev);
    setPopoverPersonVisible((prev) => prev ? false: prev)
  };

  const handleHazardClick = (hazard) => {
    setHazardModalVisible(true);
    setShowPopover(false);
    setSelectedHazard(hazard);

  };

  const openPdfInNewTab = (item) => {
    window.open(item.url, '_blank');
  };

  const editSelectedSkid = async () => {
      setEditSkidModalVisible(true);
      setEditSkid(true);
  };

  const removeSelectedSkid = async () => {
    try {
      if (skidState.formik.selectedCutPlan !== null) {
        const cutPlanKey = skidState?.formik?.values?.selectedCutPlan?.key;
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
        addToast('Skid Removed!',`Success! Skid: ${skidState?.formik?.values?.skidName} has been removed`, 'success', 'white' )
      }
  
      setShowPopover(false);
  
      setMapState((prevState) => ({
        ...prevState,
        enableMarker: false
      }));  
    } catch (error) {
      console.error('Error removing skid:', error);
      // Show error toast notification on any caught error
      addToast(
        'Error Removing Skid!',
        `An error occurred while removing skid: ${skidState?.formik?.values?.skidName}. Please try again.`,
        'danger',
        'white'
      );
    }

    
  };
  
  const handlePersonClick = async (person) => {
    setSelectedPerson(person);
    setPopoverPersonVisible((prev) => !prev);
  }

  const handleHazardModalClose = () => {
    setHazardModalVisible(false);
    setShowPopover(true)
  }
  return (
    <>
    <HazardModal showModal={hazardModalVisible} handleClose={handleHazardModalClose} selectedHazard={selectedHazard}/>
    <AddOrEditSkidModal title="Edit Skid" mousePosition={skidState.selectedSkidPos} setShowModal={setEditSkidModalVisible} showModal={editSkidModalVisible} editSkid={editSkid} _account={2}/>
      {showPopover && (
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
          {!popoverCrewVisible ? (
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
                    const crew = crews.find((mapCrew) => mapCrew._id === crewId);
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
                        {skidState?.formik?.values?.selectedDocuments.map(id => libraryFiles.files.find(file => file._id === id)).filter(file => file).map((item, index) => (
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
          ) : !popoverPersonVisible ? (
            <>
              <div className="popover-header">
                <button type="button" className="btn btn-link" onClick={() => toggleSkidCrew(null)}>
                  ←
                </button>
                Crew: {selectedCrew.name}
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
                  {peopleByCrew[selectedCrew._id] && peopleByCrew[selectedCrew._id].map((person) => (
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
                      {person.firstName + " " + person.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="popover-header">
                <button type="button" className="btn btn-link" onClick={() => setPopoverPersonVisible((prev) => !prev)}>
                  ←
                </button>
                {selectedPerson.firstName + " " + selectedPerson.lastName} <span className="smaller-text">({selectedPerson.role})</span>
              </div>
              <div className="popover-body">
                <ul className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {Object.keys(selectedPerson?.filesByPerson || {}).length === 0 ? (
                    <p>No files available</p>
                  ) : (
                    Array.from(new Set(selectedPerson?.filesByPerson?.map((item) => item.type))).map((type) => {
                      console.log('mapapapa', type)
                      console.log('hahaha', personFiles.personFileTypes)
                      const matchingFileType = personFiles.personFileTypes.find((fileType) => fileType._id === type);
                      console.log('matching file type', matchingFileType)
                      return(
                        <div key={type}>
                          <div
                            style={{
                              fontWeight: 'bold',
                              fontSize: '100%',
                              textAlign: 'center',
                              paddingBottom: '10px'
                            }}
                          >
                            {matchingFileType ? matchingFileType.name : 'Unknown File Type'}
                          </div>
                          <ul className="list-group">
                            {selectedPerson?.filesByPerson?.filter((item) => item.type === type).map((item) => (
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
                    )})
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

SkidMarkerPopover.propTypes = {
  showPopover: PropTypes.bool.isRequired,
  setShowPopover: PropTypes.func.isRequired,
  peopleByCrew: PropTypes.array.isRequired
}

export default SkidMarkerPopover;
