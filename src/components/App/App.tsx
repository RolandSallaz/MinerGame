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

const App = memo(() => {
    const [minesCount, setMinesCount] = useState<number>(GameSettings.InitMines)
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
            arr.map((i) => ({cellNumber: i, isMined: false, isClear: false})),
        )
        setTimer(0)
        setMinesCount(GameSettings.InitMines)
        setIsGameStarted(false)
        changeSmiley(SmileyStatus.Normal)
    }

    function plantMines(arrayToFill: ICellUnit[], clickedCell: number) {
        const arr = arrayToFill.filter((item) => item.cellNumber !== clickedCell)
        const shuffled = [...arr].sort(() => 0.5 - Math.random())
        shuffled
            .slice(0, GameSettings.InitMines)
            .forEach((item) => (arr[item.cellNumber].isMined = true))
        setCellUnits(arr)
    }

    function handleCellUnitClick(cellNumber: number) {
        function setMinesAroundCell() {
            cellUnits[cellNumber].adjacentMines = minesAround
        }

        if (isGameOver) return
        let minesAround = checkAroundCell(cellNumber)
        if (!isGameStarted) {
            // первый клик

            plantMines(cellUnits, cellNumber)
            setIsGameStarted(true)
            minesAround = checkAroundCell(cellNumber)
            if (minesAround) {
                return setMinesAroundCell()
            } // Если есть мины, то оставляем одну клетку
            else {
                openNearCells(cellNumber)
            }
        } else {
            // Если игра уже начата
            if (cellUnits[cellNumber].isMined) {
                // Если попали по мине
                setIsGameOver(true)
            } else {
                if (minesAround) {
                    // Если есть мины, то оставляем одну клетку
                    return setMinesAroundCell()
                } else {
                    // Если попали на пустую клетку
                    setCellUnits((prev) => {
                        const newArr = [...prev]
                        newArr[cellNumber].isClear = true
                        return newArr
                    })
                    openNearCells(cellNumber)
                }
            }
        }
    }

    function openNearCells(cellNumber: number) {
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
            const cellToCheck = cellNumber + cell
            if (
                cellToCheck >= 0 &&
                cellToCheck < Math.pow(GameSettings.CellSize, 2) &&
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

    function checkAroundCell(cellNumber: number) {
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
            const cellToCheck = cellNumber + cell
            if (
                cellToCheck >= 0 &&
                cellToCheck < Math.pow(GameSettings.CellSize, 2) - 1
            ) {
                cellUnits[cellToCheck].isMined && mines++
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
        if (isGameOver) return
        changeSmiley(SmileyStatus.Scared)
        document.addEventListener('mouseup', mouseUpEventListener)
    }

    function handleMouseUp(cellNumber: number, isLeftClick: boolean) {
        if (isGameOver) return
        const cellElement = cellUnits[cellNumber]
        if (isLeftClick) {
            handleCellUnitClick(cellNumber)
        } else {  //Обработка правого клика мыши
            if (!cellElement.isClear && !cellElement.adjacentMines) { //Если клетка не открыта

                if ((!cellElement.cellState || cellElement.cellState == CellState.Default) && minesCount) {
                    cellElement.cellState = CellState.Defused
                    return setMinesCount(prev =>prev -= 1)
                } else if (cellElement.cellState == CellState.Defused || (!cellElement.cellState || cellElement.cellState == CellState.Default && !minesCount)) {
                    if(cellElement.cellState == CellState.Defused){
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
