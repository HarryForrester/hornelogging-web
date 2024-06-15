import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useConfirmationModal } from '../ConfirmationModalContext';
import { useAlertMessage } from '../AlertMessage';
import { useMap } from '../Map/MapContext';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Removes a Crew
 * @returns
 */
const RemoveCrewButton = ({ crew }) => {
  //const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { mapState, setMapState } = useMap();
  const [crewId, setCrewId] = useState(null);
  const [crewName, setCrewName] = useState(null);
  const id = new Date().getTime();

  const deleteCrew = (crew) => {
    console.log('cerew: ', crew);
    setCrewId(crew._id);
    setCrewName(crew.name);

    setConfirmationModalState((prevState) => ({
      ...prevState,
      show: true,
      confirmed: false,
      label: 'Remove Crew',
      message: (
        <>
          Are you sure you want to remove crew: <strong>{crew.name}</strong>
        </>
      )
    }));
  };

  useEffect(() => {
    const checkSubmit = async () => {
      if (confirmationModalState.confirmed && crewId !== null) {
        setMapState((prevState) => {
          let updatedCrews = [...prevState.crews];
          const removedCrew = prevState.crews.find((crew) => crew._id === crewId);

          if (removedCrew) {
            // Check if the removed crew has people
            if (removedCrew.people && removedCrew.people.length > 0) {
              // Find the Unassigned crew in the state
              const unassignedCrewIndex = updatedCrews.findIndex(
                (crew) => crew.name === 'Unassigned'
              );

              if (unassignedCrewIndex !== -1) {
                // Move the crew.people to the Unassigned crew's people array
                updatedCrews[unassignedCrewIndex] = {
                  ...updatedCrews[unassignedCrewIndex],
                  people: [...updatedCrews[unassignedCrewIndex].people, ...removedCrew.people]
                };

                // Optionally, you can clear the people array in the original crew
                updatedCrews = updatedCrews.map((crew) =>
                  crew._id === crewId ? { ...crew, people: [] } : crew
                );
              } else {
                // If "Unassigned" doesn't exist, create it with the people from the removed crew
                const unassignedCrew = {
                  name: 'Unassigned',
                  people: removedCrew.people
                };

                // Optionally, you can clear the people array in the original crew
                updatedCrews = updatedCrews.map((crew) =>
                  crew._id === crewId ? { ...crew, people: [] } : crew
                );

                updatedCrews.push(unassignedCrew);
              }
            }
          }

          // Remove the crew being filtered out
          updatedCrews = updatedCrews.filter((crew) => crew._id !== crewId);

          return {
            ...prevState,
            crews: updatedCrews
          };
        });

        try {
          const response = await axios.delete(
            process.env.REACT_APP_URL + `/deletecrew/${crewId}/${crewName}`,
            { withCredentials: true }
          );

          if (response.status === 200) {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: [
                ...prevState.toasts,
                {
                  id: id,
                  heading: 'Crew Removed',
                  show: true,
                  message: `Success! Removed Crew ${crew.name}   `,
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
                heading: 'Remove Crew',
                show: true,
                message: `Error! An error has occured while removing crew: ${crew.name}`,
                background: 'danger',
                color: 'white'
              }
            ]
          }));
          console.log('Error deleting crew: ', err);
        } finally {
          setConfirmationModalState((prevState) => ({
            ...prevState,
            confirmed: false
          }));
          setTimeout(() => {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: prevState.toasts.filter((toast) => toast.id !== id)
            }));
          }, 10000);
        }
      }
    };

    checkSubmit();
  }, [confirmationModalState.confirmed, crewId]);

  return (
    <div className="col-md-1">
      <div
        className="btn-toolbar"
        role="toolbar"
        aria-label="Toolbar with button groups"
        style={{ float: 'right', marginTop: '8px' }}
      >
        <div className="btn-group me-2" role="group" aria-label="Second group">
          {!crew.unassigned && (
            <>
              <button type="button" className="btn btn-link" onClick={() => deleteCrew(crew)}>
                <FontAwesomeIcon icon={faTrash} color="black" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

RemoveCrewButton.propTypes = {
  crew: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired
};

export default RemoveCrewButton;
