import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import QualifiedTable from '../QualifiedTable';
import AddQualificationModal from '../Modal/AddQualificationModal';

const QualificationsCard = ({ person, quals, setQuals }) => {
  const [isQualModalVisible, setQualModalVisible] = useState(false);

  return (
    <>
      <AddQualificationModal show={isQualModalVisible} hide={() => setQualModalVisible(false)} person={person} setQuals={setQuals} />
      <Card className="mb-4">
        <Card.Header className="bg-light">Qualifications</Card.Header>

        <Card.Body>
          <Button onClick={() => setQualModalVisible(true)}>Add Qualification</Button>
          <QualifiedTable quals={quals} person={person} setQuals={setQuals} />
        </Card.Body>
      </Card>
    </>
  );
};

QualificationsCard.propTypes = {
  person: PropTypes.any.isRequired,
  quals: PropTypes.array.isRequired,
  setQuals: PropTypes.func.isRequired,
};
export default QualificationsCard;
