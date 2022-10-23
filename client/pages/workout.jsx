import React, { useState, useEffect, useContext, useRef } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';
import ExerciseList from '../components/exercise-list';

function SaveWorkoutModal({ saveWorkoutModalIsOpen, setSaveWorkoutModalOpen, toggleSaveModal, saveWorkout }) {

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

function ReplaceExerciseModal({ replaceModalIsOpen, toggleReplaceModal, exerToReplace, setExerToReplace, setWorkout, workout }) {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { accessToken, user, curWorkout: workoutId } = useContext(AppContext);
  const modalRef = useRef();

  function handleReplaceExercise(e) {
    e.preventDefault();

    const body = {
      userId: user.userId,
      newExerciseId: selectedExercise.exerciseId
    };
    fetch(`/api/workout/${workoutId}/exercise/${exerToReplace.exerciseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      },
      body: JSON.stringify(body)
    })
      .then(result => {
        const updatedWorkout = workout.exercises.map(exer => {
          if (exer.exerciseId === exerToReplace.exerciseId) {
            if (!selectedExercise.equipment) selectedExercise.equipment = null;
            return {
              ...exer,
              exerciseId: selectedExercise.exerciseId,
              name: selectedExercise.name,
              equipment: selectedExercise.equipment
            };
          } else {
            return exer;
          }
        });
        setWorkout({
          ...workout,
          exercises: updatedWorkout
        });
        setExerToReplace({ exerciseId: null, name: null });
        setSelectedExercise(null);
        toggleReplaceModal();
      })
      .catch(err => console.error('ERROR:', err));
  }

  function scrollToTop() {
    modalRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  return (
    <>
      {replaceModalIsOpen &&
        <div
          className={`z-10 h-screen w-full ${replaceModalIsOpen ? 'fixed' : 'hidden'}`} >
          <div
            className="absolute w-full h-full bg-modalGrey"
            onClick={toggleReplaceModal} />
          <div ref={modalRef} className={`relative h-[85%] max-h-[1000px] w-[97%] max-w-[800px] pt-4 mt-4 mx-auto md:mt-6 bg-white rounded-md overflow-x-hidden overflow-y-scroll ${selectedExercise ? 'pb-[5rem]' : 'pb-[2rem]'}`}>
            <div className='text-2xl font-bold mb-2'>
              <p className='block mb-0 text-2xl'>Replace</p>
              <p className='text-2xl'>{exerToReplace.name}</p>
            </div>
            <ExerciseList
              selectedExercise={selectedExercise}
              setSelectedExercise={setSelectedExercise}
            />
            <a
              onClick={scrollToTop}
              className={`md:bottom-[120px] right-[5px] md:right-[10%] border border-white h-[50px] fixed text-priYellow active:text-priRed hover:text-priRed rounded-md bg-black py-2 px-3 ${selectedExercise ? 'bottom-[140px]' : 'bottom-[65px]'}`}>
              <i className="fa-solid fa-arrow-up fa-2x"></i>
            </a>
            {selectedExercise &&
              <form
                onSubmit={handleReplaceExercise}
                className="fixed w-full max-w-[800px] bottom-[50px] md:left-0 md:right-0 md:bottom-0 md:mx-auto left-0 flex items-center flex-col flex-nowrap justify-evenly bg-gray-200 border-t-2 border-white">
                <p className="font-bold text-xl mt-1 md:py-2">{selectedExercise.name}</p>
                <div className='w-full pb-4 flex flex-row justify-evenly'>
                  <button
                    type="submit"
                    className='primary-button w-[45%] max-w-[200px] h-[35px] text-base shadow-xl'>
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExercise(null);
                      toggleReplaceModal();
                    }}
                    className='relative w-[40%] max-w-[200px] h-[35px] is-white bg-white rounded-md text-base shadow-xl' >
                    Cancel</button>
                </div>
              </form>
            }
          </div>
        </div>
      }
    </>
  );
}

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

  function saveWorkout(e) {
    e.preventDefault();
    toggleSaveModal();
    const finalWorkout = workout;
    const deleteExercises = [];
    const finalExercises = [];
    for (let i = 0; i < workout.exercises.length; i++) {
      if (workout.exercises[i].sets.length === 1 && !workout.exercises[i].sets[0].isDone) {
        deleteExercises.push(workout.exercises[i].exerciseId);
      } else {
        finalExercises.push(workout.exercises[i]);
      }
    }

    finalExercises.forEach(exercise => {
      exercise.sets.forEach((set, index) => {
        set.setOrder = index + 1;
      });
    });

    finalWorkout.exercises = finalExercises;
    deleteExercise(deleteExercises);

    fetch(`/api/workout/${workout.workoutId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      },
      body: JSON.stringify(finalWorkout)
    })
      .catch(err => console.error('ERROR:', err));

    fetch(`/api/workout/${workout.workoutId}/completed-time`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      }
    })
      .then(result => { window.location.hash = 'user-profile'; })
      .catch(err => console.error('ERROR:', err));
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
          saveWorkout={saveWorkout} />
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
