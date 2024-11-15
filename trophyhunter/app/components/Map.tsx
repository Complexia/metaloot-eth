import { TerrainType } from './Game'

type MapProps = {
  terrain: TerrainType[][]
}

const Map = ({ terrain }: MapProps) => {
  return (
    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
      {terrain.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`
              border border-gray-300
              ${cell === 'grass' && 'bg-green-500 flex items-center justify-center'}
              ${cell === 'tree' && 'bg-green-800 flex items-center justify-center'}
              ${cell === 'river' && 'bg-blue-500 flex items-center justify-center'}
            `}
          >
            {cell === 'tree' && <span className="text-2xl">🌳</span>}
            {cell === 'river' && <span className="text-2xl">💧</span>}
          </div>
        ))
      )}
    </div>
  )
}

export default Map 