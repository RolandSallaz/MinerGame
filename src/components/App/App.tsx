import React, { useState, useEffect } from 'react'
import './App.scss'
import Counter from '../Counter/Counter'
import Status from '../Status/Status'
import GameField from '../GameField/GameField'

enum GameSettings {
  CellSize = 16,
  InitMines = 40,
}

export enum SmileyStatus {
  Normal = 'normal',
  Scared = 'scared',
  Dead = 'dead',
  Cool = 'cool',
}

function App() {
  const [minesCount, setMinesCount] = useState<number>(GameSettings.InitMines)
  const [timer, setTimer] = useState<number>(0)
  const [cellUnits, setCellUnits] = useState<ICellUnit[]>([])
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)
  const [smileEmotion, setSmileyEmotion] = useState<SmileyStatus>(
    SmileyStatus.Normal,
  )
  useEffect(() => {
    startNewGame()

    //Запускаем таймер
    setInterval(() => {
      setTimer((prev) => (prev += 1))
    }, 1000)
  }, [])

  function startNewGame() {
    //Устанавливаем изначальные клеточки в сетке
    const arr = Array.from(Array(Math.pow(GameSettings.CellSize, 2)).keys())
    setCellUnits(
      arr.map((i) => ({
        cellNumber: i,
        isMined: false,
        isClear: false,
      })),
    )

    setTimer(0)
    setMinesCount(GameSettings.InitMines)
    setIsGameStarted(false)
  }

  function plantMines() {
    const arr = cellUnits.filter((item) => !item.isClear)
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    const newArr = cellUnits
    shuffled
      .slice(0, minesCount)
      .forEach((item) => (newArr[item.cellNumber] = { ...item, isMined: true }))
    setCellUnits(newArr)
  }

  function handleCellUnitClick(cellNumber: number) {
    if (!isGameStarted) {
      const newArr = cellUnits
      newArr[cellNumber] = { cellNumber, isClear: true, isMined: false }
      setCellUnits(newArr)
      setIsGameStarted(true)
      plantMines()
    }
  }

  function changeSmiley(emotion: SmileyStatus) {
    setSmileyEmotion(emotion)
  }

  return (
    <>
      <main className="game">
        <Status
          emotion={smileEmotion}
          timer={timer}
          minesCount={minesCount}
          onNewGameClick={startNewGame}
        />
        <GameField
          changeSmiley={changeSmiley}
          cellSize={GameSettings.CellSize}
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
