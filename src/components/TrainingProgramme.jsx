import React from 'react';
import { useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap'; // Import React Bootstrap components
import PropTypes from 'prop-types';
const TrainingProgramme = ({ records, handleAdd, handleEdit }) => {
  return (
    <div>
      <div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleAdd}>
            <b>+</b>
          </Button>
        </div>
        <h3>Training Programme</h3>
      </div>

      <Table striped bordered condensed>
        <thead>
          <tr>
            <th width="400">Training Required</th>
            <th>Units to be Achieved</th>
            <th width="130">Target Date</th>
            <th width="130">Achieved Date</th>
            <th width="60">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {records &&
            records.map((record) => (
              <tr key={record._id} className={record.issued ? 'table-success' : ''}>
                <td>{record.requirement}</td>
                <td>{record.unit}</td>
                <td>{record.targetDate}</td>
                <td>{record.achievedDate}</td>
                <td align="center">
                  <Button variant="outline-dark" onClick={() => handleEdit(record)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

TrainingProgramme.propTypes = {
  records: PropTypes.array.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired
};

export default TrainingProgramme;
