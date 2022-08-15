import React, { useState, useEffect } from 'react';
import parseRoute from './lib/parse-route';
import TopNavbar from '../client/components/top-navbar';
import NewWorkout from '../client/pages/new-workout';
import Exercises from '../client/pages/exercises';
import Workout from '../client/pages/workout';
import UserProfile from '../client/pages/user-profile';
import BotNavbar from '../client/components/bot-navbar';
import ErrorPage from '../client/components/error';
import AuthPage from '../client/pages/auth';

export default function App() {
  const [curRoute, setRoute] = useState(parseRoute(window.location.hash));

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      const newRoute = parseRoute(window.location.hash);
      setRoute(newRoute);
    });
  }, []);

  function renderRoute() {
    const { path } = curRoute;
    if (path === 'user-profile' || path === '') return <UserProfile />;
    if (path === 'new-workout') return <NewWorkout />;
    if (path === 'exercise-list') return <Exercises />;
    if (path === 'workout') return <Workout />;
    if (path === 'sign-up') return <AuthPage />;
    return <ErrorPage />;
  }

  return (
    <>
      <TopNavbar />
      {renderRoute()};
      <BotNavbar />
    </>
  );
}
