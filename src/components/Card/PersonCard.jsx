import React from 'react';
import { Card, Figure } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PersonCard = ({ crew }) => {
  const navigate = useNavigate();

  const personInfo = (id) => {
    navigate(`/person/${id}`);
  };

  return (
    <Card.Body className="card-padding">
      <div className="row g-1">
        {crew.people.map((person) => (
          <div key={person._id} className="col-md-2">
            <Figure onClick={() => personInfo(person._id)} className="figure personcard">
              <Figure.Image
                src={`${process.env.REACT_APP_URL}/${person.imgUrl}`}
                alt={person.name}
                className="figure-img img-fluid z-depth-1 rounded mb-0"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <Figure.Caption className="figure-caption text-center">{person.name}</Figure.Caption>
            </Figure>
          </div>
        ))}
      </div>
    </Card.Body>
  );
};

export default PersonCard;
