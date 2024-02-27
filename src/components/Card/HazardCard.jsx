import React, {useState, useEffect} from 'react';
import { Card, Form } from 'react-bootstrap';

const HazardCard = ({ hazard, selectAll, handleHazardChange }) => {
  const { _id, color, id, title, cat, harms, reviewDate, reviewReason } = hazard;
  const [toggle, setToggle] = useState(selectAll);

  useEffect(() => {
    setToggle(selectAll);
    console.log("selectalll buttjksdfblsf: ", selectAll);
  },[selectAll])



  return (
    <Card style={{ marginBottom: '10px' }}>
      <div className="search-text" style={{ display: 'none' }}>{/* replace with your search text value */}</div>
      <div className="id-text" style={{ display: 'none' }}>{_id}</div>
      <Card.Header style={{ backgroundColor: color }}>
        <div className="d-flex align-items-center">
          <Form.Check
            id={_id}
            type="checkbox"
            className="hazard-check"
            onChange={() =>handleHazardChange(_id)}
            checked={selectAll}
          />
          <label className="form-check-label" htmlFor={_id}>
            &nbsp;{id}:&nbsp;<em>{title}</em>
          </label>
          <div className="ms-auto"><b>{cat}</b></div>
        </div>
      </Card.Header>
      <Card.Body>
        <dl>
          {Object.entries(harms).map(([key, values]) => (
            <React.Fragment key={key}>
              <dt style={{ width: '300px' }}>{key}</dt>
              <dd>
                <ul>
                  {values.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </dd>
            </React.Fragment>
          ))}
        </dl>
        <div className="text-end mt-2"><em>Reviewed: {reviewDate} ({reviewReason})</em></div>
      </Card.Body>
    </Card>
  );
};

export default HazardCard;
