import React from 'react';

export default function ErrorPage() {

  return (
    <div className="h-screen pt-[70px] text-center bg-black text-priYellow">
      <div className="w-full">
        <h3 className="text-4xl font-bold">Unexpected Error:</h3>
        <p className="my-5 text-xl">Sorry! Something went wrong.</p>
        <a href="#user-profile" className="text-priYellow underline text-xl">Go Back</a>
      </div>
    </div>
  );
}
