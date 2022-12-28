import './App.css'
import {Routes,Route } from "react-router-dom";


import React from 'react'
import Weather from "./components/Weather";

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Weather/>}/>
    </Routes>
    </>
  )
}


