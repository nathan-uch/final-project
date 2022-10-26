import React, { useState, useEffect } from 'react';
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

function ExerciseCard({ name, selectedExercises, setSelectedExercises, clearAll, equipment, exerciseId }) {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (selectedExercises.length === 0) return;
    selectedExercises.forEach(exer => {
      if (exer.exerciseId === exerciseId) setSelected(true);
    });
  }, [selectedExercises, setSelected, exerciseId]);

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
      setSelectedExercises([...selectedExercises, { exerciseId, name, equipment }]);
    } else {
      setSelected(false);
      const updatedSelected = selectedExercises.filter(exer => exer.exerciseId !== exerciseId);
      setSelectedExercises(updatedSelected);
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

function LetterSection({ letter, allExerciseData, setSelectedExercises, selectedExercises, clearAll }) {
  const [filteredByLetterExer, setFilteredByLetterExer] = useState(null);

  useEffect(() => {
    if (!allExerciseData.list) return;
    const filtered = allExerciseData.list.filter(exercise =>
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
            setSelectedExercises={setSelectedExercises}
            selectedExercises={selectedExercises}
            clearAll={clearAll}
            equipment={exer.equipment} />
        )}
      </div>
    </div>
  );
}

export default function ExerciseList({ allExerciseData, selectedExercises, setSelectedExercises, isLoading, setLoading, clearAll }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResult] = useState([]);

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
                {allExerciseData.letters && allExerciseData.letters.map(letter =>
                  <AlphabetButtons key={letter} letter={letter} />
                )}
              </div>
              <div className='max-w-[900px] flex flex-row flex-wrap justify-center items-center mx-auto md:items-start'>
                {allExerciseData.letters && allExerciseData.letters.map(letter =>
                  <LetterSection
                    key={letter}
                    letter={letter}
                    allExerciseData={allExerciseData}
                    setSelectedExercises={setSelectedExercises}
                    selectedExercises={selectedExercises}
                    clearAll={clearAll}
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
                  setSelectedExercises={setSelectedExercises}
                  selectedExercises={selectedExercises}
                  equipment={exer.equipment} />
              )}
            </div>
          }
        </>
      }

    </div>
  );
}
