import React, { useState, useEffect } from 'react';

function Set({ setOrder, isDone, exerciseSets, setSets, setIndex }) {
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  function toggleSetDone() {
    if (!reps || !weight) {
      return false;
    }
    const updatedDoneValue = exerciseSets.map((set, index) => {
      if (setIndex === index) {
        return !isDone ? { ...set, isDone: true } : { ...set, isDone: false };
      }
      return set;
    });
    setSets(updatedDoneValue);
  }

  function repsChange(e) {
    setReps(e.target.value);
  }

  function weightChange(e) {
    setWeight(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const updatedRepsAndWeight = exerciseSets.map((set, index) => {
      if (setIndex === index) {
        return { ...set, reps, weight };
      }
      return set;
    });
    setSets(updatedRepsAndWeight);
  }

  return (
    <form onSubmit={handleSubmit} className="set-form mb-2 has-text-centered is-flex is-justify-content-space-between is-align-content-flex-start">
      <p className="mx-3 is-size-4 set-num">{setOrder}</p>
      {!isDone
        ? <input required type="number" min="1" value={reps} onChange={repsChange} className="mx-2 reps-input has-text-centered is-size-4 py-2 has-background-grey-lighter" />
        : <p className="reps-value is-size-4 mr-3">{reps}</p>}
      {!isDone
        ? <input required type="number" min="1" value={weight} onChange={weightChange} className="mx-2 weight-input has-text-centered is-size-4 py-2 has-background-grey-lighter" />
        : <p className="weight-value is-size-4 mr-3">{weight}</p>
      }
      <button href="#" className="set-done-btn has-background-white" onClick={toggleSetDone} type="submit">
        <i className={`fa-solid fa-check fa-3x mx-4 ${isDone ? 'done-check' : 'unselected-check'}`}></i></button>
    </form>
  );
}

function Exercise({ name, exerciseId }) {
  const [exerciseSets, setSets] = useState([{ setOrder: 1, reps: null, weight: null, isDone: false }]);
  const [setCount, changeSetCount] = useState(1);

  function addNewSet() {
    setSets([...exerciseSets, { setOrder: setCount + 1, reps: null, weight: null, isDone: false }]);
    changeSetCount(prevCount => prevCount + 1);
  }

  return (
    <div className="card mb-5">
      <div className="card-header">
        <h3 className="exercise-name card-header-title has-background-black has-text-weight-semibold is-size-4 is-justify-content-center">{name}</h3>
      </div>
      <div className="card-content pt-3 pb-0">
        <div className="mb-4 has-text-centered is-flex is-justify-content-space-between is-align-content-flex-start">
          <p className="mx-3 sets-title is-inline is-size-5 has-text-weight-semibold">Set</p>
          <p className="mx-3 reps-title is-inline is-size-5 has-text-weight-semibold">Reps</p>
          <p className="mx-3 weight-title is-inline is-size-5 has-text-weight-semibold">Weight</p>
          <p className="mx-3 exer-done-title is-inline is-size-5 has-text-weight-semibold">Done</p>
        </div>
        {exerciseSets.map((set, index) =>
          <Set key={index} setOrder={set.setOrder} isDone={set.isDone} setIndex={index} exerciseSets={exerciseSets} setSets={setSets} />
        )}
      </div>
      <div className="card-footer">
        <button type="button" onClick={addNewSet} className="add-set-btn button is-size-5 my-2 has-background-grey-lighter">Add set</button>
      </div>
    </div>
  );
}

export default function WorkoutPage(props) {
  const [workoutExercises, setWorkoutExercises] = useState(null);
  const workoutId = 1;

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`)
      .then(response => response.json())
      .then(data => {
        setWorkoutExercises(data);
      })
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <div className='body-container has-text-centered'>
      <h3 className="is-inline is-size-3 has-text-weight-semibold">New Workout</h3>
      <div className='mt-5 is-flex is-align-items-center is-flex-direction-column'>
        {!workoutExercises
          ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          : workoutExercises.map((exercise, index) =>
            <Exercise key={index} name={exercise.name} exerciseId={exercise.exerciseId} exerciseIndex={index} />
          )}
      </div>
    </div>
  );
}
