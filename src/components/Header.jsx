import React from "react";
import brandLogo from "../assets/logo.png";

function Header() {
  return (
    <div className="grid grid-cols-6">
    <div className="flex items-center w-fit col-span-3">
      <img className="w-20 h-20" src={brandLogo} />
      <h1 className="text-2xl font-bold">Pet Location</h1>
    </div>
    <div className="flex items-center col-span-3">
      <a className="px-4 cursor-pointer">Login</a>
      <a className="px-4 cursor-pointer">Pet Location</a>
      <a className="px-4 cursor-pointer">About</a>
      <a className="px-4 cursor-help">Help</a>
      <button className="bg-white primary-1 px-4 py-1 rounded-full">
        Sign up <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
  )
}



export default Header;

