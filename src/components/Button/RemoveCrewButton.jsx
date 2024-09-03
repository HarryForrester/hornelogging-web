import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useConfirmationModal } from '../ConfirmationModalContext';
import { useAlertMessage } from '../AlertMessage';
import { usePeople } from '../../context/PeopleContext';
import axios from 'axios';
import PropTypes from 'prop-types';

/**
 * Removes a Crew
 * @returns
 */
const RemoveCrewButton = ({ crew }) => {
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const { addToast } = useAlertMessage();
  const { setPeople } = usePeople();
  const [crewId, setCrewId] = useState(null);
  const [crewName, setCrewName] = useState(null);

  const deleteCrew = (crew) => {
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
        setPeople((prevState) => {
          let updatedCrews = [...prevState.peopleByCrew];
          const removedCrew = prevState.peopleByCrew.find((crew) => crew._id === crewId);

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
            peopleByCrew: updatedCrews
          };
        });

        try {
          const response = await axios.delete(
            // eslint-disable-next-line no-undef
            process.env.REACT_APP_URL + `/deletecrew/${crewId}/${crewName}`,
            { withCredentials: true }
          );

          if (response.status === 200) {
            addToast('Crew Removed!', `Success! Removed Crew "${crew.name}"`, 'success', 'white');
          }
        } catch (err) {
          addToast('Remove Crew!', `Error! An Error occurred while removing crew "${crew.name}", Please try again.`, 'danger', 'white');
        } finally {
          setConfirmationModalState((prevState) => ({
            ...prevState,
            confirmed: false
          }));
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
};

export default RemoveCrewButton;
