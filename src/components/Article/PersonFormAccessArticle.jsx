import React from 'react';
import axios from 'axios';
import ToggleWithLabel from '../Toggle/ToggleWithLabel';
import { useAlertMessage } from '../AlertMessage';
import { usePersonData } from '../PersonData';
const PersonFormAccessArticle = () => {
  const { alertMessageState, setAlertMessageState } = useAlertMessage();
  const { personDataState, setPersonDataState } = usePersonData();

  const toggleTimeSheet = async (event) => {
    const id = new Date().getTime();
    const isChecked = event.target.checked;

    const data = {
      person: personDataState.person._id,
      checked: isChecked
    };

    try {
      const response = await axios.post('http://localhost:3001/toggleTimeSheet', data, {
        withCredentials: true
      }); // Replace with your API endpoint
      if (response.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: `Time Sheet ${isChecked ? 'Enabled' : 'Disabled'}`,
              show: true,
              message: `Success! Time Sheet has been ${isChecked ? 'Enabled' : 'Disabled'} for ${personDataState.person.name}`,
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
            heading: 'Time Sheet',
            show: true,
            message: `Error has occurred while changing form state`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Network error:', err);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const toggleForm = async (event, form) => {
    const id = new Date().getTime();
    const formId = form._id;
    const formTitle = form.title;
    const personId = personDataState.person._id;

    try {
      setPersonDataState((prevState) => {
        const updatedForms = prevState.forms.map((form) => {
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
        return {
          ...prevState,
          forms: updatedForms
        };
      });
      const isChecked = event.target.checked;
      const data = {
        id: formId,
        person: personDataState.person._id,
        checked: isChecked
      };
      const response = await axios.post(process.env.REACT_APP_URL + '/toggleForm', data, {
        withCredentials: true
      });
      if (response.status === 200) {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: [
            ...prevState.toasts,
            {
              id: id,
              heading: `${formTitle} ${isChecked ? 'Enabled' : 'Disabled'}`,
              show: true,
              message: `Success! ${formTitle} has been ${isChecked ? 'Enabled' : 'Disabled'} for ${personDataState.person.name}`,
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
            heading: 'Form Error',
            show: true,
            message: `Error has occurred while changing form state`,
            background: 'danger',
            color: 'white'
          }
        ]
      }));
      console.error('Error toggling form:', error);
    } finally {
      setTimeout(() => {
        setAlertMessageState((prevState) => ({
          ...prevState,
          toasts: prevState.toasts.filter((toast) => toast.id !== id)
        }));
      }, 10000);
    }
  };

  const isFormEnabled = (availableOnDevice, personId) => {
    return availableOnDevice && availableOnDevice[personId] === true;
  };

  return (
    <article>
      <h1>Enable Forms</h1>
      <dl>
        <div className="form-access">
          {personDataState.timesheetAccess.map((form) => (
            <ToggleWithLabel
              key={`timesheet-access-${form._id}`}
              personId={personDataState.person._id}
              form={form}
              isFormEnabled={isFormEnabled}
              toggle={toggleTimeSheet}
              availableOnDevice={form.availableOnDevice}
            />
          ))}
          {personDataState.forms.map((form) => (
            <ToggleWithLabel
              key={`form-${form._id}`}
              personId={personDataState.person._id}
              form={form}
              isFormEnabled={isFormEnabled}
              toggle={(e) => toggleForm(e, form)}
              availableOnDevice={form.availableOnDeviceSerialized}
            />
          ))}
        </div>
      </dl>
    </article>
  );
};

export default PersonFormAccessArticle;
