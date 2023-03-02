import './GameField.scss'
import { MouseEvent } from 'react'

interface GameFieldProps {
  cellSize: number
  cellUnits: ICellUnit[]
  onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void
  onMouseUp: (cellNumber: number) => void
}

export default function GameField({
  cellSize,
  cellUnits,
  onMouseDown,
  onMouseUp,
}: GameFieldProps) {
  function handleMouseDown(e: MouseEvent<HTMLButtonElement>) {
    onMouseDown(e)
  }

  function handleMouseUp(cellNumber: number) {
    onMouseUp(cellNumber)
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
          onMouseDown={handleMouseDown}
          onMouseUp={() => handleMouseUp(index)}
          className={`game-field__grid-element game-field__grid-element_${
            (item.isClear && 'clear') || (item.isMined && 'minned')
          }`}
        />
      ))}
    </div>
  )
}
