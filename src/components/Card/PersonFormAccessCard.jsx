import React from 'react';
import axios from 'axios';
import ToggleWithLabel from '../Toggle/ToggleWithLabel';
import { useAlertMessage } from '../AlertMessage';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
const PersonFormAccessCard = ({ currentUser, timeSheetAccess, forms, updateForms }) => {
  const { addToast } = useAlertMessage();

  const toggleTimeSheet = async (event) => {
    const isChecked = event.target.checked;

    const data = {
      person: currentUser._id,
      checked: isChecked
    };

    try {
      const response = await axios.post('http://localhost:3001/toggleTimeSheet', data, {
        withCredentials: true
      });
      if (response.status === 200) {
        addToast(`Time Sheet ${isChecked ? 'Enabled' : 'Disabled'}`, `Success! Time Sheet has been ${isChecked ? 'Enabled' : 'Disabled'} for ${currentUser.name}`, 'success', 'white');
      }
    } catch (err) {
      addToast('Time Sheet!', 'Error has occurred while changing form state', 'danger', 'white');
      console.error('Network error:', err);
    }
  };

  const toggleForm = async (event, form) => {
    const formId = form._id;
    const formTitle = form.title;
    const personId = currentUser._id;

    try {
      updateForms((forms) => {
        const updatedForms = forms &&
          forms.map((form) => {
            if (form._id === formId) {
              const updatedAvailbaleOnDevice = { ...JSON.parse(form.availableOnDeviceSerialized) };
              updatedAvailbaleOnDevice[personId] = isChecked;

              return {
                ...form,
                availableOnDeviceSerialized: JSON.stringify(updatedAvailbaleOnDevice)
              };
            }
            return form;
          });
        return updatedForms
      });
      const isChecked = event.target.checked;
      const data = {
        id: formId,
        person: currentUser._id,
        checked: isChecked
      };
      // eslint-disable-next-line no-undef
      const response = await axios.post(process.env.REACT_APP_URL + '/toggleForm', data, {
        withCredentials: true
      });
      if (response.status === 200) {
        addToast(`${formTitle} ${isChecked ? 'Enabled' : 'Disabled'}`, `Success! ${formTitle} has been ${isChecked ? 'Enabled' : 'Disabled'} for ${currentUser.name}`, 'success', 'white');
      }
    } catch (error) {
      addToast('Form Error!', 'Error has occurred while changing form state', 'danger', 'white');
      console.error('Error toggling form:', error);
    }
  };

  const isFormEnabled = (availableOnDevice, personId) => {
    return availableOnDevice && availableOnDevice[personId] === true;
  };

  return (
    <div data-testid="person-form-access-card">
      <Card>
      <Card.Header>Enable Device Forms</Card.Header>
      <Card.Body>
        <dl>
          <div className="form-access">
            {timeSheetAccess &&
              timeSheetAccess.map((form) => (
                <ToggleWithLabel
                  key={`timesheet-access-${form._id}`}
                  personId={currentUser._id}
                  form={form}
                  isFormEnabled={isFormEnabled}
                  toggle={toggleTimeSheet}
                  availableOnDevice={form.availableOnDevice}
                />
              ))}
            {forms && forms.map((form) => (
                <ToggleWithLabel
                  key={`form-${form._id}`}
                  personId={currentUser._id}
                  form={form}
                  isFormEnabled={isFormEnabled}
                  toggle={(e) => toggleForm(e, form)}
                  availableOnDevice={form.availableOnDeviceSerialized}
                />
              ))}
          </div>
        </dl>
      </Card.Body>
    </Card>
    </div>
  );
};

PersonFormAccessCard.propTypes = {
  currentUser: PropTypes.object.isRequired,
  timeSheetAccess: PropTypes.array.isRequired,
  forms: PropTypes.array.isRequired,
  updateForms: PropTypes.func.isRequired,
}

export default PersonFormAccessCard;
