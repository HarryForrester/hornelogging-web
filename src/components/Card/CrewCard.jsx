import React from 'react';
import { Card } from 'react-bootstrap';
import RemoveCrewButton from '../Button/RemoveCrewButton';
import PersonCard from './PersonCard';

const CrewCard = ({ crew }) => {
  return (
    <Card className="mb-5">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 crew-name">{crew.name}</h5>
          {crew.name !== 'Unassigned' && <RemoveCrewButton crew={crew} />}
        </div>
      </Card.Header>

      <Card.Body>
        <PersonCard crew={crew} />
      </Card.Body>
    </Card>
  );
};

export default CrewCard;
