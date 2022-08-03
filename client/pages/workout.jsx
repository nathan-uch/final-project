import React, { useState, useEffect } from 'react';

function Set() {

  return (
    <form className="mb-2 has-text-centered is-flex is-justify-content-space-between is-align-content-flex-start">
      <p className="is-size-4 set-num">1</p>
      <input type="number" min="1" className="mx-2 reps-input has-text-centered is-size-4 py-2 has-background-grey-lighter" />
      <input type="number" min="1" className="mx-2 weight-input has-text-centered is-size-4 py-2 has-background-grey-lighter" />
      <button href="#" className="set-done-btn has-background-white" ><i className="fa-solid fa-check fa-3x mx-4 unselected-check"></i></button>
    </form>
  );
}

function Exercise({ name }) {

  return (
    <div className="card mb-5">
      <div className="card-header">
        <h3 className="exercise-name card-header-title has-background-black has-text-weight-semibold is-size-4 is-justify-content-center">{name}</h3>
      </div>
      <div className="card-content pt-3 pb-0">
        <div className="mb-4 has-text-centered is-flex is-justify-content-space-between is-align-content-flex-start">
          <p className="sets-title is-inline is-size-5 has-text-weight-semibold">Set</p>
          <p className="mx-3 reps-title is-inline is-size-5 has-text-weight-semibold">Reps</p>
          <p className="mx-3 weight-title is-inline is-size-5 has-text-weight-semibold">Weight</p>
          <p className="mx-3 exer-done-title is-inline is-size-5 has-text-weight-semibold">Done</p>
        </div>
        <Set />
      </div>
      <div className="card-footer">
        <button type="button" className="add-set-btn button is-size-5 my-2 has-background-grey-lighter">Add set</button>
      </div>
    </div>
  );
}

export default function WorkoutPage(props) {
  const [exercises, setExercises] = useState(null);
  const workoutId = 1;

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`)
      .then(response => response.json())
      .then(data => {
        setExercises(data);
      })
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <div className='body-container has-text-centered'>
      <h3 className="is-inline is-size-3 has-text-weight-semibold">New Workout</h3>
      <div className='mt-5 is-flex is-align-items-center is-flex-direction-column'>
        {!exercises
          ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          : exercises.map((exercise, index) =>
          <Exercise key={index} name={exercise.name} />
          )}
      </div>
    </div>
  );
}
