import React, { useState, useEffect } from 'react';

function ExerciseCard({ name }) {

  return (
    <div className="box has-background-grey-lighter">
        <p className="title">{name}</p>
    </div>
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
    <div className="body-container">
      <h3>Add Exercise</h3>
        <div>
          {isLoading
            ? <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            : exercises.map(exercise =>
              <ExerciseCard key={exercise.name} name={exercise.name} />
            )}
        </div>
    </div>
  );
}
