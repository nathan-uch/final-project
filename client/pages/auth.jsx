import React, { useState, useEffect, useContext, useRef } from 'react';
import LoadingRing from '../components/loading-ring';
import AppContext from '../lib/app-context';
import Redirect from '../lib/redirect';

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
  const authFormRef = useRef();

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
    authFormRef.current.reset();
    const { username } = userInfo;

    if (action.type === 'sign-up') {
      if (existingUsernames.includes(username)) {
        setAction({ ...action, message: 'error' });
        return;
      }

      fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
      })
        .then(response => response.json())
        .then(result => {
          setAction({ ...action, message: 'success' });
          setTimeout(() => {
            window.location.hash = 'sign-in';
          }, 2500);
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
              className='primary-button mt-4 py-3 px-6 text font-bold text-xl'>
              Sign In
            </button>
          <div>
            <p className='text-xl mt-4'>Don&apos;t have an account?</p>
            <a href="#sign-up" className='text-xl underline text-priYellow hover:text-priRed'>Click here to sign up.</a>
          </div>
        </>
      );
    } else if (action.type === 'sign-up') {
      return (
        <div>
          <button
            type="submit"
            className="primary-button mt-4 py-3 px-3 text font-bold text-xl">
            Sign Up
          </button>
          <p className="inline text-xl mx-5">or </p>
          <a href="#sign-in" className='text-xl underline text-priYellow hover:text-priRed'>Sign in</a>
        </div>
      );
    }
  }

  function showDisplayMessage() {
    if (action.type === 'sign-up' && action.message === 'error') {
      return (
        <p className='relative w-[260px] rounded-md text-priRed text-priRed border-2 border-priRed float-left my-5 p-3 font-bold bg-red-100'>
          <i className="fa-solid fa-xmark fa-lg mr-3"></i>
          Username already exists.
        </p>
      );
    } else if (action.type === 'sign-up' && action.message === 'success') {
      return (
        <>
          <p className="mt-3 text-red-500"> Please wait, redirecting...</p >
          <div className='flex justify-around items-center text-sm relative w-[220px] my-5 p-3 font-bold bg-green-100 text-[#419552] rounded-md border-[#419552] border-2'>
            <i className="fa-solid fa-check fa-xl mx-2 color-[#419552] "></i>
            <p>Account created!<br />Ready to STRVE!</p>
          </div>
        </>
      );
    } else if (action.type === 'sign-in' && action.message === 'error') {
      return (
        <p className='relative w-[260px] rounded-md text-lg text-priRed border-2 border-priRed float-left my-5 p-3 font-bold bg-red-100'>
          <i className="fa-solid fa-xmark fa-xl mr-3 relative top-[15px] -left-[8px]"></i>
          Invalid username or password.
        </p>
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      ref={authFormRef}
      className="my-3 w-[250px] mx-auto flex flex-col justify-center items-center">
      <label
        htmlFor="username"
        className="text-xl mb-1 mr-auto ml-2">Username</label>
      <input
        onChange={handleChange}
        required={true}
        minLength={5}
        type="text"
        name="username"
        className="text-xl py-2 px-3 mb-4 text-black"
        id="username" />
      <label
        htmlFor="password"
        className="text-xl mb-1 mr-auto ml-2">Password</label>
      <input
        onChange={handleChange}
        required={true}
        minLength={6}
        type="password"
        name="password"
        className="text-xl py-2 px-3 mb-4 text-black"
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
    <div className="h-full min-h-screen bg-black text-center flex flex-col items-center text-priYellow pt-16">
      <div className="auth-logo-img relative min-w-[240px] h-[100px] mx-auto mb-2">
        <figure className="absolute -top-[9px] -left-[15px] h-[64px] w-[64px]">
          <img
            src="images/flame-red.png"
            alt="logo icon" />
        </figure>
        <h1 className="auth-logo-text absolute text-6xl">Strive</h1>
        <h2 className="auth-logo-subtext absolute bottom-0 min-w-[265px] text-xl">Workout Tracker</h2>
      </div>
      <h3 className="text-3xl my-5">{curRoute.path === 'sign-up' ? 'Sign Up' : 'Sign In'}</h3>
      {existingUsernames
        ? <AuthForm existingUsernames={existingUsernames} path={curRoute.path} />
        : <LoadingRing />
      }
    </div>
  );
}
