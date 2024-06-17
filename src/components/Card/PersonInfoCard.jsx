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
  const getPersonImageUrl = (person) => {
    // eslint-disable-next-line no-undef
    return person.imgUrl.length > 0 ? `${process.env.REACT_APP_URL}/${person.imgUrl}` : '/img/default.jpg';
  };
  return <InfoCard data={data} imageSrc={getPersonImageUrl(person)} />;
};

PersonInfoCard.propTypes = {
  person: PropTypes.object.isRequired
};

export default PersonInfoCard;
