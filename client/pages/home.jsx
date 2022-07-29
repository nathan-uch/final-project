import React from 'react';
import TopNavbar from '../components/top-navbar';
import Exercises from '../pages/exercises';
import BotNavbar from '../components/bot-navbar';

export default function Home(props) {
  return (
    <div>
      <TopNavbar />
      <Exercises />
      <BotNavbar />
    </div>
  );
}
