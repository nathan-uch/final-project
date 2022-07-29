import React from 'react';

export default class BotNavbar extends React.Component {

  render() {
    return (
      <nav className="navbar px-5 is-flex is-align-items-center is-fixed-bottom is-flex-direction-row is-flex-wrap-nowrap
      is-justify-content-space-around has-background-black" role="navigation" aria-label="main navigation">
        <div className="navbar-menu is-active p-0">
          <a href="#" className="navbar-item p-0">
            <figure className="image navbar-icon">
              <img src="images/db-yellow.png" className="bot-navbar-icon" />
            </figure>
          </a>
        </div>
      </nav>
    );
  }
}
