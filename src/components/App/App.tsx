import React, { useState, useEffect } from 'react'
import './App.scss'
import Counter from '../Counter/Counter'
import Status from '../Header/Status'
import GameField from '../GameField/GameField'

enum GAMESETTING {
  CellSize = 48
}

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
      <main className="game">
      <Status>
        <Counter value={minesCount} />
        <button className="status__button"></button>
        <Counter value={timer} />
      </Status>
        <GameField cellSize={GAMESETTING.CellSize}/>
      </main>
      <footer className="footer">
        <p className="footer__copyright">
          © 2023 developed by&nbsp;
          <a
            className="footer__link"
            href="https://github.com/RolandSallaz"
            target="_blank"
          >
            Roland
          </a>
        </p>
      </footer>
    </>
  )
}

export default App
