import React from "react";
import brandLogo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className="grid grid-cols-6">
      <div
        className="flex items-center w-fit col-span-3"
        onClick={() => (location.href = "/")}
        title="Home"
      >
        <img className="w-20 h-20" src={brandLogo} />
        <h1 className="text-2xl font-bold">Pet Location</h1>
      </div>
      <div className="flex items-center col-span-3">
        <NavLink
          to="/login"
          className={({ isActive }) => {
            if (isActive) return "px-4 cursor-pointer truncate text-purple-300";
            else "px-4 cursor-pointer truncate";
          }}
        >
          <div className="md:hidden">
            <i className="fa-solid fa-right-to-bracket"></i>
          </div>{" "}
          <span className="hidden md:block">Login</span>
        </NavLink>

        <a className="px-4 cursor-pointer truncate" href="About">
          <div className="md:hidden">
            <i className="fa-solid fa-address-card"></i>
          </div>{" "}
          <span className="hidden md:block">About</span>
        </a>
        <a className="px-4 cursor-help truncate" href="Help">
          <div className="md:hidden">
            <i className="fa-solid fa-question"></i>
          </div>{" "}
          <span className="hidden md:block">Help</span>
        </a>
        {/* <NavLink
          to="/signup"
          className={({ isActive }) => {
            if (isActive) return "hidden";
            else return "bg-white primary-1 px-4 py-1 rounded-full";
          }}
        >
          <span className="hidden md:block">
            Sign up <i className="fa-solid fa-arrow-right"></i>
          </span>
          <div className="md:hidden">
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </NavLink> */}
      </div>
    </div>
  );
}

export default Header;
