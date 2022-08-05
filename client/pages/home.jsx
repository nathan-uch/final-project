import React from 'react';
import TopNavbar from '../components/top-navbar';
import UserProfile from '../pages/user-profile';
import BotNavbar from '../components/bot-navbar';

export default function Home(props) {
  return (
    <>
      <TopNavbar />
      <UserProfile />
      <BotNavbar />
    </>
  );
}
