import React, { useState } from "react";
import Header from "../components/Header";

export default function About() {
  return (
    <div className='bg-primary-1 w-screen h-screen text-white'>
    <Header />
    <div className="relative md:grid md:grid-cols-6 w-[50%] h-[80%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">
        <div className="w-[370px] h-[100%] bg-primary-2 left-[500px] translate-x-[50px] rounded-sm">
            <h1 className= "  mt-10 text-center font-serif font-bold text-3xl w-[550px]"> About </h1> 
            <table className=" text-center font-san-serif w-[150%] h-[50%] ">
              
              <tr>This research is focused on developing a system to monitor the safety of dogs, 
                particularly in cases where a dog may go missing. The primary objective is to ensure that pet owners can track their dogs and respond promptly if they are lost.
                However, our prototype currently has limitations due to the accuracy of the signals received by the Arduino system. While the tracking may not yet be fully reliable,
                we assure all users and pet owners that the safety and well-being of their pets remain our top priority.
                As this is our first prototype, there are certain constraints, and we acknowledge that improvements are necessary. Nevertheless, we are committed to advancing our research and refining the technology. 
                In the future, we plan to update the system and address current limitations, ensuring a more accurate and effective solution for pet monitoring. We are confident that with continued development, 
                we will achieve a more reliable tracking system for pet safety.</tr>
              
            </table>
        </div>
    </div>
   
</div>
  )
}
