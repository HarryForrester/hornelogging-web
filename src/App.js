import React from 'react';
import NavBar from './components/NavBar/main.jsx';
import NoMenu from './components/NavBar/nomenu.jsx';
import SignIn from './pages/signin.jsx';
import Crews from './pages/crews.jsx';
import Person from './pages/person.jsx';
import Maps from './pages/maps.jsx';
import Library from './pages/library.jsx';
import Hazards from './pages/hazards.jsx';
import Forms from './pages/forms.jsx';
import Profile from './pages/profile.jsx';
import Training from './pages/training.jsx';
import Tasks from './components/Tasks.jsx';
import NotFound from './components/NotFound.jsx';
import { pdfjs } from 'react-pdf';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuccessAlert from './components/Alert/SuccessAlert.jsx';
import DeleteConfirmationModal from './components/Modal/DeleteConfirmationModal.jsx';
import { AuthProvider } from './context/AuthContext.js';

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  const handleSubmit = async (username, password) => {
    console.log('handmleSumiu');
    try {
      // Make a POST request to the server
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password
      });

     
      console.log('resp: ', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors or display an error message to the user
    }
  };

  return (
    <Router>
      <SuccessAlert />
      <DeleteConfirmationModal />
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <React.Fragment>
                <NoMenu />
                <SignIn handleSubmit={handleSubmit} />
              </React.Fragment>
            }
          />

          <Route
            path="/"
            element={
              <React.Fragment>
                <NavBar/>
                <Crews />
              </React.Fragment>
            }
          />
          <Route
            path="/person/:id"
            element={
              <React.Fragment>
                <NavBar/>
                <Person />
              </React.Fragment>
            }
          />
          <Route
            path="/maps"
            element={
              <React.Fragment>
                <NavBar />
                <Maps />
              </React.Fragment>
            }
          />
          <Route
            path="/hazards"
            element={
              <React.Fragment>
                <NavBar/>
                <Hazards />
              </React.Fragment>
            }
          />
          <Route
            path="/forms"
            element={
              <React.Fragment>
                <NavBar />
                <Forms />
              </React.Fragment>
            }
          />
          <Route
            path="/library"
            element={
              <React.Fragment>
                <NavBar />
                <Library />
              </React.Fragment>
            }
          />
          <Route
            path="/profile"
            element={
              <React.Fragment>
                <NavBar />
                <Profile />
              </React.Fragment>
            }
          />
          <Route
            path="/tasks"
            element={
              <React.Fragment>
                <NavBar />
                <Tasks />
              </React.Fragment>
            }
          />

          <Route
            path="/training/:id?"
            element={
              <React.Fragment>
                <NavBar />
                <Training />
              </React.Fragment>
            }
          />

          {/* For any paths not matching the specified ones, show NotFound component */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
