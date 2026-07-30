import React, { useState } from 'react'

const Login = () => {
  
  const [state, setState] = useState('sign up')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onClick=(event)=>{
    event.preventDefault()

  }
  
  return (
    <form className='max-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'sign up' ? 'sign up':'login'}</p>
        <p>please {state === 'sign up' ? 'sign up':'login in'} to book appointment</p>
       {state === 'sign up' && 
        <div className='w-full'>
          <p>full name</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onClick={(e)=>setName(e.target.name)} value={name} required/>
        </div>
          }
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onClick={(e)=>setEmail(e.target.email)} value={email} required/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onClick={(e)=>setPassword(e.target.password)} value={password} required/>
        </div>
        <button className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base'>{state === 'sign up' ? 'create account':'login'}</button>
        {
          state === 'sign up' ?
          <p>Already have an account ? <span onClick={()=>setState('Login')} className='text-blue-500 cursor-pointer underline'>Login here</span> </p> :
          <p>Create an new account? <span onClick={()=>setState('sign up')} className='text-blue-500 cursor-pointer underline'>click here</span> </p>

        }
      </div>
        
    </form>
  )
}

export default Login