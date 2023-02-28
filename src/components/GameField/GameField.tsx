import { MouseEventHandler } from 'react'
import './GameField.scss'
import {MouseEvent} from 'react'
interface GameFieldProps {
  cellSize: number,
  cellUnits: ICellUnit[]
  onCellUnitClick: (cellNumber:number) => void
}

export default function GameField({ cellSize,cellUnits, onCellUnitClick }: GameFieldProps) {

  return (
    <div
      className="game-field"
      style={{
        gridTemplateColumns: `repeat(${cellSize},1fr)`,
        gridTemplateRows: `repeat(${cellSize},1fr)`,
      }}
    >
      {cellUnits.map((item, index) => (
        <button key={index} className={`game-field__grid-element game-field__grid-element_${item.isClear && 'clear' || item.isMined && 'minned'}`} onClick={()=>{onCellUnitClick(item.cellNumber)}} />
      ))}
    </div>
  )
}
