import { useState, useEffect, MouseEvent, memo, useRef } from 'react'
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

const App = memo(() => {
  const [minesCount, setMinesCount] = useState(GameSettings.InitMines)
  const [timer, setTimer] = useState(0)
  const [cellUnits, setCellUnits] = useState<ICellUnit[]>([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [smileEmotion, setSmileyEmotion] = useState<SmileyStatus>(
    SmileyStatus.Normal,
  )
  const [isGameOver, setIsGameOver] = useState(false)
  const interval = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    //timer controller
    if (isGameOver) {
      clearInterval(interval.current)
    } else {
      interval.current = setInterval(() => setTimer((prev) => prev + 1), 1000)
    }
  }, [isGameOver])

  useEffect(() => {
    if (isGameOver) {
      changeSmiley(SmileyStatus.Dead)
    }
  }, [isGameOver, smileEmotion])

  useEffect(() => {
    startNewGame()
  }, [])

  function startNewGame() {
    //Устанавливаем изначальные клеточки в сетке
    setIsGameOver(false)
    const arr = Array.from(Array(Math.pow(GameSettings.CellSize, 2)).keys())
    setCellUnits(
      // Заполняем поле
      arr.map((i) => ({ cellNumber: i, isMined: false, isClear: false })),
    )
    setTimer(0)
    setMinesCount(GameSettings.InitMines)
    setIsGameStarted(false)
    changeSmiley(SmileyStatus.Normal)
  }

  function plantMines() {
    const arr = cellUnits.filter((item) => !item.isClear)
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    shuffled
      .slice(0, minesCount)
      .forEach((item) => (cellUnits[item.cellNumber].isMined = true))
  }

  function handleCellUnitClick(cellNumber: number) {
    if (isGameOver) return
    if (!isGameStarted) {
      //первый клик
      setCellUnits((prev) => {
        const newArr = [...prev]
        newArr[cellNumber] = { cellNumber, isClear: true, isMined: false }
        return newArr
      })
      setIsGameStarted(true)
      plantMines()
    } else {
      if (cellUnits[cellNumber].isMined) {
        setIsGameOver(true)
      } else {
        setCellUnits((prev) => {
          const newArr = [...prev]
          newArr[cellNumber].isClear = true
          return newArr
        })
      }
    }
    openNearCells(cellNumber)
  }

  function openNearCells(cellNumber: number) {
    function checkAroundCell() {
      let mines = 0
      const adjacentCells = [
        -GameSettings.CellSize,
        -GameSettings.CellSize - 1,
        -GameSettings.CellSize + 1,
        -1,
        1,
        GameSettings.CellSize,
        GameSettings.CellSize - 1,
        GameSettings.CellSize + 1,
      ]
      adjacentCells.forEach((cell) => {
        cellUnits[cellNumber + cell].isMined && mines++
      })
      return mines
    }
    let test = 0
    let currentUnit = cellNumber
    console.log(checkAroundCell())
  }

  function changeSmiley(emotion: SmileyStatus) {
    setSmileyEmotion(emotion)
  }

  function mouseUpEventListener() {
    changeSmiley(SmileyStatus.Normal)
    document.removeEventListener('mouseup', mouseUpEventListener)
  }

  function handleMouseDownOnCell(e: MouseEvent<HTMLButtonElement>) {
    if (isGameOver) return
    changeSmiley(SmileyStatus.Scared)
    document.addEventListener('mouseup', mouseUpEventListener)
  }

  function handleMouseUp(cellNumber: number) {
    if (isGameOver) return
    handleCellUnitClick(cellNumber)
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
          cellSize={GameSettings.CellSize}
          cellUnits={cellUnits}
          onMouseDown={handleMouseDownOnCell}
          onMouseUp={handleMouseUp}
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
})

export default App
