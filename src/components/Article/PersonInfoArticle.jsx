import React from 'react';
import InfoArticle from './InfoArticle';

const PersonInfoArticle = ({ person }) => {

  const data = [
    { label: 'Crew', value: person?.crew },
    { label: 'Role', value: person?.role },
    { label: 'DoB', value: person?.dob },
    { label: 'Contact', value: `${person?.name} (${person?.phone})` },
    { label: 'Alt Contact', value: `${person?.contact} (${person?.contactphone})` },
    { label: 'Start Date', value: person?.startDate },
    { label: 'Doctor', value: person?.doctor },
    { label: 'Medical Issues', value: person?.medical },
  ];

  return <InfoArticle data={data} imageSrc={process.env.REACT_APP_URL + "/" + person?.imgUrl} />;
};

export default PersonInfoArticle;
