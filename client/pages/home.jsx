import React from 'react';
import Navbar from '../components/navbar';
import NewWorkout from '../pages/new-workout';

export default function Home(props) {
  return (
    <div>
      <Navbar />
      <NewWorkout />
    </div>
  );
}
