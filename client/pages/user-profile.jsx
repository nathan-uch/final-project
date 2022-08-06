import React, { useState, useEffect } from 'react';

function DesktopWorkoutCard() {

  return (
    <div className="card has-background-grey-lighter center mb-5">
      <div className="card-content px-0">
        <h4>Workout 1</h4>
        <table className="table has-text-left is-fullwidth has-background-grey-lighter">
          <thead>
            <tr>
              <th>Exercise:</th>
              <th>Best Set:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-0">3x Bench Press - Barbell</td>
              <td className="py-0">60kg x 8</td>
            </tr>
            <tr>
              <td className="py-0">3x Incline Press - Dumbbell</td>
              <td className="py-0">50kg x 8</td>
            </tr>
            <tr>
              <td className="py-0">4x Chest Fly - Cable</td>
              <td className="py-0">30kg x 10</td>
            </tr>
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
  }, []);

  return (
    <div className='body-container has-text-centered'>
      <div className='is-hidden-touch'>
      </div>

      <div className="is-hidden-dekstop">
        <div className="card center">
          <div className="card-content">
            <h3 className="is-size-3">username</h3>
            <p>Total Workouts: {}</p>
          </div>
        </div>

        <h3 className='my-5 is-size-3'>Workout History</h3>
        {workouts.map((workout, index) => {
          return <DesktopWorkoutCard key={index} />;
        })}
      </div>
    </div>
  );
}
