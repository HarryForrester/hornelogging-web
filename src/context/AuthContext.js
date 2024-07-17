/* eslint-disable no-undef */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/session`, {
          withCredentials: true,
        });
        setSession(response.data)
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);


  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/login`, {
        username,
        password
      });
      if (response.status === 200) {
        const responsel = await axios.get(`${process.env.REACT_APP_URL}/session`);
        setSession(response.data)

        //setUsername(response.data.username);
        //setIsLoggedIn(response.data.isLoggedIn);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/logout`, {}, { withCredentials: true });
      //setUsername(null);
      //setIsLoggedIn(false);
      setSession(null)

    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = {
    session,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export const useAuth = () => {
  return useContext(AuthContext);
};
