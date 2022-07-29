import React from 'react';

export default class Navbar extends React.Component {

  render() {
    return (
        <div className="row navbar">
          <div className="col logo-container">
            <a href="#" className="logo-anchor">
              <img className="logo-img" src="images/flame-red.png" alt="logo icon" />
              <h2 className="logo-text">Strive</h2>
            </a>
          </div>
          <div className="col">
            <a href="#">
              <i className="fa-solid fa-arrow-right-from-bracket fa-2x"></i>
            </a>
          </div>
        </div>
    );
  }
}
