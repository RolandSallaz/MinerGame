import './Counter.scss'
import { useMemo } from 'react'

interface CounterProps {
  value: number
}

function Counter({ value }: CounterProps) {
  const imageUrl = process.env.PUBLIC_URL + '/images/'

  const counterDigits = useMemo(() => {
    const digits = []
    let currentValue = value
    for (let i = 0; i < 3; i++) {
      const digit = currentValue % 10
      digits.push(
        <li key={i}>
          <div
            className="counter__digit"
            style={{
              backgroundImage: `url(${imageUrl}${digit}.png)`,
            }}
          />
        </li>,
      )
      currentValue = Math.floor(currentValue / 10)
    }
    return digits.reverse()
  }, [value])

  return (
    <>
      <ul className="counter__list">{counterDigits}</ul>
    </>
  )
}
export default Counter
