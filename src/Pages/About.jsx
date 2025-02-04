import React, { useState } from "react";
import Header from "../components/Header";

export default function About() {
  return (
    <div className='bg-primary-1 w-screen h-screen text-white'>
    <Header />
    <div className="relative md:grid md:grid-cols-6 w-[50%] h-[50%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">
        <div className=" md:grid md grid-cols-8 w-[370px] h-[100%] bg-primary-2 left-[100px] translate-x-[50px] rounded-sm">
            <h1 className= "mt-10 text-center font-serif font-bold text-3xl w-[370px]"> About </h1> 
        </div>
    </div>
   
</div>
  )
}
