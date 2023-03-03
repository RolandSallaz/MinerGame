import {CellState} from "./components/App/App";

export interface ICellUnit {
  cellNumber: number
  isMined: boolean
  isClear: boolean
  adjacentMines?: number
  cellState?: CellState | null
  boom?: boolean
}
