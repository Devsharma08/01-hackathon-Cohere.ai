import React from 'react'
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (
    <>
    <div className='w-full  min-h-[12vh] flex text-white justify-between items-center px-4'>
<h1 className='text-[25px] font-bold  leading-[24px]' >Cohere Ai</h1>
<Link to={'/login'} className='rounded-2xl color block px-4 flex items-center justify-center font-normal py-2  text-[16px] border-none ' >Log in</Link>
    </div>
    </>
  )
}

export default Navbar