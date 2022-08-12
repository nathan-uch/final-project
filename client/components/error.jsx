import React from 'react';

export default function ErrorPage() {

  return (
    <div className="columns body-container has-text-centered">
      <div className="column is-11 is-offset-1">
        <h3 className="is-size-4">Unexpected Error:</h3>
        <p className="my-5">Sorry! Something went wrong.</p>
        <a href="#user-profile" className="is-underlined">Go Back</a>
      </div>
    </div>
  );
}
