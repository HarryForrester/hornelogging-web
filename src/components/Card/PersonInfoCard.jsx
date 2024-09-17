import React, {useState, useEffect} from 'react';
import InfoCard from './InfoCard';
import PropTypes from 'prop-types';

const PersonInfoCard = ({ person, crews }) => {
  const [imageSrc, setImageSrc] = useState('/img/default.jpg');
  
  useEffect(() => {
    const imgUrl = person?.imgUrl;
    if (imgUrl?.url) {
      setImageSrc(person.imgUrl.url);
    } else {
      setImageSrc('/img/default.jpg');
    }
  }, [person?.imgUrl]);

  const findCrew = crews.find(crew => crew._id === person.crew);
  const crewName = findCrew ? findCrew.name : 'Unassigned';
  
  const data = [
    { label: 'Crew', value: crewName },
    { label: 'Role', value: person?.role },
    { label: 'DoB', value: person?.dob },
    { label: 'Contact', value: `${person?.firstName} ${person.lastName} (${person?.phone})` },
    { label: 'Alt Contact', value: `${person?.contact} (${person?.contactphone})` },
    { label: 'Start Date', value: person?.startDate },
    { label: 'Doctor', value: person?.doctor },
    { label: 'Medical Issues', value: person?.medical }
  ];
  
  return (
    <div data-testid="person-info-card">
      <InfoCard data={data} imageSrc={imageSrc} />;
    </div>
  );
};

PersonInfoCard.propTypes = {
  person: PropTypes.any.isRequired,
  crews: PropTypes.array.isRequired
};

export default PersonInfoCard;
