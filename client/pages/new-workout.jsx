import React, { useContext } from 'react';
import AppContext from '../lib/app-context';

export default function NewWorkout() {
  const { user, setCurWorkout } = useContext(AppContext);

  function handleSubmit(e) {
    e.preventDefault();
    const accessToken = window.localStorage.getItem('strive-user-info');
    fetch(`/api/new-workout/user/${user.userId}`, {
      method: 'POST',
      headers: { 'X-Access-Token': accessToken }
    })
      .then(response => response.json())
      .then(result => {
        const { workoutId } = result;
        setCurWorkout(workoutId);
      })
      .catch(err => console.error('ERROR:', err));
    window.location.hash = 'exercise-list';
  }

  return (
    <form onSubmit={handleSubmit} className='body-container has-text-centered'>
      <h3 className="is-size-3 mb-4">Quick Start</h3>
      <button type="submit" className="button primary-button is-size-5 p-5">Begin a new Workout</button>
    </form>
  );
}
