import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'

const Dashboard = () => {
  const {token,dashData,cancelAppointment,getDashData}=useContext(AdminContext)
  
  useEffect(()=>{
    if (token) {
      getDashData()
    }
  },[token])
  
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard