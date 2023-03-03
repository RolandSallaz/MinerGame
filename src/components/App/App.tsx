import {useState, useEffect, memo, useRef} from 'react'
import './App.scss'
import Status from '../Status/Status'
import GameField from '../GameField/GameField'
import {ICellUnit} from "../../types";

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

export enum CellState {
    Mined,
    Clean,
    Defused,
    Question,
    Default
}

export enum GameOverState {
    Win,
    Lose,
}

const App = memo(() => {
    const [minesCount, setMinesCount] = useState<number>(GameSettings.InitMines)
    const [timer, setTimer] = useState(0)
    const [cellUnits, setCellUnits] = useState<ICellUnit[]>([])
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [smileEmotion, setSmileyEmotion] = useState<SmileyStatus>(
        SmileyStatus.Normal,
    )
    const [openedCells, setOpenedCells] = useState<number>(0)
    const [gameOver, setGameOver] = useState<GameOverState | null>(null)
    const interval = useRef<ReturnType<typeof setInterval>>()

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

    useEffect(() => {
        //timer controller
        if (gameOver == GameOverState.Lose || gameOver == GameOverState.Win) {
            clearInterval(interval.current)
        } else {
            interval.current = setInterval(() => setTimer((prev) => prev + 1), 1000)
        }
    }, [gameOver])

    useEffect(() => {
        if (gameOver == GameOverState.Lose) {
            changeSmiley(SmileyStatus.Dead)
        } else if (gameOver == GameOverState.Win) {
            changeSmiley(SmileyStatus.Cool)
        }
    }, [gameOver, smileEmotion])
    useEffect(() => {
        if (openedCells == cellUnits.length - GameSettings.InitMines) {
            setGameOver(GameOverState.Win)
        }
    }, [openedCells])
    useEffect(() => {
        startNewGame()
    }, [])

    function startNewGame() {
        //Устанавливаем изначальные клеточки в сетке
        setGameOver(null)
        const arr = Array.from(Array(Math.pow(GameSettings.CellSize, 2)).keys())
        setCellUnits(
            // Заполняем поле
            arr.map((i) => ({cellNumber: i, isMined: false, isClear: false})),
        )
        setTimer(0)
        setOpenedCells(0)
        setMinesCount(GameSettings.InitMines)
        setIsGameStarted(false)
        changeSmiley(SmileyStatus.Normal)
    }

    function plantMines(arrayToFill: ICellUnit[], clickedCell: number) {
        const shuffled = arrayToFill.filter(item => item.cellNumber !== clickedCell).sort(() => 0.5 - Math.random())
        shuffled
            .slice(0, GameSettings.InitMines)
            .forEach((item) => {
                arrayToFill[item.cellNumber].isMined = true
            })
        setCellUnits(arrayToFill)
        return arrayToFill;
    }

    function handleCellUnitClick(cellNumber: number) {
        function setMinesAroundCell(arr: ICellUnit[]) {
            arr[cellNumber].adjacentMines = minesAround
        }

        if (gameOver) return
        let minesAround = checkAroundCell(cellNumber)
        if (!isGameStarted) {
            // первый клик
            setOpenedCells(prev => prev + 1)
            const minedArr = plantMines(cellUnits, cellNumber)
            setIsGameStarted(true)
            minesAround = checkAroundCell(cellNumber, minedArr)
            if (minesAround) {
                return setMinesAroundCell(minedArr)
            } // Если есть мины, то оставляем одну клетку
            else {
                openNearCells(cellNumber)
            }
        } else {
            // Если игра уже начата
            if (cellUnits[cellNumber].isClear || cellUnits[cellNumber].adjacentMines) {
                return
            }
            if (cellUnits[cellNumber].isMined) {
                // Если попали по мине
                cellUnits[cellNumber].boom = true
                setGameOver(GameOverState.Lose)
            } else {
                if (minesAround) {
                    // Если есть мины, то оставляем одну клетку
                    setOpenedCells(prev => prev + 1)
                    return setMinesAroundCell(cellUnits)
                } else {
                    // Если попали на пустую клетку
                    setCellUnits((prev) => {
                        prev[cellNumber].isClear = true
                        return prev
                    })
                    openNearCells(cellNumber)

                }
            }
        }
        setOpenedCells(cellUnits.filter(item => item.isClear || item.adjacentMines).length)
    }

    function openNearCells(cellNumber: number) {
        adjacentCells.forEach((cell) => {
            const cellToCheck = cellNumber + cell
            if (
                cellToCheck >= 0 &&
                cellToCheck < cellUnits.length &&
                !cellUnits[cellToCheck].isClear &&
                !cellUnits[cellToCheck].isMined
            ) {
                const minesAround = checkAroundCell(cellToCheck)
                if (minesAround) {
                    cellUnits[cellToCheck].adjacentMines = minesAround
                } else {
                    cellUnits[cellToCheck].isClear = true
                    openNearCells(cellToCheck)
                }
            }
        })
    }

    function checkAroundCell(cellNumber: number, arr: ICellUnit[] = cellUnits) {
        let mines = 0
        adjacentCells.forEach((cell) => {
            const cellToCheck = cellNumber + cell
            if (
                cellToCheck >= 0 &&
                cellToCheck < cellUnits.length
            ) {
                arr[cellToCheck].isMined && mines++
            }
        })
        return mines
    }

    function changeSmiley(emotion: SmileyStatus) {
        setSmileyEmotion(emotion)
    }

    function mouseUpEventListener() {
        changeSmiley(SmileyStatus.Normal)
        document.removeEventListener('mouseup', mouseUpEventListener)
    }

    function handleMouseDownOnCell() {
        if (gameOver) return
        changeSmiley(SmileyStatus.Scared)
        document.addEventListener('mouseup', mouseUpEventListener)
    }

    function handleMouseUp(cellNumber: number, isLeftClick: boolean) {
        if (gameOver) return
        const cellElement = cellUnits[cellNumber]
        if (isLeftClick) {
            handleCellUnitClick(cellNumber)
        } else {  //Обработка правого клика мыши
            if (!cellElement.isClear && !cellElement.adjacentMines) { //Если клетка не открыта
                if ((!cellElement.cellState || cellElement.cellState == CellState.Default) && minesCount) {
                    cellElement.cellState = CellState.Defused
                    return setMinesCount(prev => prev -= 1)
                } else if (cellElement.cellState == CellState.Defused || (!cellElement.cellState || cellElement.cellState == CellState.Default && !minesCount)) {
                    if (cellElement.cellState == CellState.Defused) {
                        setMinesCount(prev => prev += 1)
                    }
                    cellElement.cellState = CellState.Question
                } else if (cellElement.cellState == CellState.Question) {
                    cellElement.cellState = CellState.Default
                }
            }
        }
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
                    gameOver={gameOver}
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
