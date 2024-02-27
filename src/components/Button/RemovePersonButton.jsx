import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationModal from '../Modal/DeleteConfirmationModal';
import { Button } from 'react-bootstrap';
import { useConfirmationModal } from '../ConfirmationModalContext';
import { useNavigate } from 'react-router-dom';
import { useAlertMessage } from '../AlertMessage';

import axios from 'axios';

/**
 * Removes a Person
 * @returns
 */
const RemovePersonButton = ({ person }) => {
  const {confirmationModalState, setConfirmationModalState} = useConfirmationModal();
  const {alertMessageStart, setAlertMessageState} = useAlertMessage();
  const navigate = useNavigate();



  const deletePerson = () => {
    setConfirmationModalState((prevState) => ({
      ...prevState,
      show: true,
      confirmed: false,
      label: "Remove Person",
      message: (<>Are you sure you want to remove crew member: <strong>{person.name}</strong></>)
    }));

  };

  useEffect(() => {
    const checkSubmit = async() => {
      const id = new Date().getTime(); 

      if (confirmationModalState.confirmed && person._id !== null) {
        try {
          const response = await axios.delete(process.env.REACT_APP_URL + `/deleteperson/${person._id}`, { withCredentials: true });
          if (response.status === 200) {
            navigate('/');
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: [
                ...prevState.toasts,
                {
                  id: id,
                  heading: "Crew Member Removed",
                  show: true,
                  message: `${person.name} has been removed successfully`,
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
                heading: "Remove Person",
                show: true,
                message: `Error! Removing ${person.name}  from ${person.crew}`,
                background: 'danger',
                color: 'white'
              }
            ]
          }));
          console.error("An error has occured while removing crew member");
        } finally {
          setConfirmationModalState((prevState) => ({
            ...prevState,
            confirmed: false,
          })); 
          setTimeout(() => {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: prevState.toasts.filter((toast) => toast.id !== id),
          }));
          }, 10000)

        }
      }
    }

    checkSubmit();
  },[confirmationModalState.confirmed])

  
  return (
    <>
      <Button
        type="button"
        className="btn btn-danger"
        onClick={deletePerson}
        style={{ marginTop: '10px' }}
      >
        Delete
      </Button>
    </>
  );
};

export default RemovePersonButton;
