import React, { useState, useEffect } from 'react'
import './App.scss'
import Counter from '../Counter/Counter'
import Header from '../Header/Header'

function App() {
  const [minesCount, setMinesCount] = useState<number>(40)
  const [timer, setTimer] = useState<number>(0)
  useEffect(() => {
    setInterval(() => {
      setTimer((prev) => (prev += 1))
    }, 1000)
  }, [])

  return (
    <>
      <Header>
        <Counter value={minesCount} />
        <button className="status__button"></button>
        <Counter value={timer} />
      </Header>
      <main className="game">
        <div className="cell"></div>
      </main>
      <footer className="footer">
        <p className='footer__copyright'>© 2023 developed by&nbsp;
        <a className='footer__link' href="https://github.com/RolandSallaz" target="_blank">
         {' Roland'}
        </a>
        </p>
      </footer>
    </>
  )
}

export default App
