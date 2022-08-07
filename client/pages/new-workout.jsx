import React from 'react';

export default function NewWorkout() {

  function handleSubmit(e) {
    e.preventDefault();
    window.location.hash = 'exercise-list';
  }

  return (
    <form onSubmit={handleSubmit} className='body-container has-text-centered'>
      <h3 className="is-size-3 mb-4">Quick Start</h3>
      <button type="submit" className="button">Begin a new Workout</button>
    </form>
  );
}
