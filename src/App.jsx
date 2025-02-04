import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import PetLocationpage from "./Pages/PetLocationpage";
import PetLocationRealData from "./Pages/PetLocationRealData";
import About from "./Pages/About";
import Help from "./Pages/Help";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Homepage />} />
          <Route index path="/signup" element={<SignupPage />} />
          <Route index path="/login" element={<LoginPage />} />
          <Route index path="/pet-location" element={<PetLocationRealData />} />
          <Route index path="/about" element={<About />}/>
          <Route index path="/help" element={<Help />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
