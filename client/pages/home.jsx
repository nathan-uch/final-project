import React from 'react';
import TopNavbar from '../components/top-navbar';
import WorkoutPage from '../pages/workout';
import BotNavbar from '../components/bot-navbar';

export default function Home(props) {
  return (
    <>
      <TopNavbar />
      <WorkoutPage />
      <BotNavbar />
    </>
  );
}
