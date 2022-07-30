import React, { useState, useEffect } from 'react';

function ExerciseCard({ name }) {

  return (
    <a className="column is-size-5-mobile mx-5 is-two-fifths is-flex-direction-row is-flex-wrap-wrap exercise-card box has-background-grey-lighter has-text-centered">
        <p className="title">{name}</p>
    </a>
  );
}

export default function Exercises(props) {
  const [exercises, setExercises] = useState(null);
  const [isLoading, setLoading] = useState(true);

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
              <ExerciseCard key={exercise.name} name={exercise.name} />
            )}
        </div>
    </div>
  );
}
