import React, { useContext } from 'react';
import AppContext from '../lib/app-context';

export default function SaveWorkoutModal({ workout, saveWorkoutModalIsOpen, toggleSaveModal, deleteExercise }) {
  const { accessToken } = useContext(AppContext);

  function saveWorkout(e) {
    e.preventDefault();
    toggleSaveModal();
    const workoutName = { workoutName: workout.workoutName };
    const finalWorkout = workout;
    const deleteExercises = [];
    const checkExercisesSets = [];
    workout.exercises.forEach(exer => {
      if (exer.sets.length === 1 && !exer.sets[0].isDone) {
        deleteExercises.push(exer.exerciseId);
      } else {
        checkExercisesSets.push(exer);
      }
    });

    const finalExercises = [];
    checkExercisesSets.forEach(exercise => {
      const updatedSets = [];
      exercise.sets.forEach((set, index) => {
        if (!set.isDone) return;
        set.setOrder = index + 1;
        updatedSets.push(set);
      });
      exercise.sets = updatedSets;
      if (exercise.sets.length === 0) {
        deleteExercises.push(exercise.exerciseId);
      } else {
        finalExercises.push(exercise);
      }
    });

    deleteExercise(deleteExercises);
    if (finalExercises.length === 0) {
      window.location.hash = 'user-profile';
      return;
    }
    finalWorkout.exercises = finalExercises;

    fetch(`/api/workout/${workout.workoutId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      },
      body: JSON.stringify(finalWorkout)
    })
      .catch(err => console.error('ERROR:', err));

    fetch(`/api/workout/${workout.workoutId}/completed`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      },
      body: JSON.stringify(workoutName)
    })
      .then(result => { window.location.hash = 'user-profile'; })
      .catch(err => console.error('ERROR:', err));
  }

  return (
    <>
      <div className={`z-10 h-full w-full ${saveWorkoutModalIsOpen ? 'fixed' : 'hidden'}`} >
        <form onSubmit={saveWorkout}>
          <div
            className="absolute w-full h-full bg-modalGrey"
            onClick={toggleSaveModal}>
          </div>
          <div className='absolute w-[340px] h-[250px] md:w-[400px] md:h-[300px] bg-white p-3 left-0 right-0 top-[100px] mx-auto rounded-md'>
            <p className="text-2xl md:mt-4">Do you want to save this workout?</p>
            <p className='text-xl text-priRed my-4 md:my-8'>
              Sets that are not marked &apos;done&apos; won&apos;t be saved
            </p>
            <button
              type="submit"
              className="primary-button h-[40px] w-[40%] m-3">Save</button>
            <button
              type="button"
              className="h-[40px] w-[40%] border border-gray-300 m-3 shadow-xl rounded-md"
              onClick={toggleSaveModal}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
