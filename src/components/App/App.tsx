import React, { useState,useEffect } from 'react'
import logo from './logo.svg'
import './App.scss'
import Counter from '../Counter/Counter'

function App() {
  const [minesCount, setMinesCount] = useState<number>(40)
  const [timer, setTimer] = useState<number>(0)
  useEffect(()=>{
    setInterval(()=>{
      setTimer(prev=>prev+=1)
    },1000)
  },[])

  return (
    <main className="game">
      <div className="status">
        <div className="status__containter">
          <Counter value={minesCount} />
          <button className="status__button"></button>
          <Counter value={timer} />
        </div>
      </div>
      <div className="cell"></div>
    </main>
  )
}

export default App
