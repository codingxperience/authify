import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const home = () => {
  const navigate = useNavigate()
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/auth/home', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 201) {
      navigate('/login')
    }
    } catch (error) {
      navigate('/login')
      console.log(error)  
    }
  }
  useEffect(() => {
    fetchUser()

  }, [])
  return (
    <div className='text-3xl text-blue-500'>home</div>
  )
}

export default home