import React, { useState, useEffect } from 'react';

function ExerciseCard({ name, allSelected, setAllSelected }) {
  const [isSelected, setSelected] = useState(false);

  function handleClick() {
    !isSelected ? setSelected(true) : setSelected(false);
    setAllSelected({ ...allSelected, name });
  }

  return (
    !isSelected
      ? <a onClick={handleClick} className="exercise-card has-background-grey-lighter column is-size-5-mobile mx-5 is-two-fifths is-flex-direction-row is-flex-wrap-wrap exercise-card box has-text-centered">
        <p className="title is-size-4">{name}</p>
    </a>
      : <a onClick={handleClick} className="selected-exercise-card has-background-white column is-size-5-mobile mx-5 is-two-fifths is-flex-direction-row is-flex-wrap-wrap exercise-card box  has-text-centered">
        <p className="title is-inline is-size-4">{name}</p>
      <i className='fa-solid fa-check fa-2x mr-4'></i>
    </a>
  );
}

export default function Exercises(props) {
  const [exercises, setExercises] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [allSelected, setAllSelected] = useState({});

  useEffect(() => {
    fetch('/api/all-exercises')
      .then(response => response.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <div className="body-container has-text-centered">
      <a href="#"><i className='fa-solid fa-arrow-left fa-2x mx-5'></i></a>
      <h3 className="is-inline-block is-size-3-mobile is-size-2 mx-auto mb-6">Add Exercise</h3>
      <div className='columns is-flex-wrap-wrap exercise-container is-justify-content-center'>
          {isLoading
            ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            : exercises.map(exercise =>
              <ExerciseCard key={exercise.name} name={exercise.name} setAllSelected={setAllSelected} allSelected={allSelected} />
            )}
        </div>
    </div>
  );
}
