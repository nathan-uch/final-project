import React from 'react';

export default function BotNavbar() {

  return (
    <nav className="navbar z-20 md:hidden fixed bottom-0 w-full flex flex-row justify-evenly items-center bg-black" role="navigation" aria-label="main navigation">
        <a href="#user-profile" className="p-0">
          <figure className="bg-black ">
            <img src="images/user-icon.png" className="object-contain w-[40px] h-[45px] my-2" />
          </figure>
        </a>
        <a href="#new-workout" className="p-0">
          <figure className="bg-black">
            <img src="images/db-yellow.png" className="object-contain w-[60px] h-[60px]" />
          </figure>
        </a>
        <a href="#charts" className="p-0">
          <figure className="bg-black">
            <img src="images/chart-yellow.png" className="object-contain w-[42px] h-[40px]" />
          </figure>
        </a>
    </nav>
  );
}
