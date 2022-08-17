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
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/user/${user.userId}/workouts`)
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
  }, [user]);

  return (
    <div className='body-container has-text-centered p-0 mb-0 desktop-body-container'>
      <div className='is-hidden-touch columns m-0 profile-desktop-body'>
        <div className="column is-4 has-text-centered profile-desktop-left-col">
          <h3 className="my-3 is-size-3">arnold123</h3>
          <p className="is-size-5">Total Workouts: {workouts && workouts.length}</p>
        </div>
        <div className="column is-8 px-4 is-flex is-flex-direction-column is-align-items-center">
          <h3 className="my-3 is-size-3">Workout History</h3>
            <div className="card">
              <div className="card-content px-0">
                <h4>Workout {}</h4>
                <p>Total Exercises: </p>
              </div>
            </div>
          {/* {!workouts
          } */}
        </div>
      </div>

      <div className="is-hidden-desktop mx-4 pt-6 profile-mobile-body">
        <div className="card center">
          <div className="card-content">
            <h3 className="is-size-3">arnold123</h3>
            <p>Total Workouts: {workouts && workouts.length}</p>
            {workouts !== null && workouts.length === 0
              ? <>
                  <p className="no-workout-msg mt-5 is-size-6 ">Click <a href="#new-workout" className="is-underlined no-workout-msg">here</a> to begin workout.</p>
                </>
              : false
            }
          </div>
        </div>

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
