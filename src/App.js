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

import NotFound from './components/NotFound.jsx';
import { pdfjs } from 'react-pdf';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SuccessAlert from './components/Alert/SuccessAlert.jsx';
import { useAlertMessage } from './components/AlertMessage.js';
import DeleteConfirmationModal from './components/Modal/DeleteConfirmationModal.jsx';

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  const { alertMessageState, setAlertMessageState } = useAlertMessage();

  return (
    <Router>
      <SuccessAlert />
      <DeleteConfirmationModal />

      <Routes>
        <Route
          path="/login"
          element={
            <React.Fragment>
              <NoMenu />
              <SignIn />
            </React.Fragment>
          }
        />
        <Route
          path="/"
          element={
            <React.Fragment>
              <NavBar />
              <Crews />
            </React.Fragment>
          }
        />
        <Route
          path="/person/:id"
          element={
            <React.Fragment>
              <NavBar />
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
              <NavBar />
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
        {/* For any paths not matching the specified ones, show NotFound component */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
