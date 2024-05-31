import React from 'react'
import Signup from './Pages/Signup/Signup'
import "./App.css"
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Dashboard from './Pages/Dashboard/Dashboard'
import Chat from './Pages/Chat/Chat'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </Router>
  )
}

export default App