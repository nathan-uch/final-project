import React from 'react';

export default class BotNavbar extends React.Component {

  render() {
    return (
      <nav className="navbar is-hidden-desktop px-5 is-fixed-bottom has-background-black" role="navigation" aria-label="main navigation">
        <div className="navbar-menu is-active is-flex is-align-items-center is-flex-direction-row is-flex-wrap-nowrap is-justify-content-space-around p-0">
          <a href="#user-profile" className="navbar-item p-0">
            <figure className="image navbar-icon">
              <img src="images/user-icon.png" className="bot-navbar-icon my-2 nav-user-icon" />
            </figure>
          </a>
          <a href="#new-workout" className="navbar-item p-0">
            <figure className="image navbar-icon">
              <img src="images/db-yellow.png" className="bot-navbar-icon my-2" />
            </figure>
          </a>
        </div>
      </nav>
    );
  }
}
