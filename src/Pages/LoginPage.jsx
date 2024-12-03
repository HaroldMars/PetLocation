import React, { useState } from "react";
import Header from "../components/Header";
import { LoginUser, RedirectTo } from "../utilities/app_util";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleEnterUsername = (value) => {
    setUsername(value);
  };

  const handleEnterPassword = (value) => {
    setPassword(value);
  };

  const handleSubmit = () => {
    const loginSucces = LoginUser(username, password);

    if (loginSucces) RedirectTo("/pet-location");
  };

  return (
    <>
      <div className="bg-primary-1 w-screen h-screen text-white">
        <Header />
        <div className="relative md:grid md:grid-cols-6 w-[50%] h-[80%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">
          <div className="bg-purple-400 grid-cols-6 w-[350px] h-[500px] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] rounded-xl">
            <div className="w-[350px] h-[50px]">
              <p className="mt-10 text-center font-serif font-bold text-3xl">
                {" "}
                Log In{" "}
              </p>

              <div className="flex justify-center m-10">
                <input
                  className=" text-black rounded-xl text-xl p-4"
                  onChange={(e) => handleEnterUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div className="flex justify-center m-10">
                <input
                  type="password"
                  className=" text-black rounded-xl text-xl p-4"
                  onChange={(e) => handleEnterPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div className=" absolute w-full bottom-10 text-center">
                <button
                  className="bg-purple-950 grid-cols-1 p-2 rounded-xl"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
