import './GameField.scss'
import {MouseEvent} from 'react'
import {ICellUnit} from "../../types";
import {CellState, GameOverState} from "../App/App";

interface GameFieldProps {
    gameOver: GameOverState | null,
    cellSize: number
    cellUnits: ICellUnit[]
    onMouseDown: () => void
    onMouseUp: (cellNumber: number, isLeftClick: boolean) => void
}

export default function GameField({
                                      cellSize,
                                      cellUnits,
                                      onMouseDown,
                                      onMouseUp,
                                      gameOver,
                                  }: GameFieldProps) {
    function handleMouseDown(e: MouseEvent<HTMLButtonElement>) {
        onMouseDown()
    }

    function handleMouseUp(cellNumber: number, isLeftClick: boolean) {
        onMouseUp(cellNumber, isLeftClick)
    }

    return (
        <div
            className="game-field"
            style={{
                gridTemplateColumns: `repeat(${cellSize},1fr)`,
                gridTemplateRows: `repeat(${cellSize},1fr)`,
            }}
        >
            {cellUnits.map((item, index) => (
                <button
                    key={index}
                    onContextMenu={(e) => e.preventDefault()}
                    onMouseDown={handleMouseDown}
                    onMouseUp={(e) => {
                        handleMouseUp(index, e.button == 0 ? true : false)
                    }}
                    className={`game-field__grid-element game-field__grid-element_${
                        (item.isMined && (gameOver == GameOverState.Win || gameOver == GameOverState.Lose) && (item.cellState == CellState.Defused ? 'mine-defused' : (item.boom ? 'boom' : 'mined'))) || (item.cellState == CellState.Default && "default") || (item.cellState == CellState.Defused && "defused") || ((item.cellState == CellState.Question && !item.isClear) && 'question') ||
                        (item.adjacentMines
                            ? `adjacent-mines_${item.adjacentMines}`
                            : item.isClear && (item.cellState == CellState.Question ? 'clear-question' : 'clear')) ||
                        (item.isMined && 'minned')
                    } ${item.adjacentMines && 'game-field__grid-element_adjacent-mines'}`}
                />
            ))}
        </div>
    )
}
