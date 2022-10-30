import React, { useState, useContext } from 'react';
import AppContext from '../lib/app-context';

export default function NewWorkout() {
  const [workoutName, setWorkoutName] = useState('New Workout');
  const { setCurWorkout, accessToken } = useContext(AppContext);

  function handleSubmit(e) {
    e.preventDefault();
    const body = { workoutName };
    fetch('/api/new-workout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      },
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

  function workoutNameChange(e) {
    setWorkoutName(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit} className='pt-[90px] flex flex-col justify-center items-center gap-4'>
      <h3 className="text-3xl mb-5 text-center font-bold">Begin Workout</h3>
      <div className='w-full max-w-[300px]'>
        <label htmlFor="workoutName" className="w-full text-xl">Workout Name</label>
        <input
          onChange={workoutNameChange}
          type="text"
          id="workoutName"
          name='workoutName'
          placeholder='Ex. Chest and Triceps'
          className="bg-gray-200 w-full rounded-md p-3 text-xl" />
      </div>
      <button type="submit" className="primary-button w-[70%] max-w-[300px] py-3 px-4 text-xl">Select Exercises</button>
    </form>
  );
}
