import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const handleChanges = (e) => {
    setValues({
      ...values,
      [e.target.name]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/auth/login', values)
      if (response.status === 201) {
        localStorage.setItem('token', response.data.token)
        navigate('/home')
      }
    } catch (error) {
      console.log(error)  
    }
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='shadow-lg px-8 py-5 border w-96'>
        <h2 className='text-lg font-bold mb-4'>Login</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor="email" className='block text-gray-700'>Email</label>
            <input type="email" id="email" placeholder='Enter Email' 
            className='w-full px-3 py-2 border' 
            name="email" onChange={handleChanges}/>
          </div>
          <div className='mb-4'>
            <label htmlFor="password" className='block text-gray-700'>Password</label>
            <input type="password" id="password" placeholder='Enter Password' 
            className='w-full px-3 py-2 border' 
            name="password" onChange={handleChanges}/>
          </div>
          <button className='w-full bg-green-600 text-white py-2'>Submit</button>
        </form>
        <div className='text-center'>
          <span>Don't have account? </span>
          <Link to="/register" className='text-blue-500'>Register</Link>
        </div>
      </div>
    </div>
  )
}

export default login