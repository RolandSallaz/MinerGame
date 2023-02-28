import './Header.scss'

interface HeaderProps {
  children?: React.ReactNode
}
export default function Header({ children }: HeaderProps) {
  return (
    <header className="status">
      <div className="status__containter">{children}</div>
    </header>
  )
}
