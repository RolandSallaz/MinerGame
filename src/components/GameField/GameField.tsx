import './GameField.scss'

interface GameFieldProps{
    cellSize:number;
}

export default function GameField({cellSize}:GameFieldProps) {
  return (
    <div className='game-field'>
      {cellSize}
    </div>
  )
}
