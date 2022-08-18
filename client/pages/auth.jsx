import React, { useState, useEffect, useContext } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

function AuthForm({ existingUsernames, path }) {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  });
  const [action, setAction] = useState({
    type: null,
    message: null
  });
  const { handleSignIn, curRoute, user } = useContext(AppContext);

  useEffect(() => {
    setAction({
      message: null,
      type: path
    });
  }, [path]);

  if (curRoute.path === '' && !user) return <Redirect to='sign-in' />;

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const authForm = document.querySelector('.auth-form');
    authForm.reset();
    const { username } = userInfo;
    if (action.type === 'sign-up') {
      if (existingUsernames.includes(username)) setAction({ ...action, message: 'error' });
      fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
      })
        .then(response => response.json())
        .then(result => {
          setAction({ ...action, message: 'success' });
          window.location.hash = 'sign-in';
        })
        .catch(err => console.error('ERROR:', err));
    } else if (action.type === 'sign-in') {
      fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
      })
        .then(response => response.json())
        .then(result => {
          if (!result.user || !result.token) {
            setAction({ ...action, message: 'error' });
          } else if (result.user && result.token) {
            handleSignIn(result);
          }
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    }
  }

  function displayAlternative() {
    if (action.type === 'sign-in') {
      return (
        <>
          <button
              type="submit"
              className="mt-3 py-3 px-4 primary-button is-size-5">
              Sign In
            </button>
          <div>
            <p className='is-size-5 mt-4'>Don&apos;t have an account?</p>
            <a href="#sign-up" className='alt-anchor is-size-5'>Click here to sign up.</a>
          </div>
        </>
      );
    } else if (action.type === 'sign-up') {
      return (
        <div>
          <button
            type="submit"
            className="mt-3 py-3 px-4 primary-button is-size-5">
            Sign Up
          </button>
          <p className="is-inline is-size-5 mx-5">or </p>
          <a href="#sign-in" className='alt-anchor is-size-5'>Sign in</a>
        </div>
      );
    }
  }

  function showDisplayMessage() {
    if (action.type === 'sign-up' && action.message === 'error') {
      return (
        <p className='auth-error-message has-text-left my-5 p-3 has-text-weight-bold has-background-danger-light'>
          <i className="fa-solid fa-xmark fa-lg mr-3"></i>
          Username already exists.
        </p>
      );
    } else if (action.type === 'sign-up' && action.message === 'success') {
      return (
        <div className='auth-success-message is-flex is-flex-direction-row has-text-left my-5 p-3 has-text-weight-bold has-background-success-light'>
          <i className="fa-solid fa-check fa-lg mr-4 pt-5"></i>
          <p>Account created! <br />You are ready to STRVE!</p>
        </div>
      );
    } else if (action.type === 'sign-in' && action.message === 'error') {
      return (
        <p className='auth-error-message has-text-left my-5 p-3 has-text-weight-bold has-background-danger-light'>
          <i className="fa-solid fa-xmark fa-lg mr-3"></i>
          Invalid username or password.
        </p>
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="my-3 auth-form mx-auto is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <label
        htmlFor="username"
        className="is-size-5 auth-label mr-auto ml-2">Username</label>
      <input
        onChange={handleChange}
        required={true}
        minLength={5}
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
        minLength={6}
        type="password"
        name="password"
        className="py-2 px-3 mb-4 is-size-5"
        id="password" />
      {displayAlternative()}
      {action.message && showDisplayMessage()}
    </form>
  );
}

export default function AuthPage() {
  const [existingUsernames, setExistingUsernames] = useState(null);
  const { user, curRoute } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/all-usernames')
      .then(response => response.json())
      .then(result => setExistingUsernames(result))
      .catch(err => console.error('ERROR:', err));
  }, []);

  if (user) return <Redirect to='' />;

  return (
    <div className="auth-body has-background-black has-text-centered is-flex is-flex-direction-column is-align-items-center">
      <div className="is-relative auth-logo mx-auto">
        <figure className="is-absolute auth-logo-img image is-64x64">
          <img className="" src="images/flame-red.png" alt="logo icon" />
        </figure>
        <h1 className="auth-logo-text">Strive</h1>
      </div>
      <h3 className="is-size-3 my-5">{curRoute.path === 'sign-up' ? 'Sign Up' : 'Sign In'}</h3>
      {existingUsernames
        ? <AuthForm existingUsernames={existingUsernames} path={curRoute.path} />
        : <LoadingRing />
      }
    </div>
  );
}
