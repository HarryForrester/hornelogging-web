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

  const findCrewName = crews.find(crew => crew._id === person.crew).name;

  const data = [
    { label: 'Crew', value: findCrewName },
    { label: 'Role', value: person?.role },
    { label: 'DoB', value: person?.dob },
    { label: 'Contact', value: `${person?.name} (${person?.phone})` },
    { label: 'Alt Contact', value: `${person?.contact} (${person?.contactphone})` },
    { label: 'Start Date', value: person?.startDate },
    { label: 'Doctor', value: person?.doctor },
    { label: 'Medical Issues', value: person?.medical }
  ];
  
  return <InfoCard data={data} imageSrc={imageSrc} />;
};

PersonInfoCard.propTypes = {
  person: PropTypes.any.isRequired,
  crews: PropTypes.array.isRequired
};

export default PersonInfoCard;
