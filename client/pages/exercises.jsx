import React, { useState, useEffect } from 'react';

function ExerciseCard(props) {

  return (
    <div>
      <p className="has-background-light">{}</p>
    </div>
  );
}

export default function Exercises(props) {
  const [exercises, setExercises] = useState(null);

  useEffect(() => {
    fetch('/api/all-exercises')
      .then(response => response.json())
      .then(data => {
        setExercises(data);
      })
      .catch(err => console.error('ERROR:', err));
  });

  return (
    <div className="body-container">
      <h3>Add Exercise</h3>
        <div>
          {exercises.map(exercise =>
            <ExerciseCard key={exercise.name} />
          )}
        </div>
    </div>
  );
}
