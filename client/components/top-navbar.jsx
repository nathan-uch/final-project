import React, { useState, useContext } from 'react';
import AppContext from '../lib/app-context';

export default function TopNavbar() {
  const [signOutIsOpen, setSignOutOpen] = useState(false);
  const { handleSignOut } = useContext(AppContext);

  function toggleSignOut() {
    setSignOutOpen(curSignoutIsOpen => !curSignoutIsOpen);
  }

  return (
    <nav className="fixed top-0 min-h-[60px] w-screen px-5 flex items-center flex-row flex-nowrap justify-between bg-black"
    role="navigation" aria-label="main navigation">
      <div className='flex w-[95%] justify-between mr-6'>
        <a href="#">
          <figure>
          <img className="w-[120px] h-[40px] md:h-[35px] md:w-[90px] object-contain"
            src="images/strive-logo.png" alt="logo icon"/>
          </figure>
        </a>
        <div className="hidden md:flex gap-12 items-center">
          <a href="#new-workout" className="text-xl text-priYellow hover:text-priRed font-semibold">Workouts</a>
          <a href="#user-profile" className="text-xl text-priYellow hover:text-priRed font-semibold">Profile</a>
          <a href="#charts" className="text-xl text-priYellow hover:text-priRed font-semibold">Progress</a>
        </div>
      </div>
      <div className="w-[5%] ml-6">
        <a className="" onClick={toggleSignOut}>
          <i className="fa-solid fa-arrow-right-from-bracket fa-xl text-priYellow hover:text-priRed"></i>
        </a>
        <button
          onClick={handleSignOut}
          type="button"
          className={`absolute top-[50px] right-[40px] p-2 border rounded-md border-priRed bg-red-100 text-priRed font-bold hover:bg-priRed hover:text-white ${!signOutIsOpen && 'hidden'}`}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
