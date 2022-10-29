import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../lib/app-context';
import ReplaceExerciseModal from '../components/replace-exercise-modal';
import SaveWorkoutModal from '../components/save-workout-modal';
import EditWorkout from '../components/edit-workout';

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
