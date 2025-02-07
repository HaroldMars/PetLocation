import React, { useState } from "react";
import Header from "../components/Header";
import haroldPicture from "../assets/myphoto.jpg";
import BucaoPicture from "../assets/Bucao.jpg";
import deanPicture from "../assets/dean.jpg";
import hezekiahPicture from "../assets/hezekiah.jpg";
import khenPicture from "../assets/khen.jpg";
import dungayPicture from "../assets/dungay.jpg";
import larawanPicture from "../assets/larawan.jpg";
import ezekielPicture from "../assets/ezekiel.jpg";
import iskologoPicture from "../assets/iskologo.png";

export default function About() {
  return (
    <div className='bg-primary-1 w-screen h-fit text-white'>
    <Header />
    <div className="relative w-[50%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">
        <div className="h-[100%] bg-primary-2  rounded-xl  text-center p-8">
            <h1 className= "font-serif font-bold text-3xl"> About </h1> 

            <p>This research is focused on developing a system to track dogs,
               particularly in cases where a dog may go missing.
                The primary objective is to enable pet owners to track their dogs using GPS technology and respond promptly if they are lost. 
                However, our prototype currently has limitations due to the accuracy of the signals received by the Arduino system.
                While the GPS tracking may not yet be fully reliable, it is important to note that the system is designed specifically for tracking purposes,
                not for ensuring the safety of the dogs. As this is our first prototype, there are certain constraints, and we acknowledge that improvements are necessary.
                Nevertheless, we are committed to advancing our research and refining the technology. In the future, we plan to update the system and address current limitations, 
                ensuring a more accurate and effective solution for dog tracking. We are confident that with continued development, we will achieve a more reliable GPS tracking system for pet owners.</p>
            

            
        </div>
    </div>
    <div className=" mt-2 h-[50%] ">
      <h1 className="font-serif text-center font-bold text-2xl"> RESEARCHERS</h1>


    </div>

    <div className="card-group mt-5"> 

      <div className="card">
        <img src={BucaoPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Bucao</h1>
          <p>Group Leader of Group 2</p>
          <button>LEADER</button>
        </div>
      </div>

      <div className="card">
        <img src={haroldPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Abejar</h1>
          <p>Developer, Front-End Developer, Website Design, </p>
          <button>MEMBER</button>
        </div>
      </div>

      <div className="card">
        <img src={deanPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Abatayo</h1>
          <p>ManuScript Encoder, Research Analyst</p>
          <button>MEMBER</button>
        </div>
      </div>

      <div className="card">
        <img src={hezekiahPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Rabadon</h1>
          <p>Assistant Group Leader, Manuscript Encoder, Research Analyst</p>
          <button>MEMBER</button>
        </div>
      </div>

      <div className="card">
        <img src={khenPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Pelicano</h1>
          <p>ManuScript Encoder, Research Analyst, Website Design</p>
          <button>MEMBER</button>
        </div>
      </div>

      <div className="card">
        <img src={dungayPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Dugay</h1>
          <p>Research Analyst, Manuscript Encoder</p>
          <button>MEMBER</button>
        </div>
      </div>

      <div className="card">
        <img src={larawanPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Larawan</h1>
          <p>ManuScript Encoder, Research Analyst</p>
          <button>MEMBER</button>
        </div>
      </div>

      <div className="card">
        <img src={ezekielPicture} alt="" />
        <div className="layer"></div>
        <div className="info">
          <h1>Sacanay</h1>
          <p>Research Analyst, Website Design, ManuScirpt Encoder</p>
          <button>MEMBER</button>
        </div>
      </div>

    </div>

    <footer className="flex">
      <div className="flex m-auto w-fit">
        
      <p className="w-fit">GROUP 2 RESEARCHERS  12-ST.ODILIA &copy; </p>
      <img className="w-[32px] h-[32px] ml-4 " src={iskologoPicture} />
      </div>
    </footer>

    
    {/* <div className="flex border-2 border-white group">
      <img className="rounded-lg w-[150px] shadow-xl blur-md group-hover:blur-none group-hover:transition-all duration-300 hover:blur-none transition-all duration-300" src={haroldPicture} />
      <img className="rounded-lg w-[150px] shadow-xl blur-md group-hover:blur-none group-hover:transition-all duration-300 hover:blur-none transition-all duration-300" src={haroldPicture} />
      <img className="rounded-lg w-[150px] shadow-xl blur-md group-hover:blur-none group-hover:transition-all duration-300 hover:blur-none transition-all duration-300" src={haroldPicture} />
    </div> */}


   
</div>
  )
}
