import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PetImageIcon from "../assets/dog_icon_marker.png";

function PetLocationRealData() {
  const [locations, setLocations] = useState([]);
  const [loadedMap, setLoadedMap] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const callBackend = async () => {
    const backendUrl =
      (import.meta.env.VITE_API_URL ?? "localhost") + "/getlocations";

    // const res = await fetch(backendUrl);

    // const data = await res.json();
    // setLocations(data.data);
  };

  const handleEnterLocation = () => {
    const arr = inputValue.split("&"); // ['pinName=pet_tag_1', 'lat=0.000', 'long=0.000']

    if (arr.length < 3) {

      setLocations([])
      return;
    }

    try {
      const pinName = arr[0].split("=")[1] // pet_tag_1
      const lat = arr[1].split("=")[1]; // 0.000
      const long = arr[2].split("=")[1]; // 0.000

      setLocations([{ pinName, lat, long, id: 1 }])
    } catch {
      setLocations([])
    }
  }

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
        // change the icon
        var icon = L.icon({
          iconUrl: PetImageIcon,
          iconSize: [32, 32], // size of the icon
          iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
          shadowAnchor: [0, 0], // the same for the shadow
          popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
        });
        var marker = L.marker([location.lat, location.long], {
          icon: icon,
        }).addTo(loadedMap);
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
        <div className="relative w-[80%] h-[80%] bg-secondary-1 left-[50%] translate-x-[-50%] rounded-xl">
          <div className="p-8 h-[300px] md:h-[90%]">
            <h1 className="text-center font-bold text-xl">Pet Tracker</h1>
            <input className="text-black text-center w-[100%] bg-purple-300 rounded-xl" type="text" onChange={(e) => { setInputValue(e.target.value); handleEnterLocation() }} onInput={(e) => { setInputValue(e.target.value); handleEnterLocation() }} value={inputValue} />
            <div
              className="border-2 relative top-[50%] translate-y-[-50%] rounded-xl"
              id="map"
            ></div>

          </div>
          {
            locations.length > 0 && <a className="relative left-[50%] translate-x-[-50%] bg-purple-500 text-white rounded-xl" target="_blank" href={`https://www.google.com/maps/?q=${locations[0]?.lat},${locations[0]?.long}`}>Open in Map</a>
          }
        </div>
      </div>
    </>
  );
}

export default PetLocationRealData;
