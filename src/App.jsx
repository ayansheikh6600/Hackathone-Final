import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login, Student } from './Screen'
import "./App.css"
import DashBoard from './Screen/Dashboard/DashBoard'
import Protected from './Protected'

function App() {

  return (

    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/dashboard' element={<Protected><DashBoard/></Protected>}/>
      <Route path='/StudendAdd' element={<Student/>}/>
    </Routes>

     
    
    </BrowserRouter>
  )
}

export default App
