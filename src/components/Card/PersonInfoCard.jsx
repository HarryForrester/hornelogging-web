import React from 'react';
import InfoCard from './InfoCard';
import PropTypes from 'prop-types';

const PersonInfoCard = ({ person }) => {
  const data = [
    { label: 'Crew', value: person?.crew },
    { label: 'Role', value: person?.role },
    { label: 'DoB', value: person?.dob },
    { label: 'Contact', value: `${person?.name} (${person?.phone})` },
    { label: 'Alt Contact', value: `${person?.contact} (${person?.contactphone})` },
    { label: 'Start Date', value: person?.startDate },
    { label: 'Doctor', value: person?.doctor },
    { label: 'Medical Issues', value: person?.medical }
  ];

  return <InfoCard data={data} imageSrc={process.env.REACT_APP_URL + '/' + person?.imgUrl} />;
};

PersonInfoCard.propTypes = {
  person: PropTypes.object.isRequired
};

export default PersonInfoCard;
