import React, { useState, useEffect } from 'react';

import { createBrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar/main';
import Crews from './pages/crews';
import LoginPage from './pages/signin';
import ErrorPage from './pages/error-page';
import PrivateRoute from './components/PrivateRoute';
import Person from './pages/person';
import Maps from './pages/maps';
import Hazards from './pages/hazards';
import Forms from './pages/forms';
import Profile from './pages/profile';
import Library from './pages/library';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <NavBar />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/',
            element: <Crews />
          },
          {
            path: '/person/id',
            element: <Person />
          },
          {
            path: '/maps',
            element: <Maps />
          },
          {
            path: '/hazards',
            element: <Hazards />
          },
          {
            path: '/forms',
            element: <Forms />
          },
          {
            path: '/library',
            element: <Library />
          },
          {
            path: '/profile',
            element: <Profile />
          }
        ]
      }
    ]
  }
]);

export default router;
