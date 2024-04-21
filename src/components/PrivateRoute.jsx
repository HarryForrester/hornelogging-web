import React from 'react';
import { Outlet, Navigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
const PrivateRoute = () => {
  const context = useOutletContext();
  const { isLoggedIn } = useAuth();
  console.log('isLoggedIn', isLoggedIn);
  console.log('context', context);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={context} />;
};
PrivateRoute.propTypes = {
  role: PropTypes.object.isRequired
};

export default PrivateRoute;
