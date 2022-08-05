import React, { useEffect } from 'react';

export default function UserProfile() {

  useEffect(() => {
    const userId = 1;
    fetch(`/api/user/${userId}/workouts`)
      .then(response => response.json())
      .then(data => {
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

        <div className="card has-background-grey-lighter center mb-5">
          <div className="card-content">
            <h4>New Workout</h4>
            <table className="table has-text-left is-fullwidth has-background-grey-lighter">
              <thead>
                <tr>
                  <th>Exercise:</th>
                  <th>Best Set:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-0">3x Bench Press</td>
                  <td className="py-0">50kg x 8</td>
                </tr>
                <tr>
                  <td className="py-0">3x Bench Press</td>
                  <td className="py-0">50kg x 8</td>
                </tr>
                <tr>
                  <td className="py-0">3x Bench Press</td>
                  <td className="py-0">50kg x 8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card has-background-grey-lighter center mb-5">
          <div className="card-content">
            <h4>New Workout</h4>
            <table className="table has-text-left is-fullwidth has-background-grey-lighter">
              <thead>
                <tr>
                  <th>Exercise:</th>
                  <th>Best Set:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-0">3x Bench Press</td>
                  <td className="py-0">50kg x 8</td>
                </tr>
                <tr>
                  <td className="py-0">3x Bench Press</td>
                  <td className="py-0">50kg x 8</td>
                </tr>
                <tr>
                  <td className="py-0">3x Bench Press</td>
                  <td className="py-0">50kg x 8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
