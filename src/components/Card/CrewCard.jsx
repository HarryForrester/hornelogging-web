import React from 'react';
import { Card } from 'react-bootstrap';
import RemoveCrewButton from '../Button/RemoveCrewButton';
import PersonCard from './PersonCard';
import PropTypes from 'prop-types';
const CrewCard = ({ crew }) => {
  return (
    <Card className="mb-3">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 crew-name">{crew.name}</h5>
          {crew.name !== 'Unassigned' && <RemoveCrewButton crew={crew} />}
        </div>
      </Card.Header>

      <Card.Body>
        <PersonCard people={crew.people} />
      </Card.Body>
    </Card>
  );
};

CrewCard.propTypes = {
  crew: PropTypes.array.isRequired
};
export default CrewCard;
