import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { SkidModalProvider } from './components/Modal/Skid/SkidModalContext';
import { MapProvider } from './components/Map/MapContext';
import { ConfirmationModalProvider } from './components/ConfirmationModalContext';
import { AlertMessageProvider } from './components/AlertMessage';
import { PersonDataProvider } from './components/PersonData';
import { SkidMarkerProvider } from './components/SkidMarkerContext';
import { HazardProvider } from './components/HazardContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <SkidModalProvider>
      <MapProvider>
        <ConfirmationModalProvider>
          <AlertMessageProvider>
            <PersonDataProvider>
              <SkidMarkerProvider>
                <HazardProvider>
          <App />
          </HazardProvider>
          </SkidMarkerProvider>
          </PersonDataProvider>
          </AlertMessageProvider>
        </ConfirmationModalProvider>
      </MapProvider>
    </SkidModalProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
