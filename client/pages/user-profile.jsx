import React, { useState, useEffect } from 'react';

function ExerciseTableRow({ exercise }) {

  return (
    <tr>
      <td className="py-0 exercise-col">{`${exercise.totalSets} x ${exercise.name} - ${exercise.equipment ? exercise.equipment : ''}`}</td>
      <td className="py-0">{`${exercise.weight} x ${exercise.reps}`}</td>
    </tr>
  );
}

function DesktopWorkoutCard({ index, workout, workoutId }) {
  const [wId] = useState(workoutId[0]);

  return (
    <div className="card has-background-grey-lighter center mb-5">
      <div className="card-content px-0">
        <h4>Workout {index + 1}</h4>
        <table className="table has-text-left is-fullwidth has-background-grey-lighter">
          <thead>
            <tr>
              <th className="exercise-col">Exercise:</th>
              <th>Best Set:</th>
            </tr>
          </thead>
          <tbody>
            {workout[wId].map(exercise => {
              return <ExerciseTableRow key={exercise.exerciseId} exercise={exercise} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [workouts, setWorkouts] = useState(null);
  const userId = 1;

  useEffect(() => {
    fetch(`/api/user/${userId}/workouts`)
      .then(response => response.json())
      .then(data => {
        const final = [];
        const splitByWorkout = {};
        data.forEach(set => {
          const wId = set.workoutId;
          if (!splitByWorkout[wId]) splitByWorkout[wId] = [];
          splitByWorkout[wId].push(set);
        });
        for (const key of Object.keys(splitByWorkout)) {
          final.push({ [key]: splitByWorkout[key] });
        }
        setWorkouts(final);
      })
      .catch(err => console.error('ERROR:', err));
  }, [workouts]);

  return (
    <div className='body-container has-text-centered'>
      <div className='is-hidden-touch'>
      </div>

      <div className="is-hidden-dekstop">
        <div className="card center">
          <div className="card-content">
            <h3 className="is-size-3">arnold123</h3>
            <p>Total Workouts: {!workouts ? '' : workouts.length}</p>
          </div>
        </div>

        <h3 className='my-5 is-size-3'>Workout History</h3>
        {!workouts
          ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          : workouts.map((workout, index) => {
            return <DesktopWorkoutCard key={index} index={index} workout={workout} workoutId={Object.keys(workout)} />;
          })}
      </div>
    </div>
  );
}
