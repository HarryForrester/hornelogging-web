import React, { useState, useEffect } from 'react';
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
import { Formik } from 'formik';
import { useSkid } from '../../../context/SkidContext';
import { useCrews } from '../../../context/CrewContext';
import { useLibraryFile } from '../../../context/LibraryFileContext';
import AddDocModal from '../AddDocModal';
import AddCutPlanModal from '../AddCutPlanModal';
import SelectHazardsModal from '../SelectHazardsModal';
import HazardModal from '../HazardModal';
import * as Yup from 'yup';

const AddOrEditSkidModal = ({ showModal, setShowModal, mousePosition, editSkid, _account }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidState, setSkidState } = useSkid(); //holds the information for formik when opening and closing modals to add files, hazards, cutplans to skid
  const { mapState, setMapState } = useMap();
  const { crews } = useCrews(); 
  const { libraryFiles } = useLibraryFile();
  const { addToast } = useAlertMessage();
  const {setSkidMarkerState } = useSkidMarker();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const [formikState] = useState(null);

  const [cutPlanModalVisible, setCutPlanModalVisible] = useState(false);
  const [selectHazardModalVisible, setSelectHazardModalVisible] = useState(false);
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [hazardModalVisible, setHazardModalVisible] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState({});
  const getFilePathFromUrl = (url) => {
    const urlObject = new URL(url);
    return `${urlObject.origin}${urlObject.pathname}`;
  };

  const resetAddSkidModal = () => {
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

  const submitSkidModal = async (values) => {
    const id = new Date().getTime();
    const selectedFile = values.selectedCutPlan;

    setShowSpinner(true);
    var cutPlans;

    if(selectedFile && selectedFile.name) {
      const [presignedUrl, key] = await getPresignedUrl(`${_account}/maps/skids`, selectedFile.type);
      const filePath = getFilePathFromUrl(presignedUrl);
      await uploadToPresignedUrl(presignedUrl, selectedFile, selectedFile.type);
      cutPlans = {fileName: selectedFile.name, url: filePath, key: key};
    } else {
      cutPlans =  values.selectedCutPlan
    }

    const skidObj = {
      _id: skidState.selectedSkidId,
      mapName: mapState.currentMapName,
      info: {
        crews: values.selectedCrew,
        cutPlans: cutPlans,
        pointName: values.skidName,
        selectedDocuments: values.selectedDocuments,
        siteHazards: values.selectedSkidHazards
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

    try {
      if (editSkid) {
        const resp = await axios.post('http://localhost:3001/update-pdf-point-object', skidObj, {
          withCredentials: true
        });
        if (resp.status === 200) {
          const val = resp.data;

          setMapState((prevState) => {
            const existingIndex = prevState.currentMapMarkers.findIndex(
              (marker) => marker._id === val._id
            );

            if (existingIndex !== -1) {
              // If the marker with the same _id exists, update it
              const updatedMarkers = [...prevState.currentMapMarkers];
              updatedMarkers[existingIndex] = val;
    
              return {
                ...prevState,
                currentMapMarkers: updatedMarkers
              };
            } else {
              // If the marker with the same _id does not exist, add it
              return {
                ...prevState,
                currentMapMarkers: [...prevState.currentMapMarkers, val]
              };
            }
          });

          setSkidState((prevState) => ({
            ...prevState,
            formik: {
              ...prevState.formik,
              values: {
                ...prevState?.formik?.values,
                skidName: val.info.pointName,
                selectedCrew: val.info.crews,
                selectedDocuments: val.info.selectedDocuments,
                selectedCutPlan: val.info.cutPlans,
                siteHazards: val.info.siteHazards,
              },
            },
          })); 
          addToast('Skid Updated!', `Success! Skid: ${skidModalState.skidName} has been updated`, 'success', 'white');
  
          /* setSkidState((prevState) => ({
            ...prevState,
            skidModalVisible: false,
          })) */
         setShowModal(false);
          setSkidModalState((prevState) => ({
            ...prevState,
            isSkidModalEdit: false,
            isSkidModalAdd: false
          }))
        }
      } else {
        await axios
          .post('http://localhost:3001/add-pdf-point-object', skidObj, { withCredentials: true })
          .then((response) => {

            if (response.status === 200) {
              setMapState((prevState) => {
                // Filter out the marker with the same _id as selectedMarker
                const updatedMarkers = response.data;

                return {
                  ...prevState,
                  currentMapMarkers: updatedMarkers
                };
              });

              resetAddSkidModal();
              setSkidModalState((prevState) => ({
                ...prevState,
                isSkidModalEdit: false,
                isSkidModalAdd: false
              }))
              addToast('Skid Added!', `Success! Skid: ${skidModalState.skidName} has been created!`, 'success', 'white');
            }
          });

        
      }

    } catch (err) {
      addToast('Error!', `An error occurred while adding skid ${skidModalState.skidName}. Please try again`, 'danger', 'white');
      console.error('Error has occured while adding or updating skid object', err);
    } finally {
      setShowSpinner(false);
    } 
  };

  const handleClose = () => {
   /*  setSkidState((prevState) => ({
      ...prevState,
      skidModalVisible: false,
      docModalVisible: false
    })) */
   setShowModal(false);
   setDocModalVisible(false);
  };
  
  /**
   * Opens the Add Document Modal and hides the Skid Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openDocModal = (formik) => {
    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        values: formik.values,
        touched: formik.touched,
        errors: formik.errors,
      },
      //skidModalVisible: false, // hide add/edit skid modal
      //docModalVisible: true, // show doc modal 
    }));
    setShowModal(false);
    setDocModalVisible(true);
  };

  /**
   * Opens the Cut Plan Modal and hides the Skid Modal by updating the state.
   * @function openCutPlanModal
   * @returns {void}
   */
  const openCutPlanModal = (formik) => {
    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        values: formik.values,
        touched: formik.touched,
        errors: formik.errors,
      },
      //skidModalVisible: false, // hide add/edit skid modal
      //cutPlanModalVisible: true, // show doc modal 
    }));
    setCutPlanModalVisible(true);
    setShowModal(false);
  };

  /**
   * Opens the Add Site Hazard Modal and hides the Skid Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openSelectHazardModal = (formik) => {
   /*  setSkidModalState((prevState) => ({
      ...prevState,
      isSkidModalEdit: false,
      isSelectHazardsGeneral: false // SelectHazardsModal label will be Add Hazards
    })); */
    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        values: formik.values,
        touched: formik.touched,
        errors: formik.errors,
      },
      //skidModalVisible: false, // hide add/edit skid modal
      //selectHazardModalVisible: true, // show doc modal 
    }));
    setShowModal(false);
    setSelectHazardModalVisible(true);
  };

  /**
   * Handles the removal of a document from the selected documents list.
   * @param {File} file - The file that needs to be removed.
   * @returns {void}
   */
  const removeSkidDoc = (file, formik) => {
    const updatedDocs = formik.values.selectedDocuments.filter((doc) => doc !== file._id);
    formik.setFieldValue('selectedDocuments', updatedDocs);
  };

  const removeCutPlan = (event, formik) => {
    event.stopPropagation();
    formik.setFieldValue('selectedCutPlan', null)
  }
  
  /**
   * Handles the removal of a skid hazard from the selected skid hazards list.
   * @param {*} event - event of the button click
   * @param {*} hazardToRemove - the hazard object to be removed
   */
  const removeSkidHazard = (event, hazardToRemove, formik) => {
    event.stopPropagation();
    const updatedHazards = formik.values.selectedSkidHazards.filter((hazard) => hazard !== hazardToRemove._id);
    formik.setFieldValue('selectedSkidHazards', updatedHazards);
  };

  //Used for viewing pdf in a new tab - Add/Edit Skid Cut Plan Viewer
  const openPdfInNewTab = (item) => {
    if (item instanceof File) {
      const fileURL = URL.createObjectURL(item);
      window.open(fileURL, '_blank');
    } else {
      window.open(item.url, '_blank');

    }
  };

  const handleHazardClick = (hazard) => {
    /* setSkidModalState((prevState) => ({
      ...prevState,
      hazardModalVisible: true,
      isSkidModalVisible: false,
      selectedHazardData: hazard
    })); */
    setHazardModalVisible(true);
    setSelectedHazard(hazard);

  };

 

  var name;

  if (skidModalState.isSkidModalEdit) {
    name = 'Edit';
  } else {
    name = 'Add';
  }
  const form = skidState?.formik?.values;
  const initValues = {
    skidName: form?.skidName || '',
    selectedCrew: form?.selectedCrew || [],
    selectedDocuments: form?.selectedDocuments || [],
    selectedCutPlan: form?.selectedCutPlan || null,
    selectedSkidHazards: form?.selectedSkidHazards || [],
  }

  const handleDocModalClose = () => {
    setDocModalVisible(false); // Closes "AddDocModal"
    setShowModal(true); // Shows "AddOrEditSkidModal"
  }

  const handleCutPlanClose = () => {
    setCutPlanModalVisible(false);
    setShowModal(true);
  }

  const handleSelectHazardModalClose = () => {
    setSelectHazardModalVisible(false);
    setShowModal(true);
  }

  const handleHazardModalClose = () => {
    setHazardModalVisible(false);
    setShowModal(true);
  }

  const handleCheckboxChange = (hazard) => {
    const hazardId = hazard._id;

    const selectedSkidHazards = skidState.formik?.values?.selectedSkidHazards || [];
      const updatedHazards = selectedSkidHazards.includes(hazardId)
        ? selectedSkidHazards.filter((id) => id !== hazardId)
        : [...selectedSkidHazards, hazardId];

      setSkidState((prevState) => ({
        ...prevState,
        formik: {
          ...prevState.formik,
          values: {
            ...prevState.formik?.values,
            selectedSkidHazards: updatedHazards,
          },
        },
      }));
  }

  return (
    <>
      <AddDocModal show={docModalVisible} close={handleDocModalClose} />
      <AddCutPlanModal showModal={cutPlanModalVisible} handleClose={handleCutPlanClose} />
      <HazardModal showModal={hazardModalVisible} handleClose={handleHazardModalClose} selectedHazard={selectedHazard} />
      <SelectHazardsModal
        title="Select Skid Hazards"
        showModal={selectHazardModalVisible}
        handleClose={handleSelectHazardModalClose}
        handleCheckboxChange={handleCheckboxChange}
        selectedHazards={skidState.formik?.values?.selectedSkidHazards}
      />
      <div data-testid="add-or-edit-skid-modal">
        <Modal
          show={showModal}
          onHide={handleClose}
          contentClassName="addOrEditSkidModal-content"
          className="addOrEditSkid-modal"
          backdrop="static">
          <Modal.Header closeButton data-testid="addOrEditSkid-modal-header">
            <Modal.Title>{name} Skid</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Formik
              initialValues={formikState ? formikState.values : initValues}
              validationSchema={Yup.object({
                skidName: Yup.string()
                  .max(15, 'Must be 15 characters or less')
                  .required('Skid name is required'),
                selectedCrew: Yup.array().min(1, 'At least one crew member is required')
              })}
              onSubmit={(values) => {
                submitSkidModal(values);
              }}>
              {(formik) => (
                <Form id="add-skid-form" className="row g-3">
                  <Form.Group className="col-md-12">
                    <Form.Label htmlFor="skidName">Add Skid name:</Form.Label>
                    <Form.Control
                      type="text"
                      id="skidName"
                      {...formik.getFieldProps('skidName')}
                      isInvalid={formik.touched.skidName && formik.errors.skidName}
                    />
                    {formik.touched.skidName && formik.errors.skidName ? (
                      <div className="invalid-feedback d-block">{formik.errors.skidName}</div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="col-md-12">
                    <Form.Label className="form-label" id="crew-label">
                      Select Crew
                    </Form.Label>
                    <Form.Group
                      id="crew-checkboxes"
                      className="d-flex justify-content-center"
                      aria-labelledby="crew-label">
                      {crews.map((crewMember) => (
                        <Form.Group className="form-check form-check-inline" key={crewMember._id}>
                          <Form.Check
                            className="mb-2"
                            type="checkbox"
                            id={`crew-member-${crewMember._id}`}
                            value={crewMember.name}
                            checked={formik.values.selectedCrew.includes(crewMember._id)}
                            onChange={(e) => {
                              const updatedCrew = e.target.checked
                                ? [...formik.values.selectedCrew, crewMember._id]
                                : formik.values.selectedCrew.filter(
                                    (name) => name !== crewMember._id
                                  );
                              formik.setFieldValue('selectedCrew', updatedCrew);
                            }}
                            isInvalid={formik.touched.selectedCrew && formik.errors.selectedCrew}
                          />
                          <Form.Label
                            className="form-check-label"
                            htmlFor={`crew-member-${crewMember._id}`}>
                            {crewMember.name}
                          </Form.Label>
                        </Form.Group>
                      ))}
                    </Form.Group>
                    {formik.touched.selectedCrew && formik.errors.selectedCrew ? (
                      <div className="invalid-feedback d-block">{formik.errors.selectedCrew}</div>
                    ) : null}
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
                        aria-label="Add Document"
                        onClick={() => openDocModal(formik)}>
                        Add Document
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group>
                    <ListGroup
                      className="doc-list list-group"
                      style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {formik.values.selectedDocuments
                        .map((id) => libraryFiles.files.find((file) => file._id === id))
                        .filter((file) => file)
                        .map((file) => (
                          <ListGroupItem
                            key={file._id}
                            className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                            onClick={() => window.open(file.fileUrl, '_blank')}
                            style={{ cursor: 'pointer' }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                              }}>
                              <Anchor
                                key={`${file._id}-link`}
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                                style={{
                                  maxWidth: '300px',
                                  display: 'inline-block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: 'black'
                                }}
                                onClick={(e) => e.stopPropagation()}>
                                {file.fileName}
                              </Anchor>
                              <Button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSkidDoc(file, formik);
                                }}>
                                Remove
                              </Button>
                            </div>
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
                        data-testid="openCutPlanModal"
                        className="btn btn-secondary btn-block"
                        onClick={() => openCutPlanModal(formik)}>
                        Add Cut Plan
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="col-md-12">
                    <ListGroup className="cutplan-list list-group">
                      {formik.values.selectedCutPlan !== null && (
                        <ListGroup
                          className="list-group"
                          style={{ maxHeight: '100px', overflowY: 'auto' }}>
                          <ListGroupItem
                            className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                            onClick={() => openPdfInNewTab(formik.values.selectedCutPlan)}
                            style={{ cursor: 'pointer' }}>
                            {formik.values.selectedCutPlan.fileName ||
                              formik.values.selectedCutPlan.name}
                            <Button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={(event) => removeCutPlan(event, formik)}>
                              Remove
                            </Button>
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
                        data-testid="openHazardModal"
                        className="btn btn-secondary btn-block"
                        onClick={() => openSelectHazardModal(formik)}>
                        Add Hazard
                      </Button>
                    </Form.Group>
                  </Form.Group>

                  <Form.Group className="col-md-12">
                    <ListGroup
                      className="list-group"
                      style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {formik.values.selectedSkidHazards
                        .map((id) => mapState.hazards.find((hazard) => hazard._id === id))
                        .filter((hazard) => hazard)
                        .map((hazard) => (
                          <ListGroupItem
                            key={hazard._id}
                            className="list-group-item d-flex justify-content-between align-items-center list-group-item-action skid-hazard-item"
                            style={{
                              textAlign: 'center',
                              backgroundColor: hazard.color,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleHazardClick(hazard)}>
                            <span>
                              {hazard.id} : {hazard.title}
                            </span>
                            <Button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={(event) => removeSkidHazard(event, hazard, formik)}>
                              Remove
                            </Button>
                          </ListGroupItem>
                        ))}
                    </ListGroup>
                  </Form.Group>
                  <Button type="submit" variant="primary" onClick={formik.handleSubmit}>
                    {showSpinner ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="visually-hidden">Loading...</span>
                      </>
                    ) : (
                      'Save changes'
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

AddOrEditSkidModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  editSkid: PropTypes.any.isRequired,
  mousePosition: PropTypes.object.isRequired,
  _account: PropTypes.any,
};

export default AddOrEditSkidModal;
