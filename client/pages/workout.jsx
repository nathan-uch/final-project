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

function Exercise({ workoutId, exercise, workout, setWorkout }) {
  const [exerciseSets, setSets] = useState([{ setOrder: 1, reps: null, weight: null, isDone: false }]);
  const [setCount, changeSetCount] = useState(1);
  const [deleteIsOpen, setDeleteOpen] = useState(false);
  const exerciseId = exercise.exerciseId;

  function addNewSet() {
    setSets([...exerciseSets, { setOrder: setCount + 1, reps: null, weight: null, isDone: false }]);
    changeSetCount(prevCount => prevCount + 1);
  }

  function openDelete() {
    deleteIsOpen ? setDeleteOpen(false) : setDeleteOpen(true);
  }

  function deleteExercise() {
    const finalWorkout = { workoutId, exercises: null };
    const updatedWorkoutExercises = workout.exercises.filter(exercise =>
      exercise.exerciseId !== exerciseId ? exercise : false
    );
    finalWorkout.exercises = updatedWorkoutExercises;
    fetch(`/api/workout/${workoutId}/exercise/${exerciseId}`, { method: 'delete' })
      .catch(err => console.error('ERROR:', err));
    setWorkout(finalWorkout);
    setDeleteOpen(false);
  }

  return (
    <div className="card mb-5">
      <div className="card-header has-background-black exercise-head is-relative">
        <h3 className="exercise-name card-header-title has-text-weight-semibold is-size-4 is-justify-content-center">{exercise.name}</h3>
        <button type="button" className="delete-exercise-btn button is-large has-background-black" onClick={openDelete}>...</button>
        <button type="button" className={`pop-delete-btn button is-danger is-outlined has-background-danger-light ${deleteIsOpen ? '' : 'hidden'}`} onClick={deleteExercise}>Delete</button>
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

function SaveWorkoutModal({ workout }) {
  const [isOpen, setOpenClose] = useState(false);

  function toggleModal() {
    !isOpen ? setOpenClose(true) : setOpenClose(false);
  }

  function saveWorkout() {
    toggleModal();
  }

  return (
    <>
      <button type="button" className="save-workout-btn button is-medium mt-3 px-6" onClick={toggleModal} >Save Workout</button>
      <div className={`modal ${!isOpen ? '' : 'is-active'}`} >
        <div>
          <div className="modal-background" onClick={toggleModal}></div>
          <div className='save-workout-modal modal-content has-background-white p-3'>
            <p className="is-size-3">Do you want to save this workout?</p>
            <p className='is-size-5 has-text-danger my-3'>Sets that are not marked &apos;done&apos; won&apos;t be saved</p>
            <button type="button" className="confirm-save-workout-btn button is-large m-3" onClick={saveWorkout} >Save</button>
            <button type="button" className="cancel-save-workout-btn button is-large m-3" onClick={toggleModal}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function WorkoutPage(props) {
  const [workout, setWorkout] = useState(null);
  const workoutId = 1;

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`)
      .then(response => response.json())
      .then(data => {
        setWorkout(data);
      })
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <div className='body-container has-text-centered'>
      <h3 className="is-size-3 has-text-weight-semibold">New Workout</h3>
      <SaveWorkoutModal workout={workout} />
      <div className='mt-5 is-flex is-align-items-center is-flex-direction-column'>
        {!workout
          ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          : workout.exercises.map((exercise, index) =>
            <Exercise key={index} workoutId={workoutId} exercise={exercise} workout={workout} setWorkout={setWorkout}/>
          )}
      </div>
    </div>
  );
}
