import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlertMessage } from './AlertMessage';
const OnJobTraining = ({ person, onjobs, showModal, updateOnjobTrainingRecords }) => {
  const [selectedRows, setSelectedRows] = useState([]);
const {id: userId} = useParams();
const { setAlertMessageState } = useAlertMessage();

  const handleRemoveonjobTraining = async(_id) => {
    const id = new Date().getTime(); // creates id for alert messages

    console.log('onJobTraining', _id, userId);

    try {
        const resposne = await axios.post(`${process.env.REACT_APP_URL}/removeOnjobTraining`, {_id, userId}, {withCredentials: true});

        if (resposne.status === 200) {
            console.log('data jajaj', resposne.data);
            updateOnjobTrainingRecords(resposne.data.onJobTraining);
            setAlertMessageState((prevState) => ({
                ...prevState,
                toasts: [
                  ...prevState.toasts,
                  {
                    id: id,
                    heading: 'On-Job Training Record Removed',
                    show: true,
                    message: `Success! On-Job Training Record has been removed`,
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
                heading: 'Error: Could not remove on-job training record',
                show: true,
                message: `Error has occurred while removing on-job training record, please try again`,
                background: 'danger',
                color: 'white'
              }
            ]
          }));
        console.error("An error occurred while removing onjob training record", err);
    } finally {
        setTimeout(() => {
            setAlertMessageState((prevState) => ({
              ...prevState,
              toasts: prevState.toasts.filter((toast) => toast.id !== id)
            }));
          }, 10000);
    }
  }

  const handleCheckboxChange = (checked, onjob) => {
    setSelectedRows((prevSelectedRows) => {
      if (checked) {
        // Add the onjob object to the selectedRows array if the checkbox is checked
        return [...prevSelectedRows, onjob];
      } else {
        // Remove the onjob object from the selectedRows array if the checkbox is unchecked
        return prevSelectedRows.filter((selectedOnjob) => selectedOnjob !== onjob);
      }
    });
  };

  const toggleSelectAll = () => {
    // Update the selectedRows state with all onjob objects
    setSelectedRows([...onjobs]);
  };

  const toggleSelectNone = () => {
    // Update the selectedRows state to an empty array
    setSelectedRows([]);
  };

  const printSelected = () => {
    // Logic to print selected rows
    if (selectedRows.length < 1) {
      console.log('hey');
    } else {
      console.log('for fucks sake', selectedRows);
      showPrintableWindow();
    }
  };

  const generatePrintableHTML = () => {
    let printableHTML = `
      <html>
        <head>
          <title>Printable Table</title>
          <style>
            /* Global styles */
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            
            /* Table styles */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #f2f2f2;
            }
            
            /* Button styles */
            .no-print {
              display: none;
            }
            
            /* Button icon */
            .button-icon {
              margin-right: 5px;
            }
            
            /* Competence row styles */
            .table-warning {
              background-color: #ffeeba;
            }
            
            .table-success {
              background-color: #d4edda;
            }
            
            .table-danger {
              background-color: #f8d7da;
            }
          </style>
        </head>
        <body>
        <h1>On-job Training: ${person}</h1>
          <table>
            <tbody>`;

    // Iterate over each onjob and generate HTML for each row
    selectedRows.forEach((onjob, index) => {
      printableHTML += `
        <tr>
          <td>
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-inline-block">
                <b class="d-inline-block">${onjob.date}: ${onjob.reportType}</b>
              </div>
              <Button variant="default" size="xs" class="no-print">
                <FontAwesomeIcon class="button-icon" icon={faCircleXmark} /> Delete
              </Button>
            </div>
          </td>
          <td width="20%">
            <b>${onjob.trainer}</b>
          </td>
        </tr>
        <tr>
          <td><b>DISCUSSED:</b> ${onjob.talk}</td>
          <td>${onjob.talkTime}</td>
        </tr>
        <tr>
          <td><b>DEMONSTRATED:</b> ${onjob.show}</td>
          <td>${onjob.showTime}</td>
        </tr>
        <tr>
          <td><b>OBSERVED:</b> ${onjob.look}</td>
          <td>${onjob.lookTime}</td>
        </tr>
        <tr>
          <td><b>RECOMMENDATION:</b> ${onjob.confirm}</td>
          <td>${onjob.confirmTime}</td>
        </tr>
        <tr class="${onjob.competence === 'Periodic Supervision Required' ? 'table-warning' : onjob.competence === 'Competent' ? 'table-success' : 'table-danger'}">
          <td colspan="2"><b>COMPETENCE:</b> ${onjob.competence}</td>
        </tr>`;
    });

    printableHTML += `
            </tbody>
          </table>
        </body>
      </html>`;

    return printableHTML;
  };

  const showPrintableWindow = () => {
    const printableHTML = generatePrintableHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printableHTML);
    printWindow.print();
  };

  // Call showPrintableWindow() to display the printable HTML in a new window for printing

  return (
    <div>
      <div>
        <br />
        <div style={{ float: 'left' }}>
          <h3>On-job Training</h3>
        </div>
        <div style={{ float: 'right' }}>
          <Button variant="primary" onClick={toggleSelectAll}>
            <b>Select All</b>
          </Button>
          <Button variant="primary" onClick={toggleSelectNone}>
            <b>Select None</b>
          </Button>
          <Button variant="primary" onClick={printSelected}>
            <FontAwesomeIcon icon={faPrint} />
          </Button>
          <Button variant="primary" onClick={showModal} data-toggle="modal" data-target="#myModal1">
            <b>+</b>
          </Button>
        </div>
      </div>

      {onjobs &&
        onjobs.map((onjob, index) => (
          <React.Fragment key={index}>
            <Table striped bordered condensed>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-inline-block">
                        <Form.Check
                          type="checkbox"
                          className="recordCheck no-print d-inline-block"
                          id={`checkbox-${index}`}
                          label=""
                          onChange={(e) => handleCheckboxChange(e.target.checked, onjob)}
                          checked={selectedRows.includes(onjob)}
                        />
                        <b className="d-inline-block">
                          {onjob.date}: {onjob.reportType}
                        </b>
                      </div>
                      <Button variant="default" size="xs" onClick={() => handleRemoveonjobTraining(onjob._id)}>
                        <FontAwesomeIcon icon={faCircleXmark} /> Delete
                      </Button>
                    </div>
                  </td>
                  <td width="20%">
                    <b>{onjob.trainer}</b>
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>DISCUSSED:</b> {onjob.talk}
                  </td>
                  <td>{onjob.talkTime}</td>
                </tr>
                <tr>
                  <td>
                    <b>DEMONSTRATED:</b> {onjob.show}
                  </td>
                  <td>{onjob.showTime}</td>
                </tr>
                <tr>
                  <td>
                    <b>OBSERVED:</b> {onjob.look}
                  </td>
                  <td>{onjob.lookTime}</td>
                </tr>
                <tr>
                  <td>
                    <b>RECOMMENDATION:</b> {onjob.confirm}
                  </td>
                  <td>{onjob.confirmTime}</td>
                </tr>
                <tr
                  className={
                    onjob.competence === 'Periodic Supervision Required'
                      ? 'table-warning'
                      : onjob.competence === 'Competent'
                        ? 'table-success'
                        : 'table-danger'
                  }
                >
                  <td colSpan="2">
                    <b>COMPETENCE:</b> {onjob.competence}
                  </td>
                </tr>
              </tbody>
            </Table>
          </React.Fragment>
        ))}
    </div>
  );
};

OnJobTraining.propTypes = {
  person: PropTypes.object.isRequired,
  onjobs: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  updateOnjobTrainingRecords: PropTypes.func.isRequired,
};

export default OnJobTraining;
