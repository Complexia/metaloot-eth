import { Position } from './Game'

type CharacterProps = {
  position: Position
  hasTrophy: boolean
}

const Character = ({ position, hasTrophy }: CharacterProps) => {
  return (
    <div
      className={`absolute w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2 
        flex items-center justify-center text-2xl
        ${hasTrophy ? 'bg-yellow-500' : 'bg-red-500'}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {hasTrophy ? '🤴' : '🧑'}
    </div>
  )
}

export default Character 