import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import AddCrewModal from '../components/Modal/AddCrewModal';
import AddPersonModal from '../components/Modal/AddPersonModal';
import NewPersonButton from '../components/Button/NewPersonButton';
import NewCrewButton from '../components/Button/NewCrewButton';
import PeopleAndCrewSearch from '../components/Input/PeopleAndCrewSearch';
import CrewCard from '../components/Card/CrewCard';
import NavBar from '../components/NavBar/main.jsx';
import { useMap } from '../components/Map/MapContext.js';

const Crews = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const { mapState, setMapState }  = useMap();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/', { withCredentials: true }); // Replace with your API endpoint
                
                if (response.data.isLoggedIn) {
        
                    setMapState((prevState) => ({
                        ...prevState,
                        crews: response.data.crews
                    })) 
                
                    setUsername(response.data.username);
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
        <NavBar username={username} />
        <div className="container">
            <div className="col-md-12">
                <h2>Crews</h2>
            </div>
            <div className="row g-0" style={{ marginBottom: '10px' }}>
                <div className="col-md-6" style={{padding: '0px'}}>
                    <NewPersonButton />
                    <NewCrewButton />
                </div>
                <PeopleAndCrewSearch />
                
            </div>

            {mapState.crews.map((crew) => (
                    <CrewCard key={crew.name} crew={crew} />
            ))}
                
            <AddPersonModal />
            <AddCrewModal />
            
            </div>
        </>
    );
};

export default Crews;
