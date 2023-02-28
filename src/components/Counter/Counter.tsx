import './Counter.scss'
import test from '../../images/1.png'

interface CounterProps {
  value: number
}

export default function Counter({ value }: CounterProps) {
  return (
    <>
      <ul className="counter__list">
        <li>
          <div
            className="counter__digit"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/images/${
                value >= 100 ? String(value)[0] : 0
              }.png)`,
            }}
          />
        </li>
        <li>
          <div
            className="counter__digit"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/images/${
                value % 100 >= 10 ? String(value % 100)[0] : 0
              }.png)`,
            }}
          />
        </li>
        <li>
          <div
            className="counter__digit"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/images/${
                value % 10
              }.png)`,
            }}
          />
        </li>
      </ul>
    </>
  )
}
