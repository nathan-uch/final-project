import React, { useContext } from 'react';
import AppContext from '../lib/app-context';

export default function NewWorkout() {
  const { setCurWorkout, accessToken } = useContext(AppContext);

  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/new-workout', {
      method: 'POST',
      headers: { 'X-Access-Token': accessToken }
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
    <form onSubmit={handleSubmit} className='body-container has-text-centered'>
      <h3 className="is-size-3 mb-4">Quick Start</h3>
      <button type="submit" className="button primary-button is-size-5 p-5">Begin a new Workout</button>
    </form>
  );
}
