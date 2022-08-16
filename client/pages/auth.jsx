import React, { useState } from 'react';

function AuthForm() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
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
        className="mt-3 py-3 px-4 primary-button is-size-5">Sign Up</button>
    </form>
  );
}

export default function AuthPage() {

  return (
    <div className="auth-body has-background-black has-text-centered is-flex is-flex-direction-column">
      <div className="is-relative auth-logo mx-auto">
        <figure className="is-absolute auth-logo-img image is-64x64">
          <img className="" src="images/flame-red.png" alt="logo icon" />
        </figure>
        <h1 className="auth-logo-text">Strive</h1>
      </div>
      <h3 className="is-size-3 mt-5">Sign Up</h3>
      <AuthForm />
    </div>
  );
}
