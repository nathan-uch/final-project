import React, { useState, useEffect } from 'react';
import parseRoute from './lib/parse-route';
import TopNavbar from '../client/components/top-navbar';
import NewWorkout from '../client/pages/new-workout';
import Exercises from '../client/pages/exercises';
import Workout from '../client/pages/workout';
import UserProfile from '../client/pages/user-profile';
import BotNavbar from '../client/components/bot-navbar';
import ErrorPage from '../client/pages/error';
import AuthPage from '../client/pages/auth';
import AppContext from '../client/lib/app-context';
import Redirect from '../client/components/redirect';

export default function App() {
  const [curRoute, setRoute] = useState(parseRoute(window.location.hash));
  const [user, setUser] = useState(null);
  const contextValue = { curRoute, user, handleSignIn, handleSignOut };

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      const newRoute = parseRoute(window.location.hash);
      setRoute(newRoute);
    });
  }, []);

  function handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('strive-user-info', token);
    setUser(user);
    return <Redirect to='user-profile' />;
  }

  function handleSignOut() {
    window.localStorage.removeItem('strive-user-info');
    setUser(null);
  }

  function renderRoute() {
    const { path } = curRoute;
    let page = null;
    if (path === '' && user) page = <UserProfile />;
    if ((path === '' && !user) || path === 'sign-up' || path === 'sign-in') return <AuthPage />;
    if (user) {
      if (path === 'user-profile') {
        page = <UserProfile />;
      } else if (path === 'new-workout') {
        page = <NewWorkout />;
      } else if (path === 'exercise-list') {
        page = <Exercises />;
      } else if (path === 'workout') {
        page = <Workout />;
      } else {
        return <ErrorPage />;
      }
    }

    return (
      <>
        <TopNavbar />
        {page}
        <BotNavbar />
      </>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {renderRoute()}
    </AppContext.Provider>
  );
}
