import React from 'react'
import Header from '../components/Header'

function LoginPage() {
  return (
    <>
    <div className='bg-primary-1 w-screen h-screen text-white'>
        <Header /> 
        <div className="relative md:grid md:grid-cols-6 w-[50%] h-[80%] bg-secondary-1 left-[50%] translate-x-[-50%] rounded-xl">
            <p>
                Mao ning Login
            </p>
            
        </div>
        
        
    </div>
    </>
  )
}



export default LoginPage