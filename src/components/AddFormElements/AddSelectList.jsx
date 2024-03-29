import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList,
  faPlusCircle,
  faMinusCircle,
  faCircleMinus
} from '@fortawesome/free-solid-svg-icons';

function AddSelectList({
  itemKey,
  items = [],
  label = '',
  onRemove,
  onRemoveItem,
  onChange,
  addItem,
  onItemLabelChange
}) {
  //const [selectListLabel, setSelectListLabel] = useState(label);
  const [selectListItems, setSelectListItems] = useState(items);
  console.log('meme key: ', itemKey);
  /* const handleLabelChange = (event) => {
    setSelectListLabel(event.target.value);
  }; */

  const handleItemChange = (index, event) => {
    const updatedItems = [...selectListItems];
    updatedItems[index] = event.target.value;
    setSelectListItems(updatedItems);
  };

  const handleAddItem = () => {
    setSelectListItems((prevItems) => [...prevItems, '']);
  };

  const handleRemoveItem = (index) => {
    setSelectListItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <div className="selectlistElementContainer d-flex flex-column px-3 mb-3 element-container">
      <div className="d-flex flex-row align-items-center">
        <label className="elementLabel">
          <FontAwesomeIcon icon={faList} />
          <span className="span-text-element"> Select List</span>
        </label>
        <div className="flex-grow-1">
          <Form.Control
            type="text"
            className="selectlist-label form-control element-name"
            placeholder="Select List Element"
            value={label}
            onChange={onChange}
            isInvalid={!label.trim()}
            style={{ marginTop: '20px' }}
            required
          />
          <Form.Control.Feedback type="invalid">Selectlist title is required</Form.Control.Feedback>
        </div>
        <Button
          className="add-selectlist-item btn btn-secondary ms-2"
          onClick={addItem}
          style={{ background: 'none', color: 'black', border: 'none' }}
        >
          <FontAwesomeIcon icon={faPlusCircle} size="lg" />
        </Button>
        <Button
          className="btn btn-danger remove-selectlist-btn ms-2"
          onClick={onRemove}
          style={{ background: 'none', color: 'red', border: 'none' }}
        >
          <FontAwesomeIcon icon={faMinusCircle} size="lg" />
        </Button>
      </div>

      <div className="d-flex flex-column">
        {items.map((item, index) => (
          <div key={index} className="select-list-item d-flex flex-row align-items-center">
            <div
              className="flex-grow-2"
              style={{ height: '25px', marginBottom: '35px', marginLeft: '100px' }}
            >
              <Form.Control
                type="text"
                className="form-control select-item-input selectlist-item"
                placeholder="New Item"
                value={item}
                onChange={(event) => onItemLabelChange(itemKey, index, event)}
                isInvalid={!item.trim()}
                required
                style={{ width: '200px' }}
              />
              <Form.Control.Feedback type="invalid">
                Selectlist item is required
              </Form.Control.Feedback>
            </div>
            <Button
              className="btn btn-danger ms-2 remove-selectlist-item"
              onClick={() => onRemoveItem(itemKey, index)}
              style={{ background: 'none', color: 'red', border: 'none', marginBottom: '20px' }}
            >
              <FontAwesomeIcon icon={faCircleMinus} size="lg" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

AddSelectList.propTypes = {
  itemKey: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  onItemLabelChange: PropTypes.func.isRequired
};

export default AddSelectList;
