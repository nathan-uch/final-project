import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';
import ReplaceExerciseModal from '../components/replace-exercise-modal';
import SaveWorkoutModal from '../components/save-workout-modal';

function Set({ setOrder, isDone, exerciseSets, setSets, setIndex, updateWorkout }) {
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  function toggleSetDone() {
    if (!reps) {
      return false;
    }
    const updatedDoneValue = exerciseSets.map((set, index) => {
      if (setIndex === index) {
        return !isDone ? { ...set, isDone: true, reps, weight } : { ...set, isDone: false };
      }
      return set;
    });
    setSets(updatedDoneValue);
  }

  function repsChange(e) {
    setReps(Math.round(e.target.value));
  }

  function weightChange(e) {
    setWeight(Math.round(e.target.value * 10) / 10);
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateWorkout();
  }

  return (
    <form onSubmit={handleSubmit}
      className="h-[45px] mb-1 text-center flex justify-between items-center content-start">
      <p className="mx-1 text-2xl min-w-[25px] font-bold">{setOrder}</p>
      {!isDone
        ? <input
            required={true}
            type="number"
            min="1"
            value={reps}
            onChange={repsChange}
            className="w-[50px] md:w-[90px] h-[40px] rounded-md border-0 text-center text-2xl py-1 mx-2 bg-gray-100" />
        : <p className="min-w-[50px] md:min-w-[90px] h-[40px] text-2xl py-1 mx-2">{reps}</p>}
      {!isDone
        ? <input
            type="number"
            min="0"
            value={weight}
            onChange={weightChange}
            className="w-[50px] md:w-[90px] h-[40px] rounded-md border-0 text-center text-2xl py-1 mx-2 bg-gray-100" />
        : <p className="min-w-[50px] md:min-w-[90px] h-[40px] text-2xl py-1 mx-2">{weight}</p>
      }
      <button
        href="#"
        className="cursor-pointer border-0 bg-white"
        onClick={toggleSetDone}
        type="submit">
        <i className={`fa-solid fa-check fa-2x mx-4 ${isDone ? 'text-amber-400' : 'mt-[0.3rem]'}`}></i></button>
    </form>
  );
}

function Exercise({ workoutId, exercise, workout, setWorkout, deleteExercise, setExerToReplace, toggleReplaceModal }) {
  const [exerciseSets, setSets] = useState([{ setOrder: 1, reps: null, weight: null, isDone: false }]);
  const [setCount, changeSetCount] = useState(1);
  const [exerOptionsIsOpen, setExerOptionsIsOpen] = useState(false);
  const exerciseId = exercise.exerciseId;

  function updateWorkout() {
    const finishedSets = exerciseSets.filter(set => set.isDone);
    const updatedExercise = exercise;
    updatedExercise.sets = finishedSets;
  }

  function addNewSet() {
    setSets([...exerciseSets, { setOrder: setCount + 1, reps: null, weight: null, isDone: false }]);
    changeSetCount(prevCount => prevCount + 1);
  }

  function openDelete() {
    setExerOptionsIsOpen(curExerOptionsIsOpen => !curExerOptionsIsOpen);
  }

  function replaceExercise() {
    setExerOptionsIsOpen(false);
    setExerToReplace({ exerciseId, name: exercise.name });
    toggleReplaceModal();
  }

  function confirmDelete() {
    const finalWorkout = { workoutId, exercises: null };
    const updatedWorkoutExercises = workout.exercises.filter(exercise =>
      exercise.exerciseId !== exerciseId ? exercise : false
    );
    finalWorkout.exercises = updatedWorkoutExercises;
    deleteExercise([exerciseId]);
    setWorkout(finalWorkout);
    setExerOptionsIsOpen(false);
  }

  return (
    <div className="w-[98%] min-w-[270px] max-w-[500px] rounded-md shadow-xl mb-5 mx-auto">
      <div className="relative bg-black rounded-t-md">
        <h3 className="font-semibold text-2xl text-priYellow py-2 justify-center">
          {exercise.name}</h3>
        <button type="button" className="absolute right-0 bottom-0 py-3 px-4 border-0 is-large rounded-t-md has-background-black"
          onClick={openDelete}>
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
          <p className="mx-2 inline text-lg font-semibold">Weight (lb)</p>
          <p className="mx-2 inline text-lg font-semibold">Done</p>
        </div>
        {exerciseSets.map((set, index) =>
          <Set
            key={index}
            setOrder={set.setOrder}
            isDone={set.isDone}
            setIndex={index}
            exerciseSets={exerciseSets}
            setSets={setSets}
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

export default function WorkoutPage() {
  const [workout, setWorkout] = useState(null);
  const [exerToReplace, setExerToReplace] = useState({ exerciseId: null, name: null });
  const [replaceModalIsOpen, setReplaceModalOpenClose] = useState(false);
  const [saveWorkoutModalIsOpen, setSaveWorkoutModalOpen] = useState(false);
  const { accessToken, curWorkout: workoutId } = useContext(AppContext);

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`, {
      headers: { 'X-Access-Token': accessToken }
    })
      .then(response => response.json())
      .then(result => {
        setWorkout(result);
      })
      .catch(err => console.error('ERROR:', err));
    return () => setWorkout(null);
  }, [workoutId, accessToken]);

  function deleteExercise(exerciseIds) {
    exerciseIds.forEach(exerciseId =>
      fetch(`/api/workout/${workoutId}/exercise/${exerciseId}`, {
        method: 'delete',
        headers: { 'X-Access-Token': accessToken }
      })
        .catch(err => console.error('ERROR:', err))
    );
  }

  function toggleReplaceModal() {
    setReplaceModalOpenClose(!replaceModalIsOpen);
    if (replaceModalIsOpen) setExerToReplace({ exerciseId: null, name: null });
  }

  function toggleSaveModal() {
    setSaveWorkoutModalOpen(!saveWorkoutModalIsOpen);
  }

  return (
    <>
      <div className='pt-[60px] pb-[70px] text-center'>
        <ReplaceExerciseModal
          exerToReplace={exerToReplace}
          replaceModalIsOpen={replaceModalIsOpen}
          setExerToReplace={setExerToReplace}
          setWorkout={setWorkout}
          toggleReplaceModal={toggleReplaceModal}
          workout={workout} />
        <SaveWorkoutModal
          saveWorkoutModalIsOpen={saveWorkoutModalIsOpen}
          setSaveWorkoutModalOpen={setSaveWorkoutModalOpen}
          toggleSaveModal={toggleSaveModal}
          workout={workout}
          deleteExercise={deleteExercise} />
        <h3 className="text-3xl font-semibold pt-4">New Workout</h3>
        <button
          type="button"
          className="primary-button h-[40px] mt-3 px-6"
          onClick={toggleSaveModal}>Save Workout</button>
        <div className='mt-5 flex items-center justify-center flex-col'>
          {!workout
            ? <LoadingRing />
            : workout.exercises.map((exercise, index) =>
              <Exercise
                key={index}
                workoutId={workoutId}
                exercise={exercise}
                workout={workout}
                setWorkout={setWorkout}
                deleteExercise={deleteExercise}
                setExerToReplace={setExerToReplace}
                toggleReplaceModal={toggleReplaceModal} />
            )}
        </div>
      </div>
    </>
  );
}
