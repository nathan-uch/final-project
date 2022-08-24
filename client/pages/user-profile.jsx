import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';

function ExerciseTableRow({ exercise }) {

  return (
    <tr>
      <td className="py-0 exercise-col">{`${exercise.totalSets} x ${exercise.name} - ${exercise.equipment && exercise.equipment}`}</td>
      <td className="py-0">{`${exercise.reps} x ${exercise.weight}`}</td>
    </tr>
  );
}

function MobileWorkoutCard({ index, workout, workoutId }) {
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
  const { user, accessToken } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/user/workouts', {
      headers: { 'X-Access-Token': accessToken }
    })
      .then(response => response.json())
      .then(result => {
        const final = [];
        const splitByWorkout = {};
        result.forEach(set => {
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
  }, [accessToken]);

  return (
    <div className='has-text-centered is-flex is-flex-direction-column user-profile'>
      <div className="card center user-info">
        <div className="card-content">
          <h3 className="is-size-3 profile-username">{user.username}</h3>
          <p>Total Workouts: {workouts && workouts.length}</p>
          {workouts !== null && workouts.length === 0
            ? <>
              <p className="no-workout-msg mt-5 is-size-6 ">
                Click
                <a href="#new-workout" className="is-underlined no-workout-msg">
                  here
                </a>
                to begin workout.
              </p>
            </>
            : false
          }
        </div>
      </div>
      <div className="mx-4 pt-6 profile-body">
        <h3 className='my-5 is-size-3'>Workout History</h3>
        {!workouts
          ? <LoadingRing />
          : workouts.map((workout, index) => {
            return <MobileWorkoutCard key={index} index={index} workout={workout} workoutId={Object.keys(workout)} />;
          })}
      </div>
    </div>
  );
}
