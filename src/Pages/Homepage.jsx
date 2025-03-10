import React, { useEffect } from 'react'
import Header from '../components/Header';
import iskologoPicture from "../assets/iskologo.png";


function Homepage() {

    useEffect(() => {
      try {
        var map = L.map("map").setView(
          [10.258260123297994, 123.8501499239989],
          13
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        var marker = L.marker([10.258260123297994, 123.8501499239989]).addTo(map);
      } catch (e) {}
    }, []);
    return (
      <>
      
        <div className="bg-primary-1 w-screen h-screen text-white">
          <Header />
          <div className=" relative md:grid md:grid-cols-6 w-[80%] h-[80%] bg-secondary-1 left-[50%] translate-x-[-50%] rounded-xl">
            <div className="p-8 md:col-span-2">
              <h1 className="font-bold text-2xl">Locate your Canis</h1>
  
              <br />
              <br />
              <p>
                Locate your companion, safety-first! Find out what your
                companion’s doin. Watch the pup’s social activities.
              </p>
              <div className="hidden md:block">
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              </div>
            </div>
            <div className="md:col-span-4 p-8 h-[300px] md:h-[70%]">
              <div
                className="border-2 relative top-[50%] translate-y-[-50%] rounded-xl"
                id="map"
              ></div>
            </div>
          </div>
          <footer className="flex">
                  <div className="font-serif text-bold flex m-auto w-fit">
                    
                  <p className="w-fit">GROUP 2 RESEARCHERS  12-ST.ODILIA &copy; </p>
                  <img className="w-[32px] h-[32px] ml-4 " src={iskologoPicture} />
                  </div>
                </footer>
        </div>
      </>
    );
}

export default Homepage