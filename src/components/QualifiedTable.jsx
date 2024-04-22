import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faCircleXmark, faUpLong } from '@fortawesome/free-solid-svg-icons';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from './AlertMessage';
import { usePersonData } from './PersonData';
const QualifiedTable = ({quals, person}) => {
    const { alertMessageState, setAlertMessageState } = useAlertMessage();
    const { personDataState, setPersonDataState } = usePersonData();

    const handleComplete = async(_id, complete) => {
        const id = new Date().getTime(); // creates id for alert messages

        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/complete-qualification`, {_id, complete, employee: personDataState.person._id}, {withCredentials: true});
            if (response.status === 200) {
                console.log("response: ", response.data);
                setPersonDataState((prevState) => ({
                    ...prevState,
                    quals: response.data.quals
                }));

                setAlertMessageState((prevState) => ({
                    ...prevState,
                    toasts: [
                      ...prevState.toasts,
                      {
                        id: id,
                        heading: 'Qualification Updated',
                        show: true,
                        message: `Success! Qualification has been updated successfully`,
                        background: 'success',
                        color: 'white'
                      }
                    ]
                  }));
            }
        } catch (error) {
            console.error("An error has occcured while qualifying or unqualifying qualication: ", error);
        } finally {
            setTimeout(() => {
                setAlertMessageState((prevState) => ({
                  ...prevState,
                  toasts: prevState.toasts.filter((toast) => toast.id !== id)
                }));
              }, 10000);

        }

    }

    const handleQualDelete = async(_id) => {
        console.log('eme')
        const id = new Date().getTime(); // creates id for alert messages

        try {
            const response = await axios.post(`${process.env.REACT_APP_URL}/remove-qualification`, {_id, employee: person?._id}, {withCredentials: true} )
            if (response.status === 200) {
                console.log("response: ", response.data);
                setPersonDataState((prevState) => ({
                    ...prevState,
                    quals: response.data.quals
                }));

                setAlertMessageState((prevState) => ({
                    ...prevState,
                    toasts: [
                      ...prevState.toasts,
                      {
                        id: id,
                        heading: 'Qualification Removed',
                        show: true,
                        message: `Success! Qualification has been removed successfully`,
                        background: 'success',
                        color: 'white'
                      }
                    ]
                  }));
            }

        } catch (err) {
            console.error("An error occurred", err);
            setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: [
                  ...prevState.toasts,
                  {
                    id: id,
                    heading: 'Error: Could not remove qualification',
                    show: true,
                    message: `Error has occurred while removing qualification, please try again`,
                    background: 'danger',
                    color: 'white'
                  }
                ]
              }));
        } finally {
            setTimeout(() => {
                setAlertMessageState((prevState) => ({
                  ...prevState,
                  toasts: prevState.toasts.filter((toast) => toast.id !== id)
                }));
              }, 10000);
        }
    }


  return (
    <div>
      <h3>Qualified</h3>
      <Table striped bordered condensed>
        <thead>
          <tr>
            <th>Title</th>
            <th width="180">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {quals.map((qualification) => {
            if (qualification.complete === 'yes') {
              return (
                <tr key={qualification._id}>
                  <td>{qualification.title}</td>
                  <td>
                    <Button variant="outline-dark" style={{width: '100%', marginBottom: '10px'}} onClick={() => handleComplete(qualification._id, 'no')} className="btn btn-default btn-xs unqualifyQual">
                      <FontAwesomeIcon icon={faDownLong} size="lg" style={{ marginRight: '10px'}} />
                      Un-qualify
                    </Button>
                    
                    <Button variant="outline-dark" style={{width: '100%'}} onClick={() => handleQualDelete(qualification._id)} className="btn btn-default btn-xs deleteQual">
                      <FontAwesomeIcon icon={faCircleXmark} size="lg" style={{ marginRight: '10px' }} />
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </Table>

      <h3>Working towards</h3>
      <Table striped bordered condensed>
        <thead>
          <tr>
            <th>Title</th>
            <th width="180">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {quals.map((qualification) => {
            if (qualification.complete === 'no') {
              return (
                <tr key={qualification._id}>
                  <td>{qualification.title}</td>
                  <td>
                    <Button variant="outline-dark" style={{width: '100%', marginBottom: '10px'}} onClick={() => handleComplete(qualification._id, 'yes')} className="btn btn-default btn-xs qualifyQual">
                      <FontAwesomeIcon icon={faUpLong} size="lg" style={{ marginRight: '10px' }} />
                      Qualify
                    </Button>
                    {' '}
                    <Button variant="outline-dark" style={{width: '100%'}} onClick={() => handleQualDelete(qualification._id)} >
                      <FontAwesomeIcon icon={faCircleXmark} size="lg" style={{ marginRight: '10px' }} />
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </Table>
    </div>
  );
};

QualifiedTable.propTypes = {
    quals: PropTypes.object.isRequired,
    person: PropTypes.object.isRequired,
}
export default QualifiedTable;
