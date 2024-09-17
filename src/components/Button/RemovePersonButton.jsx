import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useConfirmationModal } from '../ConfirmationModalContext';
import { useNavigate } from 'react-router-dom';
import { useAlertMessage } from '../AlertMessage';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useCrews } from '../../context/CrewContext';
import { deletePresignedUrl } from '../../hooks/useFileDelete';

/**
 * Removes a Person
 * @returns
 */
const RemovePersonButton = ({ person, _account }) => {
  const { confirmationModalState, setConfirmationModalState } = useConfirmationModal();
  const { addToast } = useAlertMessage();
  const { crews } = useCrews();
  const navigate = useNavigate();

  const deletePerson = () => {
    setConfirmationModalState((prevState) => ({
      ...prevState,
      show: true,
      confirmed: false,
      label: 'Remove Person',
      message: (
        <>
          Are you sure you want to remove crew member: <strong>{person.name}</strong>
        </>
      )
    }));
  };

  useEffect(() => {
    const checkSubmit = async () => {
      const crewName = crews.find(crew => crew._id === person.crew)?.name || "Unassigned";

      if (confirmationModalState.confirmed && person._id !== null) {
        await deletePresignedUrl([`${_account}/person/${person._id}/`]);
         try {
          const response = await axios.delete(
            // eslint-disable-next-line no-undef
            process.env.REACT_APP_URL + `/deleteperson/${person._id}`,
            { withCredentials: true }
          );
          if (response.status === 200) {
              await deletePresignedUrl([`${person._id}/`]);
              navigate('/');
              addToast('Person Removed!', `${person.name} has been removed from ${crewName} successfully`, 'success', 'white' );
          }
        } catch (error) {
          addToast('Error!', `An error occurred removing ${person.name} from ${crewName}`, 'danger', 'white');
          console.error('An error has occured while removing crew member');
        } finally {
          setConfirmationModalState((prevState) => ({
            ...prevState,
            confirmed: false
          }));
        } 
      }
    };

    checkSubmit();
  }, [confirmationModalState.confirmed]);

  return (
    <>
      <Button
        data-testid="removePersonBtn"
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

RemovePersonButton.propTypes = {
  person: PropTypes.any.isRequired,
  _account: PropTypes.number.isRequired
};

export default RemovePersonButton;
