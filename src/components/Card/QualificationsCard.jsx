import React from 'react';
import { Card } from 'react-bootstrap';
import RemoveCrewButton from '../Button/RemoveCrewButton';
import PersonCard from './PersonCard';
import PropTypes from 'prop-types';
const QualificationsCard = ({ person }) => {
  const fakeData = [
    {
      _id: 0,
      complete: false,
      employee: 'Mr Saggy Hands',
      title: 'NZ Certificate in Drinking Beer'
    },
    {
      _id: 1,
      complete: false,
      employee: 'Mr Saggy Legs',
      title: 'NZ Certificate in Smoking Beer'
    }
  ];

  return (
    <Card className="mb-5">
      <Card.Header className="bg-light">Qualifications</Card.Header>

      <Card.Body></Card.Body>
    </Card>
  );
};

QualificationsCard.propTypes = {
  person: PropTypes.object.isRequired
};
export default QualificationsCard;
