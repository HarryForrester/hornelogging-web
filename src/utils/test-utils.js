// test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MapProvider } from '../components/Map/MapContext';
import { SkidModalProvider } from '../components/Modal/Skid/SkidModalContext';
import { LibraryFileProvider } from '../context/LibraryFileContext';
import { PersonFileProvider } from '../context/PersonFileContext';
import { CrewProvider } from '../context/CrewContext';
import { PeopleProvider } from '../context/PeopleContext';
import { AlertMessageProvider } from '../components/AlertMessage';
import { SkidMarkerProvider } from '../components/SkidMarkerContext';
import { ConfirmationModalProvider } from '../components/ConfirmationModalContext';
import Crews from '../pages/crews';

export const renderWithProviders = (ui, { ...renderOptions } = {}) => {
  return render(
    <MemoryRouter>
      <SkidModalProvider>
        <MapProvider>
          <LibraryFileProvider>
            <PersonFileProvider>
              <CrewProvider>
                <PeopleProvider>
                  <ConfirmationModalProvider>
                    <AlertMessageProvider>
                      <SkidMarkerProvider>
                        {ui}
                      </SkidMarkerProvider>
                    </AlertMessageProvider>
                  </ConfirmationModalProvider>
                </PeopleProvider>
              </CrewProvider>
            </PersonFileProvider>
          </LibraryFileProvider>
        </MapProvider>
      </SkidModalProvider>
    </MemoryRouter>,
    renderOptions
  );
};