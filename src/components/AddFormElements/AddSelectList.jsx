import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlusCircle, faMinusCircle, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

function escapeHTML(html) {
  // Implementation for escaping HTML characters
  // You can use a library like DOMPurify for better security
  // For simplicity, let's just replace <, >, &, " with their HTML entities
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function AddSelectList({ itemLabels = [], label = "", onRemove }) {
  const [selectListLabel, setSelectListLabel] = useState(label);
  const [selectListItems, setSelectListItems] = useState(itemLabels);

  const handleLabelChange = (event) => {
    setSelectListLabel(event.target.value);
  };

  const handleItemChange = (index, event) => {
    const updatedItems = [...selectListItems];
    updatedItems[index] = event.target.value;
    setSelectListItems(updatedItems);
  };

  const handleAddItem = () => {
    setSelectListItems((prevItems) => [...prevItems, ""]);
  };

  const handleRemoveItem = (index) => {
    setSelectListItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <div className="selectlistElementContainer d-flex flex-column mb-3 element-container" style={{ padding: '5px' }}>
        <div className="d-flex flex-row selectlist-element" style={{ paddingLeft: '20px' }}>
            <label className="elementLabel">
            <FontAwesomeIcon icon={faList} />
            <span className='span-text-element'> Select List</span>
            </label>
            <Form.Control
            type="text"
            className="selectlist-label form-control element-name"
            placeholder="Select List Element"
            value={selectListLabel}
            onChange={handleLabelChange}
            />
            <Button className="add-selectlist-item btn btn-secondary ms-2" onClick={handleAddItem} style={{background: 'none', color:'black', border: 'none'}}>
            <FontAwesomeIcon icon={faPlusCircle} size="lg" />
            </Button>
            <Button className="btn btn-danger remove-selectlist-btn ms-2" onClick={onRemove} style={{background: 'none', color:'red', border: 'none'}}>
            <FontAwesomeIcon icon={faMinusCircle} size="lg" />
            </Button>
        </div>

        <div className="d-flex flex-column">
            {selectListItems.map((item, index) => (
                <div key={index} className="select-list-item d-flex flex-row align-items-center">
                    <Form.Control
                        type="text"
                        className="form-control select-item-input selectlist-item"
                        placeholder="New Item"
                        style={{ width: '150px', marginTop: '10px', marginLeft: '120px' }}
                        value={item}
                        onChange={(e) => handleItemChange(index, e)}
                    />
                    <Button
                        className="btn btn-danger ms-2 remove-selectlist-item"
                        onClick={() => handleRemoveItem(index)}
                        style={{ background: 'none', color: 'red', border: 'none' }}
                    >
                        <FontAwesomeIcon icon={faCircleMinus} />
                    </Button>
                </div>
            ))}
        </div>
    </div>
  );
}

export default AddSelectList;
