import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../lib/app-context';
import LoadingRing from '../components/loading-ring';

function AlphabetButtons({ letter }) {

  function handleScroll() {
    const section = document.getElementById(`${letter.toLowerCase()}`);
    section.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  return (
    <a onClick={handleScroll} className="w-[35px] text-priYellow hover:text-priRed bg-black font-bold py-1 px-2 text-2xl rounded-md cursor-pointer">{letter}</a>
  );
}

function ExerciseCard({ name, selectedExercises, setSelectedExercises, clearAll, clearExercises, equipment, exerciseId, isSingleExercise }) {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (selectedExercises.length === 0) return;
    selectedExercises.forEach(exer => {
      if (exer.exerciseId === exerciseId) {
        setSelected(true);
      } else if (isSingleExercise) {
        setSelected(false);
      }
    });
  }, [selectedExercises, setSelected, exerciseId, isSingleExercise]);

  useEffect(() => {
    if (clearAll) {
      setSelected(false);
    }
  }, [clearAll]);

  function getEquipment() {
    if (equipment === null) {
      return '';
    } else {
      return ' (' + equipment + ')';
    }
  }

  function handleClick() {
    if (!isSelected && isSingleExercise) {
      clearExercises();
      setSelected(true);
      setSelectedExercises([{ exerciseId, name, equipment }]);
    } else if (!isSelected && !isSingleExercise) {
      setSelected(true);
      setSelectedExercises([...selectedExercises, { exerciseId, name, equipment }]);
    } else if (isSelected) {
      setSelected(false);
      const updatedSelectedExercises = selectedExercises.filter(exer => exer.exerciseId !== exerciseId);
      setSelectedExercises(updatedSelectedExercises);
    }
  }

  return (
    !isSelected
      ? <a
        onClick={handleClick}
        className="w-full h-[35px] border border-white bg-gray-200 rounded-md text-center p-1 cursor-pointer">
        <p className="inline font-bold">{`${name} ${getEquipment()}`}</p>
      </a>
      : <a
        onClick={handleClick}
        className="relative w-full h-[35px] bg-amber-50 text-center p-1 border border-black rounded-md cursor-pointer">
        <p className="inline font-bold">{`${name} ${getEquipment()}`}</p>
        <i className='fa-solid fa-check mr-4 fa-lg absolute top-[16px] right-[5px] text-amber-400'></i>
      </a>
  );
}

function LetterSection({ letter, allExerciseData, setSelectedExercises, selectedExercises, clearAll, clearExercises, isSingleExercise }) {
  const [filteredByLetterExer, setFilteredByLetterExer] = useState(null);

  useEffect(() => {
    if (!allExerciseData || !letter) return;
    const filtered = allExerciseData.filter(exercise =>
      exercise.name[0] === letter
    );
    setFilteredByLetterExer(filtered);
  }, [allExerciseData, letter]);

  return (
    <div className="w-full max-w-[370px] mx-auto flex flex-col justify-center items-center">
      <p
        id={`${letter.toLowerCase()}`}
        className="w-full text-priYellow py-1 my-2 text-xl bg-black font-semibold rounded-md">
        {letter}
      </p>
      <div className='w-full grid grid-cols-1 gap-1 justify-items-center'>
        {filteredByLetterExer && filteredByLetterExer.map(exer =>
          <ExerciseCard
            key={exer.exerciseId}
            exerciseId={exer.exerciseId}
            name={exer.name}
            equipment={exer.equipment}
            setSelectedExercises={setSelectedExercises}
            selectedExercises={selectedExercises}
            clearAll={clearAll}
            clearExercises={clearExercises}
            isSingleExercise={isSingleExercise} />
        )}
      </div>
    </div>
  );
}

export default function ExerciseList({ selectedExercises, setSelectedExercises, clearExercises, clearAll, isSingleExercise }) {
  const [allExerciseData, setAllExerciseData] = useState(null);
  const [letters, setLetters] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResult] = useState([]);
  const { accessToken } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/all-exercises', {
      headers: { 'X-Access-Token': accessToken }
    })
      .then(response => response.json())
      .then(result => {
        setAllExerciseData(result);
        setLoading(false);
      })
      .catch(err => console.error('ERROR:', err));
  }, [accessToken]);

  useEffect(() => {
    if (!allExerciseData) return;
    const letters = [];
    allExerciseData.forEach(exercise => {
      if (!letters.includes(exercise.name[0])) {
        letters.push(exercise.name[0]);
      }
    });
    setLetters(letters);
  }, [allExerciseData]);

  function handleSearch(e) {
    const val = e.target.value.toLowerCase();
    setSearchValue(val);
    const filteredExercises = allExerciseData.list.filter(exercise => {
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
            className="block w-[95%] md:w-[50%] mx-auto mb-6 py-2 px-4 text-xl bg-gray-200 border border-black rounded-md"
            placeholder="Search exercises..." />
          {searchValue === ''
            ? <>
              <div className="w-full min-w-[270px] gap-[0.3rem] mb-5 flex flex-wrap justify-center">
                {letters && letters.map(letter =>
                  <AlphabetButtons key={letter} letter={letter} />
                )}
              </div>
              <div className='max-w-[900px] flex flex-row flex-wrap justify-center items-center mx-auto md:items-start'>
                {letters && letters.map(letter =>
                  <LetterSection
                    key={letter}
                    letter={letter}
                    allExerciseData={allExerciseData}
                    setSelectedExercises={setSelectedExercises}
                    selectedExercises={selectedExercises}
                    clearAll={clearAll}
                    clearExercises={clearExercises}
                    isSingleExercise={isSingleExercise}
                  />
                )}
              </div>
            </>
            : <div className="md:w-[50%] flex flex-row flex-wrap mx-auto mb-3 gap-2">
              {searchResults.length !== 0 && searchResults.map(exer =>
                <ExerciseCard
                  key={exer.exerciseId}
                  exerciseId={exer.exerciseId}
                  name={exer.name}
                  equipment={exer.equipment}
                  setSelectedExercises={setSelectedExercises}
                  selectedExercises={selectedExercises}
                  clearExercises={clearExercises}
                  isSingleExercise={isSingleExercise} />
              )}
            </div>
          }
        </>
      }

    </div>
  );
}
