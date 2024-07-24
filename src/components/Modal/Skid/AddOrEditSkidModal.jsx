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
import { Formik,useFormik } from 'formik';
import * as Yup from 'yup';
import { useSkid } from '../../../context/SkidContext';
const AddOrEditSkidModal = ({ mousePosition, editSkid, _account }) => {
  const { skidModalState, setSkidModalState } = useSkidModal();
  const { skidState, setSkidState } = useSkid(); //holds the information for formik when opening and closing modals to add files, hazards, cutplans to skid
  const { mapState, setMapState } = useMap();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { skidMarkerState, setSkidMarkerState } = useSkidMarker();
  const [showSpinner, setShowSpinner] = useState(false); // shows spinner while submitting to server
  const [previewUrl, setPreviewUrl] = useState('');

  const [formikState, setFormikState] = useState(null);
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

  const submitSkidModal = async (values) => {
    const { formik } = skidState;

    const id = new Date().getTime();
    const selectedFile = values.selectedCutPlan;

    setShowSpinner(true);
    var cutPlans;
    if(selectedFile && selectedFile.name) {
      const [presignedUrl, key] = await getPresignedUrl(`${_account}/maps/skids`, selectedFile.type);
      const filePath = getFilePathFromUrl(presignedUrl);
      console.log('filepath of the file', filePath);
      await uploadToPresignedUrl(presignedUrl, selectedFile, selectedFile.type);
      cutPlans = {fileName: selectedFile.name, url: filePath, key: key};
    } else {
      cutPlans =  values.selectedCutPlan
    }
    console.log('values bro', values)

    const skidObj = {
      _id: skidState.selectedSkidId,
      mapName: mapState.currentMapName,
      info: {
        crews: values.selectedCrew,
        cutPlans: cutPlans,
        pointName: values.skidName,
        selectedDocuments: values.selectedDocuments,
        siteHazards: values.selectedSkidHazards //TODO: need to change hazardData to siteHazards
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

    console.log("hello there harry: ", skidObj);

    try {
      if (editSkid) {
        console.log("edit mode", skidState)
        const resp = await axios.post('http://localhost:3001/update-pdf-point-object', skidObj, {
          withCredentials: true
        });
        console.log('cunty cunt', skidState.formik);
        if (resp.status === 200) {
          const val = resp.data;
          console.log('resp.data', val);

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
                ...prevState.formik.values,
                skidName: val.info.pointName,
                selectedCrew: val.info.crews,
                selectedDocuments: val.info.selectedDocuments,
                selectedCutPlan: val.info.cutPlans,
                siteHazards: val.info.siteHazards,
              },
            },
          })); 

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

          //resetAddSkidModal();
          setSkidState((prevState) => ({
            ...prevState,
            skidModalVisible: false,
          }))
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
              setSkidModalState((prevState) => ({
                ...prevState,
                isSkidModalEdit: false,
                isSkidModalAdd: false
              }))

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
    setSkidState((prevState) => ({
      ...prevState,
      //formik: null,
      skidModalVisible: false,
      docModalVisible: false
    }))
    /* setSkidModalState((prevState) => ({
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
    })); */
  };

  
  /**
   * Opens the Add Document Modal and hides the Skid Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openDocModal = (formik) => {
    console.log('openDocModal called', formik);
    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        values: formik.values,
        touched: formik.touched,
        errors: formik.errors,
      },
      skidModalVisible: false, // hide add/edit skid modal
      docModalVisible: true, // show doc modal 
    }))
    /* setFormikState({
      values: formik.values,
      touched: formik.touched,
      errors: formik.errors,
    }); */

    /* setSkidModalState((prevState) => ({
      ...prevState,
      isSkidModalVisible: false,
      isAddDocModalVisible: true
    }));    */
  };

  /**
   * Opens the Cut Plan Modal and hides the Skid Modal by updating the state.
   * @function openCutPlanModal
   * @returns {void}
   */
  const openCutPlanModal = (formik) => {
    /* setSkidModalState((prevState) => ({
      ...prevState,
      isAddCutPlanModalVisible: true,
      isSkidModalVisible: false
    })); */
    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        values: formik.values,
        touched: formik.touched,
        errors: formik.errors,
      },
      skidModalVisible: false, // hide add/edit skid modal
      cutPlanModalVisible: true, // show doc modal 
    }))
  };

  /**
   * Opens the Add Site Hazard Modal and hides the Skid Modal by updating the state.
   * @function openDocModal
   * @returns {void}
   */
  const openSelectHazardModal = (formik) => {
    setSkidModalState((prevState) => ({
      ...prevState,
      isSkidModalEdit: false,
      //isSelectHazardModalVisible: true,
      //isSkidModalVisible: false,
      isSelectHazardsGeneral: false // SelectHazardsModal label will be Add Hazards
    }));
    setSkidState((prevState) => ({
      ...prevState,
      formik: {
        values: formik.values,
        touched: formik.touched,
        errors: formik.errors,
      },
      skidModalVisible: false, // hide add/edit skid modal
      selectHazardModalVisible: true, // show doc modal 
    }))
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
    console.log('hazardToRemove', hazardToRemove);
    const updatedHazards = formik.values.selectedSkidHazards.filter((hazard) => hazard !== hazardToRemove._id);
    formik.setFieldValue('selectedSkidHazards', updatedHazards);
    /* setSkidModalState((prevState) => {
      const updatedHazards = prevState.selectedSkidHazardsData.filter(
        (hazard) => hazard._id!== hazardToRemove._id
      );
      console.log('ytda', updatedHazards);

      const hazardsIds = updatedHazards.map(hazard => hazard._id);

      return {
        ...prevState,
        selectedSkidHazardsData: updatedHazards,
        selectedSkidHazards: hazardsIds
      };
    }); */
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
  const form = skidState?.formik?.values;
  const initValues = {
              skidName: form?.skidName || '',
              selectedCrew: form?.selectedCrew || [],
              selectedDocuments: form?.selectedDocuments || [],
              selectedCutPlan: form?.selectedCutPlan || null,
              selectedSkidHazards: form?.selectedSkidHazards || [],
            }

  return (
    <>
      <Modal
        show={skidState.skidModalVisible}
        onHide={handleClose}
        backdrop="static"
        
      >
        <Modal.Header closeButton>
          <Modal.Title>{name} Skid</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
          
          initialValues={formikState ? formikState.values : initValues}

            /* validationSchema={Yup.object({
              skidName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
              selectedCrew: Yup.array().min(1, 'At least one crew member is required'),

            })} */
            onSubmit={values => {
              console.log(values);
              //console.log("ahha bro", skidModalState)
              submitSkidModal(values);
            }}
          >
            {formik => (
              <Form id="add-skid-form" className="row g-3">
              <Form.Group className="col-md-12">
                <Form.Label>Add Skid name:</Form.Label>
                <Form.Control
                  type="text"
                  id="skidName"
                  {...formik.getFieldProps('skidName')}
                  isInvalid={formik.touched.skidName && formik.errors.skidName}
                  />
                {
                  formik.touched.skidName && formik.errors.skidName ? (
                    <div className="invalid-feedback d-block">{formik.errors.skidName}</div>
                  ) : null
                }

              </Form.Group>

              <Form.Group className="col-md-12">
                <Form.Label className="form-label">Select Crew</Form.Label>
                <Form.Group id="crew-checkboxes" className="d-flex justify-content-center">
                  {mapState.crewTypes.map((crewMember) => (
                    <Form.Group className="form-check form-check-inline" key={crewMember}>
                      <Form.Check
                        className="mb-2"
                        type="checkbox"
                        id={crewMember}
                        value={crewMember}
                        checked={formik.values.selectedCrew.includes(crewMember)}
                        onChange={(e) => {
                          const updatedCrew = e.target.checked
                            ? [...formik.values.selectedCrew, crewMember]
                            : formik.values.selectedCrew.filter((name) => name !== crewMember);
                          formik.setFieldValue('selectedCrew', updatedCrew);
                        }}
                        isInvalid={formik.touched.selectedCrew && formik.errors.selectedCrew}
                      />
                      <Form.Label className="form-check-label" htmlFor={crewMember}>
                        {crewMember}
                      </Form.Label>
                    </Form.Group>
                  ))}
                </Form.Group>
                {
                  formik.touched.skidName && formik.errors.skidName ? (
                    <div className="invalid-feedback d-block">{formik.errors.selectedCrew}</div>
                  ) : null
                }
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
                    onClick={() => openDocModal(formik)}
                  >
                    Add Document
                  </Button>
                </Form.Group>
              </Form.Group>

              <Form.Group>
              <ListGroup className="doc-list list-group">
              {formik.values.selectedDocuments
                .map(id => mapState.files.find(file => file._id === id))
                .filter(file => file)
                .map(file => (
                  <ListGroupItem
                    key={file._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
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
                        color: 'black', // Custom link color
                        
                      }}
                    >
                      {file.fileName}
                    </Anchor>
                    <Button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeSkidDoc(file, formik)}
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
                  onClick={() => openCutPlanModal(formik)}
                >
                  Add Cut Plan
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group className="col-md-12">
              <ListGroup className="cutplan-list list-group">
                {formik.values.selectedCutPlan !== null && (
                  <ListGroup className="list-group" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    <ListGroupItem
                      className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                      onClick={() => openPdfInNewTab(formik.values.selectedCutPlan)}
                      style={{ cursor: 'pointer' }}
                    >
                      {formik.values.selectedCutPlan.fileName || formik.values.selectedCutPlan.name}
                      <Button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={(event) => removeCutPlan(event, formik)}
                    >
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
                  className="btn btn-secondary btn-block"
                  onClick={() => openSelectHazardModal(formik)}
                >
                  Add Hazard
                </Button>
              </Form.Group>
            </Form.Group>

            <Form.Group className="col-md-12">
              <ListGroup className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {formik.values.selectedSkidHazards
                .map(id => mapState.hazards.find(hazard => hazard._id === id))
                .filter(hazard => hazard)
                .map(hazard => (
                  <ListGroupItem
                    key={hazard._id}
                    className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
                    style={{ textAlign: 'center', backgroundColor: hazard.color}}
                    onClick={() => handleHazardClick(hazard)}
                  >
                    <span>
                      {hazard.id} : {hazard.title}
                    </span>
                    <Button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={(event) => removeSkidHazard(event, hazard, formik)}
                    >
                      Remove
                    </Button>
                  </ListGroupItem>
                  
                ))}
               
              </ListGroup>
            </Form.Group>



              <Button variant="primary" onClick={formik.handleSubmit}>
            {showSpinner ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
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
        {/* <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={formik.handleSubmit}>
            {showSpinner ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="visually-hidden">Loading...</span>
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </Modal.Footer> */}
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
