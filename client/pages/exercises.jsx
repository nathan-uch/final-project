import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';

function AlphabetButtons({ letter }) {

  function handleScroll() {
    const section = document.getElementById(`${letter.toLowerCase()}`);
    section.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  return (
    <a onClick={handleScroll} className="w-[35px] text-priYellow hover:text-priRed rounded-md bg-black font-bold text-2xl py-1 px-2">{letter}</a>
  );
}

function LetterSection({ letter, exercises, setAllSelected, allSelected, clearAll }) {
  const [filteredExer, setFilteredExer] = useState(null);

  useEffect(() => {
    if (!exercises) return;
    const filtered = exercises.filter(exercise =>
      exercise.name[0] === letter
    );
    setFilteredExer(filtered);
  }, [exercises, letter]);

  return (
    <div className="w-full md:w-[40%] max-w-[900px] flex flex-col flex-nowrap items-center md:gap-x-4 ">
      <p id={`${letter.toLowerCase()}`}
        className="w-full text-priYellow rounded-md scroll-mt-[65px] text-xl bg-black font-semibold py-1 mx-4 my-2">
        {letter}
      </p>
      <div className='w-full grid grid-cols-1 gap-2 justify-items-center'>
        {filteredExer && filteredExer.map(exer =>
          <ExerciseCard
            key={exer.exerciseId}
            exerciseId={exer.exerciseId}
            name={exer.name}
            setAllSelected={setAllSelected}
            allSelected={allSelected}
            clearAll={clearAll}
            equipment={exer.equipment} />
        )}
      </div>
    </div>
  );
}

function ExerciseCard({ name, allSelected, setAllSelected, clearAll, equipment, exerciseId }) {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (allSelected.length === 0) return;
    allSelected.forEach(exer => {
      if (exer.exerciseId === exerciseId) setSelected(true);
    });
  });

  useEffect(() => {
    if (clearAll) setSelected(false);
  }, [clearAll]);

  function getEquipment() {
    if (equipment === null) {
      return '';
    } else {
      return ' (' + equipment + ')';
    }
  }

  function handleClick() {
    if (!isSelected) {
      setSelected(true);
      setAllSelected([...allSelected, { name, exerciseId }]);
    } else {
      setSelected(false);
      const updatedSelected = allSelected.filter(exer => exer.exerciseId !== exerciseId);
      setAllSelected(updatedSelected);
    }
  }

  return (
    !isSelected
      ? <a
        onClick={handleClick}
        className="w-full max-h-[35px] border border-white  bg-gray-200 rounded-md text-center p-1 cursor-pointer">
        <p className="inline font-bold">{`${name} ${getEquipment()}`}</p>
    </a>
      : <a
          onClick={handleClick}
        className="relative w-full max-h-[35px] border border-black bg-amber-50 rounded-md text-center p-1 cursor-pointer">
        <p className="inline font-bold">{`${name} ${getEquipment()}`}</p>
        <i className='fa-solid fa-check fa mr-4 fa-lg absolute top-[16px] right-[5px] text-amber-400'></i>
    </a>
  );
}

export default function Exercises(props) {
  const [exercises, setExercises] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResult] = useState([]);
  const [letters, setLetters] = useState(null);
  const [allSelected, setAllSelected] = useState([]);
  const [clearAll, setClearAll] = useState(false);
  const [expandExercisesDisplay, setDisplay] = useState(true);
  const { accessToken, user, curWorkout: workoutId } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/all-exercises', {
      headers: { 'X-Access-Token': accessToken }
    })
      .then(response => response.json())
      .then(result => {
        setExercises(result);
        setLoading(false);
      })
      .catch(err => console.error('ERROR:', err));
  }, [accessToken]);

  useEffect(() => {
    const letters = [];
    if (!exercises) return;
    exercises.forEach(exercise => {
      if (!letters.includes(exercise.name[0])) {
        letters.push(exercise.name[0]);
      }
    });
    setLetters(letters);
  }, [exercises]);

  useEffect(() => {
    setClearAll(false);
  }, [clearAll]);

  function handleSaveExercises(e) {
    e.preventDefault();
    const savedExercises = [];
    allSelected.forEach(exer => {
      for (let e = 0; e < exercises.length; e++) {
        if (exer.exerciseId === exercises[e].exerciseId) {
          savedExercises.push(exercises[e].exerciseId);
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

  function handleSearch(e) {
    const val = e.target.value.toLowerCase();
    setSearchResult([]);
    setSearchValue(val);
    const filteredExercises = exercises.filter(exercise => {
      return exercise.name.toLowerCase().includes(val);
    });
    setSearchResult(filteredExercises);
  }

  function clearExercises() {
    setClearAll(true);
    setAllSelected([]);
  }

  function toggleExerciseDisplay() {
    expandExercisesDisplay ? setDisplay(false) : setDisplay(true);
  }

  function scrollToTop() {
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="pb-[150px] pt-[80px] text-center mx-4">
      <h3 className="block text-3xl md:text-4xl mx-auto mb-5">Add Exercises</h3>
      {isLoading
        ? <LoadingRing />
        : <>
            <input
              onChange={handleSearch}
              type="search"
              className="w-[95%] md:w-[50%] bg-gray-100 border border-black rounded-md block mx-auto mb-6 py-2 px-4 text-2xl"
              placeholder="Search exercises..."
            />
            {searchValue === ''
              ? <>
                  <div className="w-full min-w-[270px] h-auto gap-[0.3rem] mb-5 flex flex-wrap justify-center">
                    {letters && letters.map(letter =>
                      <AlphabetButtons key={letter} letter={letter} />
                    )}
                  </div>
                  <div className='max-w-[900px] flex flex-row flex-wrap justify-center items-center mx-auto md:items-start md:gap-x-4'>
                    {letters && letters.map(letter =>
                      <LetterSection
                        key={letter}
                        letter={letter}
                        exercises={exercises}
                        setAllSelected={setAllSelected}
                        allSelected={allSelected}
                        clearAll={clearAll}
                      />
                    )}
                  </div>
                </>
              : <div className="md:w-[50%] mx-auto mb-3 flex flex-row flex-wrap gap-2">
                  {searchResults.length !== 0 && searchResults.map(exer =>
                    <ExerciseCard
                      key={exer.exerciseId}
                      exerciseId={exer.exerciseId}
                      name={exer.name}
                      setAllSelected={setAllSelected}
                      allSelected={allSelected}
                      clearAll={clearAll}
                      equipment={exer.equipment} />
                  )}
                </div>
            }
          </>
        }
        <>
          <a onClick={scrollToTop} className={`fixed h-[50px] right-[1%] bottom-[10%] md:bottom-[1%] text-priYellow hover:text-priRed border border-2 border-white rounded-md bg-black py-2 px-3 ${allSelected.length !== 0 && 'bottom-[145px] md:right-[31%]'}`}>
            <i className="fa-solid fa-arrow-up fa-2x"></i>
          </a>
          {allSelected.length !== 0 &&
            <>
              <form
                onSubmit={handleSaveExercises}
                className="fixed w-full bottom-[61px] left-0 min-h-[45px] md:hidden flex items-center flex-col flex-nowrap justify-evenly bg-gray-200 border-t-4 border-white">
                <p className="w-full mb-1 text-lg">Total Exercises: {allSelected.length}</p>
                <div className='w-full'>
                  <button
                    type="submit"
                    className='primary-button w-[45%] h-[35px] text-xl mb-3 shadow-xl mx-2'>
                    Add all
                  </button>
                  <button
                    onClick={clearExercises}
                    type="button"
                    className=' w-[45%] h-[35px] bg-white text-xl mb-3 rounded-md shadow-xl active:scale-95 mx-2'>
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
                  className={`flex flex-col justify-evenly flex-wrap border border-black ${!expandExercisesDisplay && 'collapse'}`}>
                  <p className="my-2 underline">Total Exercises: {allSelected.length}</p>
                  <ul className="max-h-[100px] is-size-6 overflow-y-scroll">
                    {allSelected.map((exer, index) => <li key={index}>{exer.name}</li>)}
                  </ul>
                  <div className='h-[60px]'>
                    <button type="submit"
                      className='primary-button w-[40%] h-[40px] shadow-xl m-2 text-xl'>
                      Add all
                    </button>
                    <button
                      onClick={clearExercises}
                      type="button"
                      className='w-[40%] h-[40px] shadow-xl text-xl bg-white hover:bg-gray-200 m-2 border border-gray-300 rounded-md'>
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </>
          }
        </>
    </div>
  );
}
