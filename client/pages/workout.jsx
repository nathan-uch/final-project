import React, { useEffect } from 'react';

export default function WorkoutPage(props) {
  const workoutId = 1;

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`)
      .then(res => res.json())
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <>
      <h3>New Workout</h3>
      <div>{}</div>
    </>
  );
}
