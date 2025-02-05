import React, { useState } from "react";
import Header from "../components/Header";

export default function Help() {
  return (
    <div className='bg-primary-1 w-screen h-screen text-white'>
    <Header />
    <div className="relative md:grid md:grid-cols-6 w-[50%] h-[80%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">
        <div className="  w-[370px] h-[100%] bg-primary-2 left-[100px] translate-x-[50px] rounded-sm">
        <h3 className=" mt-10 font-serif font-bold w-[100%]  ">What Can I Help You With?</h3>
    <p>If you need assistance or encounter any problems while using the website, please don’t hesitate to contact us at:</p>
    <ul>
        <li><strong>Globe SIM</strong>: +639273865959</li>
        <li><strong>Other Number</strong>: +63991436531</li>
    </ul>
    <table className="  mt-2  w-[100%] h-[10%]">
      <tr>
      If you experience a bug or an issue, please report it to us immediately so that we can fix it as soon as possible. This helps us improve the website and ensures a safe experience for both the users and the owners.
      </tr>
      <ul>
        <li><strong>Gmail</strong>: abejar199@gmail.com</li>
    </ul>
    </table>
        </div>
    </div>
   
</div>
  )
}