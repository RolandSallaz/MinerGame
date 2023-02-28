import './Status.scss'

interface StatusProps {
  children?: React.ReactNode
}
export default function Status({ children }: StatusProps) {
  return (
    <div className="status">
      {children}
    </div>
  )
}
