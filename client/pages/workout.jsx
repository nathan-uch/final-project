import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../lib/app-context';
import ReplaceExerciseModal from '../components/replace-exercise-modal';
import SaveWorkoutModal from '../components/save-workout-modal';
import EditWorkout from '../components/edit-workout';

export default function WorkoutPage() {
  const [workout, setWorkout] = useState(null);
  const [exerToReplace, setExerToReplace] = useState({ exerciseId: null, name: null });
  const [editWorkoutNameOpen, setEditWorkoutNameOpen] = useState(false);
  const [replaceModalIsOpen, setReplaceModalOpenClose] = useState(false);
  const [saveWorkoutModalIsOpen, setSaveWorkoutModalOpen] = useState(false);
  const { accessToken, curWorkout: workoutId } = useContext(AppContext);

  useEffect(() => {
    fetch(`/api/workout/${workoutId}`, {
      headers: { 'X-Access-Token': accessToken }
    })
      .then(response => response.json())
      .then(result => {
        const updatedExer = result.exercises.map(exer => {
          exer.sets = [{ reps: 0, setOrder: 1, weight: 0, isDone: false }];
          return exer;
        });
        result.exercises = updatedExer;
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

  function handleChange(e) {
    setWorkout({ ...workout, workoutName: e.target.value });
  }

  function toggleReplaceModal() {
    setReplaceModalOpenClose(!replaceModalIsOpen);
    if (replaceModalIsOpen) setExerToReplace({ exerciseId: null, name: null });
  }

  function toggleSaveModal() {
    setSaveWorkoutModalOpen(!saveWorkoutModalIsOpen);
  }

  function toggleEditWorkoutName() {
    setEditWorkoutNameOpen(!editWorkoutNameOpen);
  }

  return (
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
      <div className="relative w-[65%] max-w-[340px] min-w-[160px] h-[52px] my-4 mx-auto">
        {editWorkoutNameOpen
          ? <>
              <input onChange={handleChange} type="text" className="text-3xl w-full bg-gray-200 py-2 px-2 rounded-md text-center" value={`${workout && workout.workoutName}`} maxLength={20} />
              <a className="absolute -right-[13%] top-[13px] cursor-pointer" onClick={toggleEditWorkoutName}><i className="fa-solid fa-circle-check fa-xl"></i></a>
            </>
          : <>
              <h3 className="w-full absolute top-[50%] -translate-y-1/2 text-3xl py-2 px-1 font-semibold text-center truncate">{workout ? workout.workoutName : 'Workout'}</h3>
              <a onClick={toggleEditWorkoutName} className="absolute -right-[13%] top-[50%] -translate-y-1/2 cursor-pointer"><i className="fa-solid fa-pen-to-square fa-xl"></i></a>
            </>
        }
      </div>
      <button
        type="button"
        className="primary-button h-[40px] mt-3 px-6"
        onClick={toggleSaveModal}>Save Workout</button>
      <EditWorkout
        workout={workout}
        setWorkout={setWorkout}
        replaceModalIsOpen={replaceModalIsOpen}
        toggleReplaceModal={toggleReplaceModal}
        setExerToReplace={setExerToReplace}
        deleteExercise={deleteExercise} />
    </div>
  );
}
