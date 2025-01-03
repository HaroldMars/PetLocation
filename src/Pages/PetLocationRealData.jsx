import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PetImageIcon from "../assets/dog_icon_marker.png";

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
