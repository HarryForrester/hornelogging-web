import React from 'react';
import { Card, Figure } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PersonCard = ({ people }) => {
  const navigate = useNavigate();

  const personInfo = (id) => {
    navigate(`/person/${id}`);
  };
  const getPersonImageUrl = (person) => {
    // eslint-disable-next-line no-undef
    const imgUrl = person.imgUrl;

    return imgUrl?.url ? `${person.imgUrl.url}` : '/img/default.jpg';
  };
  return (
    <Card.Body className="card-padding">
      <div className="row g-0">
        {people.map((person) => (
          <div key={person._id} className="col-md-1" style={{ marginRight: '15px' }}>
            <Figure onClick={() => personInfo(person._id)} className="figure personcard">
              <Figure.Image
                src={getPersonImageUrl(person)}
                alt={person.firstName + ' ' + person.lastName}
                className="figure-img img-fluid z-depth-1 rounded mb-1"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
              <Figure.Caption className="figure-caption text-center">{person.firstName +  " " + person.lastName}</Figure.Caption>
            </Figure>
          </div>
        ))}
      </div>
    </Card.Body>
  );
};

PersonCard.propTypes = {
  people: PropTypes.array.isRequired
};

export default PersonCard;
