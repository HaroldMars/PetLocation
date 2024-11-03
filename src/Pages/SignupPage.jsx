import React from 'react'
import Header from '../components/Header'

function SignupPage() {
  
  



  return (
    <div className='bg-primary-1 w-screen h-screen text-white'>
        <Header />
        <div className="relative md:grid md:grid-cols-6 w-[50%] h-[80%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">

        <div className="bg-purple-400 grid-cols-6 w-[350px] h-[500px] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] rounded-xl">
            <div className="w-[350px] h-[50px]">
              <p className="mt-10 text-center font-serif font-bold text-3xl"> Sign Up </p>
              
            <div className="flex justify-center m-10">
            <input className= "text-black rounded-xl text-xl p-4" />
            </div>
            <div className="flex justify-center m-10">
            <input type="password" className=" text-black rounded-xl text-xl p-4" />
            </div>
            <div className=" absolute w-full bottom-10 text-center">
              <button className="bg-purple-950 grid-cols-1 p-2 translate-x-[10%] translate-y-[-100%] rounded-xl"> Sign Up </button>
            </div>
            </div>
        </div>
       </div>
    </div>
    
  )
}

export default SignupPage