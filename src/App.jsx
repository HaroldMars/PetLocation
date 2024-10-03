import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

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
        <div className="relative grid grid-cols-6 w-[80%] h-[80%] bg-secondary-1 left-[50%] translate-x-[-50%] rounded-xl">
          <div className="p-8 col-span-2">
            <h1 className="font-bold text-2xl">Locate your Canis</h1>

            <br />
            <br />
            <p>
              Locate your companion, safety-first! Find out what your
              companion’s doin. Watch the pup’s social activities.
            </p>
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
            <button className="bg-white primary-1 px-4 py-1 rounded-full text-[20px]">
              Locate <i className="fa-solid fa-arrow-right text-white bg-black p-2 rounded-full"></i>
            </button>
          </div>
          <div className="col-span-4 p-8">
            <div
              className="relative top-[50%] translate-y-[-50%]"
              id="map"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;