import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';

function ExerciseTableRow({ exercise }) {
  return (
    <tr>
      <td className="py-0 px-3 md:px-5">{`${exercise.totalSets} x ${exercise.name} ${exercise.equipment === null ? '' : ` - ${exercise.equipment}`}`}</td>
      <td className="py-0 px-3 md:px-5">{`${exercise.reps} x ${exercise.weight}`}</td>
    </tr>
  );
}

function WorkoutCard({ index, workout, workoutId }) {
  const [wId] = useState(workoutId[0]);
  const date = new Date(workout[wId][0].completedAt);

  return (
    <div className=" w-[95%] min-w-[290px] max-w-[500px] bg-gray-200 mx-auto my-6 py-2 rounded-md shadow-xl">
      <div className="py-1 px-0">
        <h4 className="font-bold text-xl mt-3">Workout {wId}</h4>
        <p className='mb-5'>{`${date.toLocaleDateString()} - ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</p>
        <table className="table-fixed text-left w-full bg-gray-200">
          <thead>
            <tr>
              <th className="w-[65%] px-3 md:px-5">Exercise:</th>
              <th className='w-[35%] px-3 md:px-5'>Best Set:</th>
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
    fetch('/api/user/workout-sets', {
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
        final.reverse();
        setWorkouts(final);
      })
      .catch(err => console.error('ERROR:', err));
  }, [accessToken]);

  return (
    <div className='text-center flex flex-col md:flex-row md:min-h-screen py-[80px] md:pb-0 md:pt-[64px]'>
      <div className="w-[60%] min-w-[290px] mx-auto md:w-[30%] md:h-auto py-5 shadow-xl rounded-md md:pb-[80px]">
        <h3 className="text-4xl">{user.username}</h3>
        <p className='block my-3'>Total Workouts: {workouts && workouts.length}</p>
        {workouts !== null && workouts.length === 0 &&
          <a href="#new-workout" className="underline hover:text-priRed">Begin a new workout</a>
        }
      </div>
      <div className="mx-4 pt-6 md:w-[70%]">
        <h3 className='my-5 text-3xl'>Workout History</h3>
        {!workouts
          ? <LoadingRing />
          : workouts.map((workout, index) => {
            return <WorkoutCard key={index} index={index} workout={workout} workoutId={Object.keys(workout)} />;
          })}
      </div>
    </div>
  );
}
