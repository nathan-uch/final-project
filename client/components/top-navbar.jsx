import React, { useState } from 'react';

export default function TopNavbar() {
  const [signOutIsOpen, setSignOutOpen] = useState(false);

  function toggleSignOut() {
    setSignOutOpen(curSignoutIsOpen => !curSignoutIsOpen);
  }

  return (
    <nav className="navbar px-5 is-flex is-align-items-center is-fixed-top is-flex-direction-row is-flex-wrap-nowrap
    is-justify-content-space-between has-background-black" role="navigation" aria-label="main navigation">
      <div className="navbar-start">
          <a href="#" className="navbar-item">
            <figure className="image is-48x48">
              <img className="logo-img" src="images/flame-red.png" alt="logo icon" />
            </figure>
          <h2 className="m-0 is-size-5 logo-text has-text-weight-bold">Strive</h2>
          </a>
        <div className="navbar-menu is-hidden-touch desktop-links">
          <a href="#new-workout" className="navbar-item top-links is-size-5 has-text-weight-semibold">Workouts</a>
          <a href="#user-profile" className="navbar-item top-links is-size-5 has-text-weight-semibold mx-4">Profile</a>
        </div>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">
          <button className="signout-btn" onClick={toggleSignOut}>
            <i className="fa-solid fa-arrow-right-from-bracket fa-xl"></i>
          </button>
          <button className={`pop-delete-btn button is-danger is-outlined has-background-danger-light ${!signOutIsOpen && 'hidden'}`}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
