import React from 'react'
import Header from '../components/Header'

function SignupPage() {
  return (
    <div className='bg-primary-1 w-screen h-screen text-white'>
        <Header />
        <div className="relative md:grid md:grid-cols-6 w-[50%] h-[50%] bg-primary-2 left-[50%] translate-x-[-50%] rounded-xl">
            <p>
                Mao ni ang sign up
            </p>
        </div>
       
    </div>
    
  )
}

export default SignupPage