import React, { useState, useContext, useRef } from 'react';
import AppContext from '../lib/app-context';
import ExerciseList from '../components/exercise-list';

export default function ReplaceExerciseModal({ replaceModalIsOpen, toggleReplaceModal, exerToReplace, setExerToReplace, setWorkout, workout }) {
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
              className={`md:bottom-[120px] right-[5px] md:right-[10%] border border-white h-[50px] fixed text-priYellow active:text-priRed hover:text-priRed rounded-md bg-black py-2 px-3 cursor-pointer ${selectedExercise ? 'bottom-[140px]' : 'bottom-[65px]'}`}>
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
