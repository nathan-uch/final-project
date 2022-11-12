import React, { useState } from 'react';
import LoadingRing from '../components/loading-ring';

function Set({ exercise, setExercise, setIndex, setOrder, isDone, updateWorkout }) {

  function toggleSetDone() {
    if (exercise.sets[setIndex].reps === 0 || exercise.sets[setIndex].reps === null) return;
    const updatedSets = exercise.sets.map((s, i) => {
      if (i === setIndex) {
        return { ...s, isDone: !exercise.sets[setIndex].isDone };
      }
      return s;
    });
    setExercise({ ...exercise, sets: updatedSets });
  }

  function repsChange(e) {
    const updatedSets = exercise.sets.map((s, i) => {
      if (i === setIndex) return { ...s, reps: Math.round(e.target.value) };
      return s;
    });
    setExercise({ ...exercise, sets: updatedSets });
  }

  function weightChange(e) {
    const updatedSets = exercise.sets.map((s, i) => {
      if (i === setIndex) return { ...s, weight: Math.round((e.target.value * 10) / 10) };
      return s;
    });
    setExercise({ ...exercise, sets: updatedSets });
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateWorkout();
  }

  return (
    <form onSubmit={handleSubmit}
      className="h-[45px] mb-1 text-center flex justify-between items-center content-start">
      <p className="mx-2 text-2xl w-[28px] font-bold">{setOrder}</p>
      {!exercise.sets[setIndex].isDone
        ? <input
          required={true}
          type="number"
          min="1"
          value={exercise.sets[setIndex].reps}
          onChange={repsChange}
          className="w-[50px] md:w-[90px] h-[40px] rounded-md border-0 text-center text-2xl py-1 mx-2 bg-gray-100" />
        : <p className="min-w-[50px] md:min-w-[90px] h-[40px] text-2xl py-1 mx-2">{exercise.sets[setIndex].reps}</p>}
      {!exercise.sets[setIndex].isDone
        ? <input
          type="number"
          min="0"
          value={exercise.sets[setIndex].weight}
          onChange={weightChange}
          className="w-[50px] md:w-[90px] h-[40px] rounded-md border-0 text-center text-2xl py-1 mx-2 bg-gray-100" />
        : <p className="min-w-[50px] md:min-w-[90px] h-[40px] text-2xl py-1 mx-2">{exercise.sets[setIndex].weight}</p>
      }
      <button
        href="#"
        onClick={toggleSetDone}
        className="cursor-pointer border-0 bg-white w-[72px] mx-2"
        type="submit">
        <i className={`fa-solid fa-check fa-2x mx-4 ${exercise.sets[setIndex].isDone && 'text-amber-400'}`}></i></button>
    </form>
  );
}

function Exercise({ exer, workout, setWorkout, deleteExercise, setExerToReplace, toggleReplaceModal }) {
  const [exercise, setExercise] = useState(exer);
  const [setCount, changeSetCount] = useState(2);
  const [exerOptionsIsOpen, setExerOptionsIsOpen] = useState(false);
  const exerciseId = exer.exerciseId;

  function markAllDone() {
    const updatedSets = exercise.sets.map(s => {
      if (s.reps !== 0 && s.reps !== null) return { ...s, isDone: true };
      return s;
    });
    const updatedExercise = { ...exercise, sets: updatedSets };
    setExercise(updatedExercise);
    const updatedAllExercises = workout.exercises.map(e => {
      if (e.exerciseId === exerciseId) return updatedExercise;
      return e;
    });
    setWorkout({ ...workout, exercises: updatedAllExercises });
  }

  function addNewSet() {
    const updatedSets = exercise.sets;
    updatedSets.push({ reps: 0, setOrder: setCount, weight: 0, isDone: false });
    setExercise({ ...exercise, sets: updatedSets });
    changeSetCount(prevCount => prevCount + 1);
  }

  function openOptions() {
    setExerOptionsIsOpen(curExerOptionsIsOpen => !curExerOptionsIsOpen);
  }

  function updateWorkout() {
    const updatedExercises = workout.exercises.map(e => {
      if (e.exerciseId === exerciseId) return exercise;
      return e;
    });
    setWorkout({ ...workout, exercises: updatedExercises });
  }

  function replaceExercise() {
    setExerOptionsIsOpen(false);
    setExerToReplace({ exerciseId, name: exercise.name });
    toggleReplaceModal();
  }

  function confirmDelete() {
    const updatedWorkoutExercises = workout.exercises.filter(exercise =>
      exercise.exerciseId !== exerciseId
    );
    const finalWorkout = { ...workout, exercises: updatedWorkoutExercises };
    deleteExercise([exerciseId]);
    setWorkout(finalWorkout);
    setExerOptionsIsOpen(false);
  }

  return (
    <div className="w-[98%] min-w-[270px] max-w-[500px] rounded-md shadow-xl mb-5 mx-auto">
      <div className="relative bg-black rounded-t-md">
        <h3 className="font-semibold text-2xl text-priYellow py-2 justify-center">
          {exer.name}</h3>
        <button type="button" className="absolute right-0 bottom-0 py-3 px-4 border-0 is-large rounded-t-md has-background-black"
          onClick={openOptions}>
          <i className="fa-solid fa-ellipsis-vertical fa-xl text-priYellow" />
        </button>
        <div className={`absolute right-0 -bottom-[81px] border border-black rounded-b-md flex-col ${!exerOptionsIsOpen ? 'hidden' : 'flex'}`}>
          <button type="button"
            className='bg-white p-2 font-bold hover:bg-gray-200'
            onClick={replaceExercise}>
            Replace
          </button>
          <button type="button"
            className='p-2 text-priRed bg-white font-bold rounded-b-md hover:bg-priRed hover:text-white'
            onClick={confirmDelete}>Delete</button>
        </div>
      </div>
      <div className="px-1 pt-3 pb-0">
        <div className="mb-4 text-center flex justify-between content-start">
          <p className="mx-2 inline text-lg font-semibold">Set</p>
          <p className="mx-2 inline text-lg font-semibold">Reps</p>
          <p className="mx-2 inline text-lg font-semibold">Weight</p>
          <button
            type="button"
            onClick={markAllDone}
            className="mx-1 inline px-3 text-lg font-semibold border border-black rounded-md">Done</button>
        </div>
        {exercise.sets.map((set, index) =>
          <Set
            key={index}
            exercise={exercise}
            setExercise={setExercise}
            setIndex={index}
            setOrder={set.setOrder}
            isDone={set.isDone}
            updateWorkout={updateWorkout} />
        )}
      </div>
      <div>
        <button type="button"
          onClick={addNewSet}
          className="w-[95%] h-[35px] mx-auto my-0 text-lg my-2 mb-2 bg-gray-200 text-black rounded-md active:scale-95">Add set</button>
      </div>
    </div>
  );
}

export default function EditWorkout({ workout, setWorkout, replaceModalIsOpen, toggleReplaceModal, setExerToReplace, deleteExercise }) {

  return (
    <div className='mt-5 flex items-center justify-center flex-col'>
      {!workout
        ? <LoadingRing />
        : workout.exercises.map(exer =>
          <Exercise
            key={exer.exerciseId}
            exer={exer}
            workout={workout}
            setWorkout={setWorkout}
            deleteExercise={deleteExercise}
            setExerToReplace={setExerToReplace}
            toggleReplaceModal={toggleReplaceModal} />
        )}
    </div>
  );
}
