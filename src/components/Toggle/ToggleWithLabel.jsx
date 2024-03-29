import React, { useState, useEffect } from 'react';

/**
 * Used for toggling a form so it can be enable for that person
 * @param {*} param0
 * @returns
 */
const ToggleWithLabel = ({ type, personId, form, isFormEnabled, toggle, availableOnDevice }) => {
  const [enabled, setEnabled] = useState(isFormEnabled(JSON.parse(availableOnDevice), personId));

  useEffect(() => {
    setEnabled(isFormEnabled(JSON.parse(availableOnDevice), personId));
  }, [isFormEnabled, availableOnDevice, personId]);

  return (
    <>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id={`toggle-${type}-switch-${personId}-${form?._id}-${form?.name}`}
          checked={enabled}
          data-form-id={form?._id}
          data-form-name={form?.name}
          data-person-id={personId}
          onChange={(e) => {
            toggle(e, form?._id, personId);
          }}
        />
        <label
          className="form-check-label"
          htmlFor={`toggle-${type}-switch-${personId}-${form?._id}-${form?.name}`}
          data-form-id={form?._id}
        >
          Enable Form - {form?.title}
        </label>
      </div>
    </>
  );
};

export default ToggleWithLabel;
