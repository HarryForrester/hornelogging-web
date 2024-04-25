import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import RemoveCrewButton from '../Button/RemoveCrewButton';
import PersonCard from './PersonCard';
import PropTypes from 'prop-types';
import QualifiedTable from '../QualifiedTable';
import AddQualificationModal from '../Modal/AddQualificationModal';
import { usePersonData } from '../PersonData';

const QualificationsCard = ({ person }) => {
  const [isQualModalVisible, setQualModalVisible] = useState(false);
  const { personDataState, setPersonDataState } = usePersonData();

  return (
    <>
      <AddQualificationModal show={isQualModalVisible} hide={() => setQualModalVisible(false)} />
      <Card className="mb-5">
        <Card.Header className="bg-light">Qualifications</Card.Header>

        <Card.Body>
          <Button onClick={() => setQualModalVisible(true)}>Add Qualification</Button>
          <QualifiedTable quals={personDataState.quals} person={person} />
        </Card.Body>
      </Card>
    </>
  );
};

QualificationsCard.propTypes = {
  person: PropTypes.object.isRequired,
  quals: PropTypes.array.isRequired
};
export default QualificationsCard;
