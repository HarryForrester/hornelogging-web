import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddCrewModal from '../components/Modal/AddCrewModal';
import AddPersonModal from '../components/Modal/AddPersonModal';
import NewPersonButton from '../components/Button/NewPersonButton';
import NewCrewButton from '../components/Button/NewCrewButton';
import PeopleAndCrewSearch from '../components/Input/PeopleAndCrewSearch';
import CrewCard from '../components/Card/CrewCard';
import { Card, Button } from 'react-bootstrap';
import PersonCard from '../components/Card/PersonCard.jsx';
import { usePeople } from '../context/PeopleContext.js';
const Crews = () => {
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const { people, setPeople } = usePeople(); // used to get or set peopleByCrew and archivedPeople
  const [showAddPersonModal, setShowAddPersonModal] = useState(false); //  shows or hides the modal when new person is clicked



  const toggleArchivedStaff = () => {
    setShowArchived(!showArchived);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/', { withCredentials: true }); // Replace with your API endpoint
        if (response.data.isLoggedIn) {
          console.log('repsp', response.data)
          setPeople((prevState) => ({
            ...prevState,
            peopleByCrew: response.data.peopleByCrew,
            archivedPeople: response.data.archivedPeople
          }));

        } else {
          navigate('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          console.error('Error fetching crews:', error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="col-md-12">
          <h2>Crews</h2>
        </div>
        <div className="row g-0" style={{ marginBottom: '10px' }}>
          <div className="col-md-6" style={{ padding: '0px' }}>
            <NewPersonButton handleClick={() => setShowAddPersonModal(true)}/>
            <NewCrewButton />
          </div>
          <PeopleAndCrewSearch />
        </div>

        {people.peopleByCrew.map((crew) => {
          console.log('creww',crew)
          return (
          <CrewCard key={crew.name} crew={crew} />)
})}

        <Button onClick={toggleArchivedStaff} className="mb-3">
          {showArchived ? 'Hide Archived Staff' : 'Show Archived Staff'}
        </Button>
        {showArchived && (
          <Card className="mb-5">
            <Card.Header className="bg-light">
              <h5 className="mb-0 crew-name">Archived Staff</h5>
            </Card.Header>

            <Card.Body>
              <PersonCard people={people.archivedPeople} />
            </Card.Body>
          </Card>
        )}
        {showAddPersonModal && (
          <AddPersonModal show={showAddPersonModal} closeModal={() => setShowAddPersonModal(false)} />
        )}

        <AddCrewModal />
      </div>
    </>
  );
};

export default Crews;
