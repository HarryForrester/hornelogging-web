import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLong, faCircleXmark, faUpLong } from '@fortawesome/free-solid-svg-icons';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAlertMessage } from './AlertMessage';
const QualifiedTable = ({ quals, setQuals, person }) => {
  const { addToast } = useAlertMessage();

  const handleComplete = async (_id, complete) => {

    try {
      const response = await axios.post(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_URL}/complete-qualification`,
        { _id, complete, employee: person._id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setQuals(response.data.quals);
        addToast('Qualification Updated!', 'Success! Qualification has been updated successfully', 'success', 'white');
      }
    } catch (error) {
      addToast('Error!', 'An error occurred while qualifying or unqualified Qualification', 'danger', 'white');
      console.error('An error has occcured while qualifying or unqualifying qualication: ', error);
    }
  };

  const handleQualDelete = async (_id) => {
    try {
      const response = await axios.post(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_URL}/remove-qualification`,
        { _id, employee: person?._id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setQuals(response.data.quals);
        addToast('Qualification Removed!', 'Success! Qualification has been removed successfully', 'success', 'white');
      }
    } catch (err) {
      console.error('An error occurred', err);
      addToast('Error!', 'Error occurred while removing qualification, Please try again', 'danger', 'white');
    }
  };

  return (
    <div>
      <h3>Qualified</h3>
      <Table striped bordered condensed="true">
        <thead>
          <tr>
            <th>Title</th>
            <th width="180">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {quals.map((qualification) => {
            if (qualification.complete) {
              return (
                <tr key={qualification._id}>
                  <td>{qualification.title}</td>
                  <td>
                    <Button
                      variant="outline-dark"
                      style={{ width: '100%', marginBottom: '10px' }}
                      onClick={() => handleComplete(qualification._id, false)}
                      className="btn btn-default btn-xs unqualifyQual"
                    >
                      <FontAwesomeIcon
                        icon={faDownLong}
                        size="lg"
                        style={{ marginRight: '10px' }}
                      />
                      Un-qualify
                    </Button>

                    <Button
                      variant="outline-dark"
                      style={{ width: '100%' }}
                      onClick={() => handleQualDelete(qualification._id)}
                      className="btn btn-default btn-xs deleteQual"
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        size="lg"
                        style={{ marginRight: '10px' }}
                      />
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
      <Table striped bordered condensed="true">
        <thead>
          <tr>
            <th>Title</th>
            <th width="180">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {quals.map((qualification) => {
            if (!qualification.complete) {
              return (
                <tr key={qualification._id}>
                  <td>{qualification.title}</td>
                  <td>
                    <Button
                      variant="outline-dark"
                      style={{ width: '100%', marginBottom: '10px' }}
                      onClick={() => handleComplete(qualification._id, true)}
                      className="btn btn-default btn-xs qualifyQual"
                    >
                      <FontAwesomeIcon icon={faUpLong} size="lg" style={{ marginRight: '10px' }} />
                      Qualify
                    </Button>{' '}
                    <Button
                      variant="outline-dark"
                      style={{ width: '100%' }}
                      onClick={() => handleQualDelete(qualification._id)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        size="lg"
                        style={{ marginRight: '10px' }}
                      />
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
  quals: PropTypes.any.isRequired,
  setQuals: PropTypes.func.isRequired,
  person: PropTypes.any.isRequired
};
export default QualifiedTable;
