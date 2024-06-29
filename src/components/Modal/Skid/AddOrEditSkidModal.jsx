import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useSkidModal } from './SkidModalContext';
import { useMap } from '../../Map/MapContext';
import { Anchor, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';
import { useAlertMessage } from '../../AlertMessage';
import { useSkidMarker } from '../../SkidMarkerContext';
import PropTypes from 'prop-types';
import { getPresignedUrl, uploadToPresignedUrl } from '../../../hooks/useFileUpload';

const AddOrEditSkidModal = ({ mousePosition, editSkid, _account }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { mapState, setMapState } = useMap();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const [previewUrl, setPreviewUrl] = useState('');
  const getFilePathFromUrl = (url) => {
    const urlObject = new URL(url);
    return `${urlObject.origin}${urlObject.pathname}`;
  };
  const resetAddSkidModal = () => {
    //resetMarker();
    handleClose();

    setSkidMarkerState((prevState) => ({
      ...prevState,
      selectedMarker: null
    }));

    setMapState((prevState) => ({
      ...prevState,
      enableMarker: false
    }));
    setSkidModalState((prevState) => ({ ...prevState, isSkidModalVisible: false }));
  };

  const submitSkidModal = async () => {
    const id = new Date().getTime();
    const selectedFile = skidModalState.selectedCutPlan;
    console.log('submitted selectedSkidHazards: ', selectedFile);

    setShowSpinner(true);
    var cutPlans;
    if(selectedFile && selectedFile.name) {
      const [presignedUrl, key] = await getPresignedUrl(`${_account}/maps/skids`);
      const filePath = getFilePathFromUrl(presignedUrl);
      console.log('filepath of the file', filePath);
      console.log('the key', key);
      await uploadToPresignedUrl(presignedUrl, selectedFile);
      cutPlans = {fileName: selectedFile.name, url: filePath, key: key};
    } else {
      cutPlans =  skidModalState.selectedCutPlan
    }
   

    const skidObj = {
      _id: skidModalState._id,
      mapName: mapState.currentMapName,
      info: {
        crews: skidModalState.selectedCrew,
        cutPlans: cutPlans,
        pointName: skidModalState.skidName,
        selectedDocuments: skidModalState.selectedDocuments,
        siteHazards: skidModalState.selectedSkidHazards //TODO: need to change hazardData to siteHazards
      },
      point: {
        originalWidth: mapState.originalWidth,
        originalHeight: mapState.originalHeight,
        pdfHeight: mapState.pdfHeight,
        pdfWidth: mapState.pdfWidth,
        x: mousePosition.x,
        y: mousePosition.y
      }
    };

    console.log("hello there harry: ", skidObj.info.siteHazards);

    try {
      if (editSkid) {
        const resp = await axios.post('http://localhost:3001/update-pdf-point-object', skidObj, {
          withCredentials: true
        });

        if (resp.status === 200) {
          console.log("hello there u cunt", resp.data);
          setMapState((prevState) => {
            const existingIndex = prevState.currentMapMarkers.findIndex(
              (marker) => marker._id === resp.data._id
            );

            if (existingIndex !== -1) {
              // If the marker with the same _id exists, update it
              const updatedMarkers = [...prevState.currentMapMarkers];
              updatedMarkers[existingIndex] = resp.data;

              return {
                ...prevState,
                currentMapMarkers: updatedMarkers
              };
            } else {
              // If the marker with the same _id does not exist, add it
              return {
                ...prevState,
                currentMapMarkers: [...prevState.currentMapMarkers, resp.data]
              };
            }
          });

          setAlertMessageState((prevState) => ({
            ...prevState,
            toasts: [
              ...prevState.toasts,
              {
                id: id,
                heading: 'Update Skid',
                show: true,
                message: `Success! Skid: ${skidModalState.skidName} has been updated`,
                background: 'success',
                color: 'white'
              }
            ]
          }));

          resetAddSkidModal();
        }
      } else {
        await axios
          .post('http://localhost:3001/add-pdf-point-object', skidObj, { withCredentials: true })
          .then((response) => {
            console.log('resp: ', response.data);

            if (response.status === 200) {
              setMapState((prevState) => {
                // Filter out the marker with the same _id as selectedMarker
                const updatedMarkers = response.data;
                console.log('updatedMarkers: ', updatedMarkers);

                return {
                  ...prevState,
                  currentMapMarkers: updatedMarkers
                };
              });

              resetAddSkidModal();

              setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: [
                  ...prevState.toasts,
                  {
                    id: id,
                    heading: 'Add Skid',
                    show: true,
                    message: `Success! Skid: ${skidModalState.skidName} has been created`,
                    background: 'success',
                    color: 'white'
                  }
                ]
              }));
            }
          });

        
      }

      console.log('currentMapMarekrs: ', mapState.currentMapMarkers);
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Add Skid',
            show: true,
            message: `Error! adding ${skidModalState.skidName} skid. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error has occured while adding or updating skid object', err);
    } finally {
      setShowSpinner(false);

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
      _id: null,
      isSkidModalVisible: false,
      isAddDocModalVisible: false,
      isAddCutPlanModalVisible: false,
      isSelectHazardModalVisible: false,
      hazardModalVisible: false,
      selectedDocuments: [],
      selectedCutPlan: null,
      skidName: '',
      selectedCrew: [],
      selectedSkidHazards: [],
      selectedSkidHazardsData: [],
      selectedHazardData: {}
    }));
  };

  /**
   * Opens the Add Document Modal and hides the Skid Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openDocModal = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddDocModalVisible: true,
      isSkidModalVisible: false
    }));
  };

  /**
   * Opens the Cut Plan Modal and hides the Skid Modal by updating the state.
   * @function openCutPlanModal
   * @returns {void}
   */
  const openCutPlanModal = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isAddCutPlanModalVisible: true,
      isSkidModalVisible: false
    }));
  };

  /**
   * Opens the Add Site Hazard Modal and hides the Skid Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openSelectHazardModal = () => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isSkidModalEdit: false,
      isSelectHazardModalVisible: true,
      isSkidModalVisible: false,
      isSelectHazardsGeneral: false // SelectHazardsModal label will be Add Hazards
    }));
  };

  /**
   * Handles the removal of a document from the selected documents list.
   * @param {File} file - The file that needs to be removed.
   * @returns {void}
   */
  const removeSkidDoc = (file) => {
    setSkidModalState((prevState) => {
      const updatedDocs = prevState.selectedDocuments.filter((doc) => doc._id !== file._id);

      return {
        ...prevState,
        selectedDocuments: updatedDocs
      };
    });
  };

  /**
   * Handles the removal of a skid hazard from the selected skid hazards list.
   * @param {*} event - event of the button click
   * @param {*} hazardToRemove - the hazard object to be removed
   */
  const removeSkidHazard = (event, hazardToRemove) => {
    event.stopPropagation();
    console.log('hazard tobe removed', skidModalState.selectedSkidHazards)
    setSkidModalState((prevState) => {
      const updatedHazards = prevState.selectedSkidHazardsData.filter(
        (hazard) => hazard._id!== hazardToRemove
      );
      console.log('ytda', updatedHazards);

      const hazardsIds = updatedHazards.map(hazard => hazard._id);

      return {
        ...prevState,
        selectedSkidHazardsData: updatedHazards,
        selectedSkidHazards: hazardsIds
      };
    });
  };

  

  //Used for viewing pdf in a new tab - Add/Edit Skid Cut Plan Viewer
  const openPdfInNewTab = (item) => {
    if (item instanceof File) {
      console.log('openPDFinnewTab', item);
      const fileURL = URL.createObjectURL(item);
      window.open(fileURL, '_blank');
    } else {
      window.open(item.url, '_blank');

    }
    
    /* const cleanBase64String = item.base64String.replace(/data:.*;base64,/, '');

    const byteCharacters = atob(cleanBase64String);
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

    window.open(objectUrl, '_blank'); */
  };

  const handleHazardClick = (hazard) => {
    setSkidModalState((prevState) => ({
      ...prevState,
      hazardModalVisible: true,
      isSkidModalVisible: false,
      selectedHazardData: hazard
    }));
  };

  var name;

  if (skidModalState.isSkidModalEdit) {
    name = 'Edit';
  } else {
    name = 'Add';
  }

  return (
    <>
      <Modal
        show={skidModalState.isSkidModalVisible}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{name} Skid</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="add-skid-form" className="row g-3">
            <Form.Group className="col-md-12">
              <Form.Label>Add Skid name:</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Skid Name"
                title="Map Name"
                id="mapname-input"
                value={skidModalState.skidName}
                onChange={(e) =>
                  setSkidModalState((prevState) => ({ ...prevState, skidName: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label className="form-label">Select Crew</Form.Label>
              <Form.Group id="crew-checkboxes" className="d-flex justify-content-center">
                {mapState.crewTypes.map((crewMember) => (
                  <Form.Group className="form-check form-check-inline" key={crewMember}>
                    <Form.Control
                      className="form-check-input crew-checkbox"
                      type="checkbox"
                      id={crewMember}
                      value={crewMember}
                      checked={skidModalState.selectedCrew.includes(crewMember)}
                      onChange={(e) => {
                        const updatedCrew = e.target.checked
                          ? [...skidModalState.selectedCrew, crewMember]
                          : skidModalState.selectedCrew.filter((name) => name !== crewMember);
                        setSkidModalState((prevState) => ({
                          ...prevState,
                          selectedCrew: updatedCrew
                        }));
                      }}
                    />
                    <Form.Label className="form-check-label" htmlFor={crewMember}>
                      {crewMember}
                    </Form.Label>
                  </Form.Group>
                ))}
              </Form.Group>
            </Form.Group>
            <Form.Group className="col-md-12">
              <Form.Label htmlFor="siteDocs" className="form-label">
                Site Documents
              </Form.Label>
              <Form.Group className="input-group">
                <Button
                  type="button"
                  id="siteDocs"
                  className="btn btn-secondary btn-block"
                  onClick={openDocModal}
                >
                  Add Document
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group>
              <ListGroup className="doc-list list-group">
                {skidModalState.selectedDocuments.map((file) => (
                  <ListGroupItem
                    key={file._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <Anchor
                      key={`${file._id}-link`}
                      // eslint-disable-next-line no-undef
                      href={process.env.REACT_APP_URL + file.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {file.fileName}
                    </Anchor>
                    <Button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeSkidDoc(file)}
                    >
                      Remove
                    </Button>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Form.Group>

            <Form.Group className="col-md-12">
              <Form.Label htmlFor="siteDocs" className="form-label">
                Weekly Cut Plan
              </Form.Label>
              <Form.Group className="input-group">
                <Button
                  type="button"
                  id="siteCutPlan"
                  className="btn btn-secondary btn-block"
                  onClick={openCutPlanModal}
                >
                  Add Cut Plan
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group className="col-md-12">
              <ListGroup className="cutplan-list list-group">
                {skidModalState.selectedCutPlan !== null && (
                  <ListGroup className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    <ListGroupItem
                      className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                      onClick={() => openPdfInNewTab(skidModalState.selectedCutPlan)}
                      style={{ cursor: 'pointer' }}
                    >
                      {skidModalState.selectedCutPlan.fileName || skidModalState.selectedCutPlan.name}
                    </ListGroupItem>
                  </ListGroup>
                )}
              </ListGroup>
            </Form.Group>

            <Form.Group className="col-md-12">
              <Form.Label htmlFor="siteHazards" className="form-label">
                Site Hazards
              </Form.Label>
              <Form.Group className="input-group">
                <Button
                  type="button"
                  id="siteHazards"
                  className="btn btn-secondary btn-block"
                  onClick={openSelectHazardModal}
                >
                  Add Hazard
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group className="col-md-12">
              <ListGroup className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {skidModalState.selectedSkidHazardsData && skidModalState.selectedSkidHazardsData.map((hazard) => (
                  <ListGroupItem
                    key={hazard.id}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    style={{ textAlign: 'center' }}
                    onClick={() => handleHazardClick(hazard)}
                  >
                    <span>
                      {hazard.id} : {hazard.title}
                    </span>
                    <Button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={(event) => removeSkidHazard(event, hazard._id)}
                    >
                      Remove
                    </Button>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submitSkidModal}>
            {showSpinner ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="visually-hidden">Loading...</span>
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddOrEditSkidModal.propTypes = {
  editSkid: PropTypes.any.isRequired,
  mousePosition: PropTypes.object.isRequired,
  _account: PropTypes.any,
};

export default AddOrEditSkidModal;
