import { MouseEventHandler } from 'react'
import './GameField.scss'
import { MouseEvent } from 'react'
import { SmileyStatus } from '../App/App'

interface GameFieldProps {
  cellSize: number
  cellUnits: ICellUnit[]
  onCellUnitClick: (cellNumber: number) => void
  changeSmiley: (emotion: SmileyStatus) => void
}

export default function GameField({
  cellSize,
  cellUnits,
  onCellUnitClick,
  changeSmiley,
}: GameFieldProps) {

  function mouseUpEventListener(){
    changeSmiley(SmileyStatus.Normal)
    document.removeEventListener('mouseup',mouseUpEventListener)
  }

  function handleMouseDown(e: MouseEvent<HTMLButtonElement>) {
    changeSmiley(SmileyStatus.Scared)
    document.addEventListener('mouseup',mouseUpEventListener)
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
          className={`game-field__grid-element game-field__grid-element_${
            (item.isClear && 'clear') || (item.isMined && 'minned')
          }`}
          onClick={() => {
            onCellUnitClick(item.cellNumber)
          }}
        />
      ))}
    </div>
  )
}
