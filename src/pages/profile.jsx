import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash, faEye, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Tab from 'react-bootstrap/Tab';
import { Tabs } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useAlertMessage } from '../components/AlertMessage';
import AddDocumentFileTypeModal from '../components/Modal/NewUserDocumentFileTypeModal';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import CreateDeviceAccount from '../components/Modal/CreateDeviceAccount';
import GeneratedPasswordModal from '../components/Modal/GeneratedPasswordModal';

const Profile = () => {
  const [key, setKey] = useState('userDocTypes');
  const [showNewUserDocTypeModal, setShowNewUserDocTypeModal] = useState(false);
  const [showNewLibraryDocTypeModal, setShowNewLibraryDocTypeModal] = useState(false);
  const [showNewDeviceModal, setShowNewDeviceModal] = useState(false);

  const navigate = useNavigate();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  const [userDocTypes, setUserDocTypes] = useState([]);
  const [libraryDocTypes, setLibraryDocTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [crewsData, setCrewsData] = useState([]);

  const [selectedValue, setSelectedValue] = useState('');

  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationModalMessage, setConfirmationModalMessage] = useState(null);

  const [confirmationType, setConfirmationType] = useState('reset'); // can be reset or remove

  const [showGeneratedPasswordModal, setShowGeneratedPasswordModal] = useState(false);
  const [generatedPasswordMessage, setGeneratedPasswordMessage] = useState(null); //TODO: Make more secure as it stores passsword


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/profile`, {
          withCredentials: true
        });
        if (response.status === 200) {
          if (response.data.isLoggedIn) {
            console.log('repsonse data', response.data);
            const data = response.data;
            setUserDocTypes(data.docTypes);
            setLibraryDocTypes(data.libraryDocTypes);
            setDevices(response.data.device);
            setCrewsData(response.data.crews);
          } else {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('An error has occuring fetching person data', error);
      }
    };

    fetchData();
  }, [navigate]);

  const closeGeneratedPasswordModal = () => {
    setShowGeneratedPasswordModal(false);
    setGeneratedPasswordMessage(null);
  }


  const submitCreateDeviceAccount = async (
    selectedCrew,
    selectedPerson,
    selectedEmail,
    selectedAccountType,
    emailLoginDetails
  ) => {
    console.log(
      'submitCreateDeviceAccount',
      selectedCrew,
      selectedPerson,
      selectedEmail,
      selectedAccountType,
      emailLoginDetails
    );
    /* let aLN, aLF, aLA;

    if (selectedAccountType === 'accessLevelNormal') {
      aLN = 'on';
    } else {
      aLN = 'off';
    }

    if (selectedAccountType === 'accessLevelForeman') {
      aLF = 'on';
    } else {
      aLF = 'off';
    }

    if (selectedAccountType === 'accessLevelAdmin') {
      aLA = 'on';
    } else {
      aLA = 'off';
    } */

    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/createdeviceaccount`,
        {
          person: selectedPerson,
          selectedAccountType,
          personEmail: selectedEmail,
          emailLoginDetails
        },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        console.log('data', resp.data);
        setGeneratedPasswordMessage("Email: " + resp.data.username + " " + "Password: " + resp.data.otp);
        setShowGeneratedPasswordModal(true);

        
        setDevices(resp.data.device);
        setShowNewDeviceModal(false);
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'User Created!',
              show: true,
              message: `Success, Account for ${selectedPerson} has been created`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error creating user account',
            show: true,
            message: `Error! An Error has occurred creating user account for ${selectedPerson}. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An erorr error occured while creating an account. Please try again', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const submitConfirmModal = () => {
    if (confirmationType === 'reset') {
      submitResetPassword();
    } else if (confirmationType === 'remove') {
      submitRemoveUser();
    }
  };

  const submitRemoveUser = async () => {
    console.log('remove user');

    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/deletedevice`,
        { userId },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setShowConfirmation(false);
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'User Removed',
              show: true,
              message: `Success, User ${userName} Removed`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        //update device list
        setDevices(resp.data.device);
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error Removing User',
            show: true,
            message: `Error! An Error has occurred removing user ${userName}. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An erorr error occured while removing user. Please try again', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const submitResetPassword = async () => {
    console.log(userId, email);

    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/updateDevicePassword`,
        { email },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setShowConfirmation(false);
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Password Reset Sent',
              show: true,
              message: `Success, Password reset link has been sent to ${email}`,
              background: 'success',
              color: 'white'
            }
          ]
        }));
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error resetting password',
            show: true,
            message: `Error! An Error has occurred sending password reset link to ${email}. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('An erorr error occured while resetting password. Please try again', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const closeConfirmationModal = () => {
    setShowConfirmation(false);
  };

  const renewOTP = (userId, email) => {
    console.log('Renewing Password', userId, email);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      // Proceed with renewing OTP
      renewOTP(userId, email);
    } else {
      // Handle cancellation
      console.log('OTP renewal canceled');
    }
    // Reset userId and email
    setUserId(null);
    setEmail(null);
    // Hide the confirmation dialog
    setShowConfirmation(false);
  };

  const confirmAndDeleteDevice = (user) => {
    console.log('confirmAndDeleteDevice', user.email);
    setConfirmationType('remove');
    setConfirmationModalMessage(`Are you sure you want to remove user ${user.name}`);
    setUserId(user.user_id);
    setEmail(user.email);
    setUserName(user.name);

    setShowConfirmation(true);
  };

  const confirmAndRenewOTP = (userName, userId, email) => {
    console.log('confirmAndRenewOTP', userId, email);
    // Store userId and email in state
    setConfirmationType('reset');
    setConfirmationModalMessage(`Are you sure you want to reset the password for ${userName}?`);
    setUserId(userId);
    setEmail(email);
    setUserName(userName);
    // Show the confirmation dialog
    setShowConfirmation(true);
  };

  const updateDeviceType = async (_id, selectedValue) => {
    // Implement the logic to update the device type
    console.log(`Updating device ${_id} with value: ${selectedValue}`);
    // You can perform further actions like updating state or making API requests here

    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/updateUserAccountType`,
        { _id, selectedValue },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Device Type Updated',
              show: true,
              message: `Success, device type has been updated to ${selectedValue}`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        //TODO: Update user doc type array
        //setUserDocTypes(resp.data.docTypes);
        setSelectedValue(selectedValue);

        //setShowNewUserDocTypeModal(false);
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error changing device type',
            show: true,
            message: `Error! An Error has occurred changing device type to ${selectedValue}. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error(
        'An erorr error occured while changing device type to server. Please try again',
        err
      );
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleSelectChange = (event, device) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    updateDeviceType(device._id, selectedValue);
  };

  const parseAvailableOptions = (device) => {
    if (device) {
      const { accessLevelAdmin, accessLevelForeman, accessLevelNormal } = JSON.parse(device.device);
      return [
        { value: 'accessLevelAdmin', label: 'Office', selected: accessLevelAdmin === 'on' },
        { value: 'accessLevelForeman', label: 'Foreman', selected: accessLevelForeman === 'on' },
        { value: 'accessLevelNormal', label: 'Normal', selected: accessLevelNormal === 'on' }
      ];
    }
    return [];
  };

  const renderOptions = (device) => {
    const options = parseAvailableOptions(device);

    return options.map((option, index) => (
      <option key={index} value={option.value} selected={option.selected}>
        {option.label}
      </option>
    ));
  };

  const updateUserDocTypes = (userDocTypes) => {
    setUserDocTypes(userDocTypes);
  };

  const deletePersonDocType = async (name) => {
    console.log('deletePersonDocType');
    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/deletepersondoctype`,
        { deletename: name },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Document Type Removed',
              show: true,
              message: `Success ${name} document type  been removed`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        //TODO: Update user doc type array
        setUserDocTypes(resp.data.docTypes);

        close();
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: New Document Type',
            show: true,
            message: `Error! An Error has occurred addding ${name} document type. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error(
        'An erorr error occured while submitting new user document type to server. Please try again',
        err
      );
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const deleteLibraryDocType = async (name) => {
    console.log('deleteLibraryDocType');
    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/deletelibrarydoctype`,
        { deletename: name },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'Library Type Removed',
              show: true,
              message: `Success ${name} library document type  been removed`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        //TODO: Update user doc type array
        setLibraryDocTypes(resp.data.libraryDocTypes);

        close();
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: New Document Type',
            show: true,
            message: `Error! An Error has occurred addding ${name} to library document types. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error(
        'An erorr error occured while submitting new user document type to server. Please try again',
        err
      );
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const openUserDocTypeModal = () => {
    setShowNewUserDocTypeModal(true);
  };

  const openLibraryDocTypeModal = () => {
    setShowNewLibraryDocTypeModal(true);
  };

  const openNewDeviceModal = () => {
    setShowNewDeviceModal(true);
  };
  
  const closeCreateAccountModal = () => {
    setShowNewDeviceModal(false);
  }
  const closeUserDocTypeModal = () => {
    setShowNewUserDocTypeModal(false);
  };

  const closeLibraryDocTypeModal = () => {
    setShowNewLibraryDocTypeModal(false);
  };

  const handleUserDocTypeSubmit = async (name, note) => {
    console.log('submit', name, note);
    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/createPersonDocType`,
        { name, note },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'New User Document Type Added',
              show: true,
              message: `Success ${name} added to User Document Types`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        //TODO: Update user doc type array
        setUserDocTypes(resp.data.docTypes);

        setShowNewUserDocTypeModal(false);
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: New User Document Type',
            show: true,
            message: `Error! An Error has occurred addding ${name} to User document types. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error(
        'An erorr error occured while submitting new user document type to server. Please try again',
        err
      );
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const handleLibraryDocTypeSubmit = async (name, note) => {
    console.log('submit', name, note);
    const id = new Date().getTime();

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_URL}/createLibraryDocType`,
        { name, note },
        { withCredentials: true }
      );

      if (resp.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: 'New Library Document Type Added',
              show: true,
              message: `Success ${name} added to Library Document Types`,
              background: 'success',
              color: 'white'
            }
          ]
        }));

        //TODO: Update user doc type array
        setLibraryDocTypes(resp.data.libraryDocTypes);

        setShowNewLibraryDocTypeModal(false);
      }
    } catch (err) {
      setAlertMessageState((prevState) => ({
        ...prevState,
        toasts: [
          ...prevState.toasts,
          {
            id: id,
            heading: 'Error: New Library Document Type',
            show: true,
            message: `Error! An Error has occurred addding ${name} to Library document types. Please try again`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error(
        'An erorr error occured while submitting new user document type to server. Please try again',
        err
      );
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  return (
    <Container>
      <Tabs id="profile-tab" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="userDocTypes" title="User Document Types">
          <div style={{ marginTop: '60px' }}>
            <div>
              <button
                type="button"
                className="btn btn-light"
                style={{ marginTop: '-40px' }}
                onClick={openUserDocTypeModal}
              >
                <i className="bi bi-file-earmark"></i>&nbsp;New Document Type
              </button>
            </div>
            <br />
            <dl>
              {userDocTypes.map((docType) => (
                <React.Fragment key={docType.name}>
                  <dt style={{ fontSize: 'medium' }}>{docType.name}</dt>
                  <dd>
                    {docType.note}
                    <a style={{ marginLeft: 'auto' }} className="btn btn-link" href="#">
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deletePersonDocType(docType.name)}
                      />
                      <i className="bi bi-trash-fill"></i>
                    </a>
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </Tab>

        <Tab eventKey="libraryDocTypes" title="Library Document Types">
          <div style={{ marginTop: '60px' }}>
            <div>
              <button
                type="button"
                className="btn btn-light"
                style={{ marginTop: '-40px' }}
                onClick={openLibraryDocTypeModal}
              >
                <i className="bi bi-file-earmark"></i>&nbsp;New Library Type
              </button>
            </div>
            <br />
            <dl>
              {libraryDocTypes.map((docType) => (
                <React.Fragment key={docType.name}>
                  <dt style={{ fontSize: 'medium' }}>{docType.name}</dt>
                  <dd>
                    {docType.note}
                    <a style={{ marginLeft: 'auto' }} className="btn btn-link" href="#">
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteLibraryDocType(docType.name)}
                      />
                      <i className="bi bi-trash-fill"></i>
                    </a>
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </Tab>

        <Tab eventKey="currentDevices" title="Current Devices">
          <div style={{ marginTop: '60px' }}>
            <div>
              <button
                type="button"
                className="btn btn-light"
                style={{ marginTop: '-40px' }}
                onClick={openNewDeviceModal}
              >
                <i className="bi bi-file-earmark"></i>&nbsp;New Device
              </button>
            </div>
            <br />
            <dl>
              {devices.map((device) => (
                <React.Fragment key={device._id}>
                  <dt style={{ fontSize: 'medium' }}>{device.name}</dt>
                  <dd>
                    <dt style={{ fontSize: 'medium', fontWeight: 'normal' }}>
                      <FontAwesomeIcon icon={faEnvelope} /> {device.email}
                    </dt>
                    <i className="fa-solid fa-user" style={{ marginLeft: '10px' }}></i>&nbsp;
                    <select
                      id="deviceTypeSelect"
                      onChange={(event) => handleSelectChange(event, device)}
                    >
                      {renderOptions(device)}
                    </select>
                    <div style={{ marginLeft: 'auto' }}>
                      {/* Button to confirm and renew OTP */}
                      <button
                        className="btn btn-link"
                        onClick={() =>
                          confirmAndRenewOTP(device.name, device.user_id, device.email)
                        }
                      >
                        <FontAwesomeIcon icon={faKey} />
                      </button>
                      {/* Button to confirm and delete device */}
                      <button
                        className="btn btn-link"
                        onClick={() => confirmAndDeleteDevice(device)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </Tab>
      </Tabs>

      <AddDocumentFileTypeModal
        show={showNewUserDocTypeModal}
        submit={handleUserDocTypeSubmit}
        close={closeUserDocTypeModal}
      />
      <AddDocumentFileTypeModal
        show={showNewLibraryDocTypeModal}
        submit={handleLibraryDocTypeSubmit}
        close={closeLibraryDocTypeModal}
      />

      <ConfirmationModal
        message={confirmationModalMessage}
        show={showConfirmation}
        submit={submitConfirmModal}
        close={closeConfirmationModal}
      />

      <CreateDeviceAccount
        crewsData={crewsData}
        show={showNewDeviceModal}
        submit={submitCreateDeviceAccount}
        close={closeCreateAccountModal}
      />

      <GeneratedPasswordModal 
      show={showGeneratedPasswordModal}
      message={generatedPasswordMessage}
      close={closeGeneratedPasswordModal}
       />
    </Container>
  );
};

export default Profile;
