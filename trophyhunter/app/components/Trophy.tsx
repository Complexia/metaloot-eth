import { Position } from './Game'

type TrophyProps = {
  position: Position
}

const Trophy = ({ position }: TrophyProps) => {
  return (
    <div
      className="absolute w-8 h-8 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <span className="text-2xl">🏆</span>
    </div>
  )
}

export default Trophy 