import React, { useState, useEffect } from 'react';
import LoadingRing from '../components/loading-ring';

function AuthForm({ existingUsernames }) {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  });
  const [displayMessage, setDisplayMessage] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { username } = userInfo;
    if (existingUsernames.includes(username)) setDisplayMessage('error');
  }

  function showDisplayMessage() {
    if (displayMessage === 'error') return <p className='auth-error-message my-5 py-3 px-3 has-text-weight-bold has-background-danger-light'><i className="fa-solid fa-xmark fa-lg mr-3"></i>This username already exists.</p>;
    if (displayMessage === 'success') return <p className='auth-success-message my-5 has-text-weight-bold has-background-success-light'><i className="fa-solid fa-check fa-lg mr-3"></i>Account created! You are ready to STRVE!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="my-3 auth-form mx-auto is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <label
        htmlFor="username"
        className="is-size-5 auth-label mr-auto ml-2">Username</label>
      <input
        onChange={handleChange}
        required={true}
        minLength={6}
        maxLength={12}
        type="text"
        name="username"
        className="py-2 px-3 mb-4 is-size-5"
        id="username" />
      <label
        htmlFor="password"
        className="is-size-5 auth-label mr-auto ml-2">Password</label>
      <input
        onChange={handleChange}
        required={true}
        minLength={8}
        maxLength={16}
        type="password"
        name="password"
        className="py-2 px-3 mb-4 is-size-5"
        id="password" />
      <button
        type="submit"
        className="mt-3 py-3 px-4 primary-button is-size-5">Sign Up
      </button>
      {displayMessage && showDisplayMessage()}
    </form>
  );
}

export default function AuthPage() {
  const [existingUsernames, setExistingUsernames] = useState(null);

  useEffect(() => {
    fetch('/api/all-usernames')
      .then(response => response.json())
      .then(data => {
        setExistingUsernames(data);
      })
      .catch(err => console.error('ERROR:', err));
  }, []);

  return (
    <div className="auth-body has-background-black has-text-centered is-flex is-flex-direction-column is-align-items-center">
      <div className="is-relative auth-logo mx-auto">
        <figure className="is-absolute auth-logo-img image is-64x64">
          <img className="" src="images/flame-red.png" alt="logo icon" />
        </figure>
        <h1 className="auth-logo-text">Strive</h1>
      </div>
      <h3 className="is-size-3 my-5">Sign Up</h3>
      {existingUsernames
        ? <AuthForm existingUsernames={existingUsernames} />
        : <LoadingRing />
      }
    </div>
  );
}
