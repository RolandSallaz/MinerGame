import { SmileyStatus } from '../App/App'
import Counter from '../Counter/Counter'
import './Status.scss'

interface StatusProps {
  emotion: SmileyStatus
  minesCount: number
  timer:number
  onNewGameClick:()=>void
}

export default function Status({ emotion,timer,minesCount,onNewGameClick }: StatusProps) {
  return (
    <div className={`status`}>
      <Counter value={minesCount} />
      <button className={`status__button status__button_${emotion}`} onClick={onNewGameClick}/>
      <Counter value={timer} />
    </div>
  )
}
