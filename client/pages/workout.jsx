import React, { useEffect } from 'react';

// function ExerciseSets() {

//   return (

//   );
// }

// function ExerciseSection() {
//   return (

//   )
// }

export default function WorkoutPage(props) {
  const workoutId = 1;
  const setCount = 1;

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`)
      .then(res => res.json())
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <div className='body-container'>
      <h3 className="">New Workout</h3>
      <div>
        <div className="card">
          <div className="card-header">
            <p className="card-header-title has-background-black">Bench Press</p>
          </div>
          <form>
            <div className="card-content has-text-centered is-flex is-justify-content-space-evenly is-align-content-flex-start">
              <div>
                <p className="is-block is-size-4">Set</p>
                <p className="is-size-4">1</p>
              </div>
              <div>
                <label htmlFor={`reps${setCount}`} className="is-block is-size-4">Reps</label>
                <input type="number" id={`reps${setCount}`} min="1" className="py-2 has-background-grey-lighter" />
              </div>
              <div>
                <label htmlFor={`weight${setCount}`} className="is-block is-size-4">Weight</label>
                <input type="number" id={`weight${setCount}`} min="1" className="py-2 has-background-grey-lighter" />
              </div>
              <div>
                <p className="is-block is-size-4">Done</p>
                <a href="#"><i className="fa-solid fa-check fa-2x mx-4"></i></a>
              </div>
            </div>
            <div className="card-footer">
              <button type="submit"className="button is-size-5 my-2 has-background-grey-lighter">Add set</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
