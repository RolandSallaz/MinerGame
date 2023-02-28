import React, { useState, useEffect } from 'react'
import './App.scss'
import Counter from '../Counter/Counter'
import Status from '../Header/Status'
import GameField from '../GameField/GameField'

enum GAMESETTING {
  CellSize = 16,
}

function App() {
  const [minesCount, setMinesCount] = useState<number>(40)
  const [timer, setTimer] = useState<number>(0)
  const [cellUnits, setCellUnits] = useState<ICellUnit[]>([])
  useEffect(() => {
    //Устанавливаем изначальные клеточки в сетке
    const arr = Array.from(Array(Math.pow(GAMESETTING.CellSize, 2)).keys())
    setCellUnits(
      arr.map((i) => ({
        cellNumber: i,
        isMined: false,
        isClear: false,
      })),
    )

    //Запускаем таймер
    setInterval(() => {
      setTimer((prev) => (prev += 1))
    }, 1000)
  }, [])

  function plantMines() {}

  function handleCellUnitClick(cellNumber: number) {
    console.log(cellNumber)
    const newArr = cellUnits
    newArr[cellNumber] = {cellNumber, isClear: true,isMined:false }
    setCellUnits(newArr)
  }

  return (
    <>
      <main className="game">
        <Status>
          <Counter value={minesCount} />
          <button className="status__button"></button>
          <Counter value={timer} />
        </Status>
        <GameField
          cellSize={GAMESETTING.CellSize}
          cellUnits={cellUnits}
          onCellUnitClick={handleCellUnitClick}
        />
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
