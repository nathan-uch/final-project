import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';

function AlphabetButtons({ letter }) {

  function handleScroll() {
    const section = document.getElementById(`${letter.toLowerCase()}`);
    section.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  return (
    <a onClick={handleScroll} className="letter-anchors has-background-black has-text-weight-bold py-1 px-2 is-size-5">{letter}</a>
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
    <div className="letter-container is-flex is-flex-direction-column is-align-items-center">
      <p id={`${letter.toLowerCase()}`}
        className="letter-title py-1 my-1 mx-4 is-size-5 has-background-black has-text-weight-bold">
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
        className="exercise-card box has-background-grey-lighter column is-flex-direction-row is-flex-wrap-wrap has-text-centered p-1 mx-4 my-1">
        <p className="title is-inline is-size-6">{`${name} ${getEquipment()}`}</p>
      </a>
      : <a
        onClick={handleClick}
        className="selected-exercise-card exercise-card box has-background-white column is-flex-direction-row is-flex-wrap-wrap has-text-centered p-1 mx-4 my-1">
        <p className="title is-inline is-size-6">{`${name} ${getEquipment()}`}</p>
        <i className='fa-solid fa-check fa mr-4 selected-check'></i>
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
    <div className="is-relative has-text-centered pb-6 px-2">
      {isLoading
        ? <LoadingRing />
        : <>
          <input
            onChange={handleSearch}
            type="search"
            className="exercise-searchbox is-block mx-auto mb-6 py-2 px-4 is-size-5"
            placeholder="Search exercises" />
          {searchValue === ''
            ? <>
              <div className="alphabet-container mb-5 columns is-flex is-flex-wrap-wrap is-justify-content-center">
                {letters && letters.map(letter =>
                  <AlphabetButtons key={letter} letter={letter} />
                )}
              </div>
              <div className='exercise-container columns is-flex-direction-row is-flex-wrap-wrap is-justify-content-center'>
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
            : <div className="search-results-container mx-auto mb-3">
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
