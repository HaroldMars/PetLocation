import React, { useEffect, useState } from "react";
import Header from "../components/Header";

function PetLocationRealData() {
  const [locations, setLocations] = useState([]);
  const [loadedMap, setLoadedMap] = useState(null);
  const callBackend = async () => {
    const backendUrl =
      (import.meta.env.VITE_API_URL ?? "localhost") + "/getlocations";

    const res = await fetch(backendUrl);

    const data = await res.json();
    setLocations(data.data);
  };

  useEffect(() => {
    setInterval(callBackend, 2_000);
  }, []);

  useEffect(() => {
    if (loadedMap) {
      for (let layer in loadedMap._layers) {
        const m = loadedMap._layers[layer];
        if (m._url) continue;
        loadedMap.removeLayer(m);
      }
      for (let location of locations) {
        var marker = L.marker([location.lat, location.long]).addTo(loadedMap);
      }
    }
  }, [loadedMap, locations]);

  useEffect(() => {
    try {
      if (loadedMap === null) {
        var map = L.map("map").setView(
          [10.258260123297994, 123.8501499239989],
          12
        );
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        setLoadedMap(map);
      }
    } catch (e) {
      console.log(e);
    }
  }, [loadedMap]);

  // useEffect(() => {
  //   try {
  //     var map = L.map("map").setView(
  //       [10.258260123297994, 123.8501499239989],
  //       12
  //     );
  //     L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       maxZoom: 19,
  //       attribution:
  //         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //     }).addTo(map);
  //     var marker = L.marker([10.258260123297994, 123.8501499239989]).addTo(map);

  //     console.log(locations);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [locations]);
  return (
    <>
      <div className="bg-primary-1 w-screen h-screen text-white">
        <Header />
        <div className="relative md:grid md:grid-cols-6 w-[80%] h-[80%] bg-secondary-1 left-[50%] translate-x-[-50%] rounded-xl">
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
            <button className="bg-white primary-1 px-4 py-1 rounded-full text-[20px]">
              Locate{" "}
              <i className="fa-solid fa-arrow-right text-white bg-black p-2 rounded-full"></i>
            </button>
          </div>
          <div className="md:col-span-4 p-8 h-[300px] md:h-[70%]">
            <div
              className="border-2 relative top-[50%] translate-y-[-50%] rounded-xl"
              id="map"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PetLocationRealData;
