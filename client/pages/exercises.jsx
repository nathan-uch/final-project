import React, { useState, useEffect } from 'react';

function ExerciseCard({ name, allSelected, setAllSelected, clearAll }) {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    if (clearAll) setSelected(false);
  }, [clearAll]);

  function handleClick() {
    if (!isSelected) {
      setSelected(true);
      setAllSelected([...allSelected, name]);
    } else {
      setSelected(false);
      const updatedSelected = allSelected.filter(exer => exer !== name);
      setAllSelected(updatedSelected);
    }
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
  const [allSelected, setAllSelected] = useState([]);
  const [clearAll, setClearAll] = useState(false);
  const [expandExercisesDisplay, setDisplay] = useState(true);

  useEffect(() => {
    fetch('/api/all-exercises')
      .then(response => response.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      })
      .catch(err => console.error('ERROR:', err));
  }, []);

  useEffect(() => {
    setClearAll(false);
  }, [clearAll]);

  function handleSaveExercises(e) {
    e.preventDefault();
  }

  function clearExercises() {
    setClearAll(true);
    setAllSelected([]);
  }

  function toggleExerciseDisplay() {
    expandExercisesDisplay ? setDisplay(false) : setDisplay(true);
  }

  return (
    <>
      <div className="body-container has-text-centered">
        <a href="#"><i className='fa-solid fa-arrow-left fa-2x mx-5'></i></a>
        <h3 className="is-inline-block is-size-3-mobile is-size-2 mx-auto mb-6">Add Exercise</h3>
        <div className='columns is-flex-wrap-wrap exercise-container is-justify-content-center'>
            {isLoading
              ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              : exercises.map(exercise =>
                <ExerciseCard key={exercise.name} name={exercise.name} setAllSelected={setAllSelected} allSelected={allSelected} clearAll={clearAll} />
              )}
        </div>
      </div>
      {allSelected.length !== 0
        ? <>
            <form className="add-clear-exercises-mobile message is-hidden-desktop is-flex is-align-items-center is-flex-direction-row is-flex-wrap-nowrap
            is-justify-content-space-evenly has-background-grey-lighter">
              <button onClick={handleSaveExercises} type="submit" className='add-exercises-btn button is-size-4 my-3'>Add all</button>
              <button onClick={clearExercises} type="button" className='clear-btn button is-white is-size-4 my-3'>Clear</button>
            </form>
            <div className='exercises-container-desktop is-two-fifths is-hidden-touch has-background-white'>
              <button onClick={toggleExerciseDisplay} className='toggle-show-exercises-desktop is-size-4 p-3'>Selected Exercises<i className={`mx-2 fa-solid ${expandExercisesDisplay ? 'fa-chevron-left' : 'fa-chevron-down'}`}></i></button>
              <form className={`exercise-form-desktop is-flex is-flex-direction-row is-justify-content-space-evenly is-flex-wrap-wrap ${expandExercisesDisplay ? '' : 'collapse'}`}>
                <p className="my-2">Total Exercises: {allSelected.length}</p>
                <ul className="exercise-list m-4 is-size-4">{allSelected.map(exer => <li key={exer}>{exer}</li>)}</ul>
                <button onClick={handleSaveExercises} type="submit" className='add-exercises-btn button m-2 is-size-5'>Add all</button>
                <button onClick={clearExercises} type="button" className='clear-btn button is-white m-2 is-size-5'>Clear</button>
              </form>
            </div>
          </>
        : ''
      }
    </>
  );
}
