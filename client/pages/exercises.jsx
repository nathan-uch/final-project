import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../lib/app-context';
import ExerciseList from '../components/exercise-list';

export default function Exercises(props) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [expandExercisesDisplay, setDisplay] = useState(true);
  const [clearAll, setClearAll] = useState(false);
  const { accessToken, user, curWorkout: workoutId } = useContext(AppContext);

  useEffect(() => {
    setClearAll(false);
  }, [clearAll]);

  function handleSaveExercises(e) {
    e.preventDefault();
    const savedExercises = [];
    selectedExercises.forEach(exer => {
      for (let e = 0; e < selectedExercises.length; e++) {
        if (exer.exerciseId === selectedExercises[e].exerciseId) {
          savedExercises.push(selectedExercises[e].exerciseId);
        }
      }
    });
    const body = { workoutId, exerciseIds: savedExercises, userId: user.userId };
    fetch('/api/workout/new-exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': accessToken
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(result => {
        clearExercises();
        window.location.hash = 'workout';
      })
      .catch(err => console.error('ERROR:', err));
  }

  function toggleExerciseDisplay() {
    expandExercisesDisplay ? setDisplay(false) : setDisplay(true);
  }

  function clearExercises() {
    setClearAll(true);
    setSelectedExercises([]);
  }

  function scrollToTop() {
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="pb-[150px] pt-[80px] text-center mx-4">
      <h3 className="block text-3xl md:text-4xl mx-auto mb-5">Add Exercises</h3>
        <ExerciseList
            selectedExercises={selectedExercises}
            setSelectedExercises={setSelectedExercises}
            clearAll={clearAll}
            isSingleExercise={false} />
          <a onClick={scrollToTop} className={`fixed h-[50px] right-[1%] bottom-[10%] md:bottom-[1%] text-priYellow hover:text-priRed border border-2 border-white rounded-md bg-black py-2 px-3 cursor-pointer ${selectedExercises.length !== 0 && 'bottom-[145px] md:right-[31%]'}`}>
            <i className="fa-solid fa-arrow-up fa-2x"></i>
          </a>
          {selectedExercises.length !== 0 &&
            <>
              <form
                onSubmit={handleSaveExercises}
                className="fixed w-full bottom-[61px] left-0 min-h-[45px] md:hidden flex items-center flex-col flex-nowrap justify-evenly bg-gray-200 border-t-4 border-white">
            <p className="w-full mb-1 text-lg">Total Exercises: {selectedExercises.length}</p>
                <div className='w-full'>
                  <button
                    type="submit"
                    className='primary-button w-[45%] h-[35px] text-lg mb-3 shadow-xl mx-2'>
                    Add all
                  </button>
                  <button
                    onClick={clearExercises}
                    type="button"
                    className=' w-[45%] h-[35px] bg-white text-lg mb-3 rounded-md shadow-xl active:scale-95 mx-2'>
                    Clear
                  </button>
                </div>
              </form>
              <div
                className='w-full max-w-[30%] max-h-[250px] fixed bottom-0 right-0 hidden md:block bg-white rounded-t-md'>
                <button
                  onClick={toggleExerciseDisplay}
                className='w-full border-0 rounded-t-md text-priYellow text-xl px-2 py-3 bg-black'>
                  Selected Exercises
                  <i className={`float-right mr-2 mt-1 fa-solid ${expandExercisesDisplay ? 'fa-chevron-left' : 'fa-chevron-down'}`}></i>
                </button>
                <form
                  onSubmit={handleSaveExercises}
              className={`flex flex-col justify-evenly flex-nowrap border border-black overflow-hidden ease-in duration-200 ${!expandExercisesDisplay ? 'max-h-0' : 'max-h-[225px]'}`}>
              <p className="my-2 underline">Total Exercises: {selectedExercises.length}</p>
                  <ul className="max-h-[100px] is-size-6 overflow-y-scroll">
                    {selectedExercises.map((exer, index) => <li key={index}>{exer.name}</li>)}
                  </ul>
                  <div className='h-[60px]'>
                    <button type="submit"
                      className='primary-button w-[40%] h-[40px] shadow-xl m-2 text-lg'>
                      Add all
                    </button>
                    <button
                      onClick={clearExercises}
                      type="button"
                      className='w-[40%] h-[40px] shadow-xl text-lg bg-white hover:bg-gray-200 m-2 border border-gray-300 rounded-md'>
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </>
          }
    </div>
  );
}
