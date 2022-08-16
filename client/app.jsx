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

export default function App() {
  const [curRoute, setRoute] = useState(parseRoute(window.location.hash));
  const contextValue = { curRoute };

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      const newRoute = parseRoute(window.location.hash);
      setRoute(newRoute);
    });
  }, []);

  function renderRoute() {
    const { path } = curRoute;
    let page = null;
    if (path === 'sign-up' || path === 'sign-in') {
      return <AuthPage />;
    } else {
      if (path === 'user-profile' || path === '') {
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
