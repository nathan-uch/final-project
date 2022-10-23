import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';

function AlphabetButtons({ letter }) {

  function handleScroll() {
    const section = document.getElementById(`${letter.toLowerCase()}`);
    section.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  return (
    <a onClick={handleScroll} className="w-[35px] text-priYellow hover:text-priRed bg-black font-bold py-1 px-2 text-xl rounded-md cursor-pointer">{letter}</a>
  );
}

function LetterSection({ letter, exercises, setSelectedExercise, selectedExercise }) {
  const [filteredExer, setFilteredExer] = useState(null);

  useEffect(() => {
    if (!exercises) return;
    const filtered = exercises.filter(exercise =>
      exercise.name[0] === letter
    );
    setFilteredExer(filtered);
  }, [exercises, letter]);

  return (
    <div className="w-full flex flex-col items-center">
      <p id={`${letter.toLowerCase()}`}
        className="w-[95%] text-priYellow py-1 my-1 mx-auto text-xl bg-black font-bold rounded-md">
        {letter}
      </p>
      {filteredExer && filteredExer.map(exer =>
        <ExerciseCard
          key={exer.exerciseId}
          exerciseId={exer.exerciseId}
          name={exer.name}
          setSelectedExercise={setSelectedExercise}
          selectedExercise={selectedExercise}
          equipment={exer.equipment} />
      )}
    </div>
  );
}

function ExerciseCard({ name, selectedExercise, setSelectedExercise, equipment, exerciseId }) {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (selectedExercise === null || selectedExercise.exerciseId !== exerciseId) {
      setSelected(false);
    } else if (selectedExercise.exerciseId === exerciseId) {
      setSelected(true);
    }
  }, [selectedExercise, setSelected, exerciseId]);

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
      setSelectedExercise({ exerciseId, name, equipment });
    } else {
      setSelected(false);
      setSelectedExercise(null);
    }
  }

  return (
    !isSelected
      ? <a
        onClick={handleClick}
        className="w-[95%] h-[40px] border-2 border-white bg-gray-200 flex-row flex-wrap text-center p-1 mx-4 my-1 rounded-md cursor-pointer">
        <p className="inline text-lg font-bold">{`${name} ${getEquipment()}`}</p>
      </a>
      : <a
        onClick={handleClick}
        className="relative w-[95%] h-[40px] bg-white flex-row flex-wrap rounded-md text-center p-1 mx-4 my-1 border-2 border-black cursor-pointer">
        <p className="inline text-lg font-bold">{`${name} ${getEquipment()}`}</p>
        <i className='fa-solid fa-check fa mr-4 fa-xl absolute top-[17px] right-[1px] text-amber-400'></i>
      </a>
  );
}

export default function ExerciseList({ selectedExercise, setSelectedExercise }) {
  const [exercises, setExercises] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResult] = useState([]);
  const [letters, setLetters] = useState(null);
  const { accessToken } = useContext(AppContext);

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

  function handleSearch(e) {
    const val = e.target.value.toLowerCase();
    setSearchResult([]);
    setSearchValue(val);
    const filteredExercises = exercises.filter(exercise => {
      return exercise.name.toLowerCase().includes(val);
    });
    setSearchResult(filteredExercises);
  }

  return (
    <div className="relative text-center pb-6 px-2">
      {isLoading
        ? <LoadingRing />
        : <>
          <input
            onChange={handleSearch}
            type="search"
            className="w-[80%] max-w-[340px] block mx-auto mb-6 py-2 px-4 text-xl bg-gray-200 border border-black rounded-md"
            placeholder="Search exercises..." />
          {searchValue === ''
            ? <>
              <div className="min-w-[270px] gap-1 mb-5 flex flex-wrap justify-center">
                {letters && letters.map(letter =>
                  <AlphabetButtons key={letter} letter={letter} />
                )}
              </div>
              <div className='md:flex-col flex-row flex-wrap justify-center'>
                {letters && letters.map(letter =>
                  <LetterSection
                    key={letter}
                    letter={letter}
                    exercises={exercises}
                    setSelectedExercise={setSelectedExercise}
                    selectedExercise={selectedExercise}
                  />
                )}
              </div>
            </>
            : <div className="md:w-[300px] mx-auto mb-3">
              {searchResults.length !== 0 && searchResults.map(exer =>
                <ExerciseCard
                  key={exer.exerciseId}
                  exerciseId={exer.exerciseId}
                  name={exer.name}
                  setSelectedExercise={setSelectedExercise}
                  selectedExercise={selectedExercise}
                  equipment={exer.equipment} />
              )}
            </div>
          }
        </>
      }

    </div>
  );
}
