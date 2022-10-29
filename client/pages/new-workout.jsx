import React, { useState, useContext } from 'react';
import AppContext from '../lib/app-context';

export default function NewWorkout() {
  const [workoutName] = useState('NewWorkout');
  const { setCurWorkout, accessToken } = useContext(AppContext);

  function handleSubmit(e) {
    const body = { workoutName };
    e.preventDefault();
    fetch('/api/new-workout', {
      method: 'POST',
      headers: { 'X-Access-Token': accessToken },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(result => {
        const { workoutId } = result;
        setCurWorkout(workoutId);
        window.location.hash = 'exercise-list';
      })
      .catch(err => console.error('ERROR:', err));
  }

  return (
    <form onSubmit={handleSubmit} className='pt-[90px] text-center'>
      <h3 className="text-3xl mb-5">Begin Workout</h3>
      <button type="submit" className="primary-button py-3 px-6 text-xl">Select Exercises</button>
    </form>
  );
}
