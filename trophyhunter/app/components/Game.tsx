'use client'

import { useState, useEffect } from 'react'
import Map from './Map'
import Character from './Character'
import Trophy from './Trophy'

export type Position = {
  x: number
  y: number
}

export type TerrainType = 'grass' | 'tree' | 'river'

export const Game = () => {
  const [characterPos, setCharacterPos] = useState<Position>({ x: 50, y: 50 })
  const [targetPos, setTargetPos] = useState<Position | null>(null)
  const [trophyPos, setTrophyPos] = useState<Position | null>(null)
  const [hasTrophy, setHasTrophy] = useState(false)
  const [terrain, setTerrain] = useState<TerrainType[][]>([])

  // Initialize terrain and trophy position
  useEffect(() => {
    const newTerrain: TerrainType[][] = Array(10).fill(null).map(() =>
      Array(10).fill(null).map(() => {
        const random = Math.random()
        if (random < 0.7) return 'grass'
        if (random < 0.85) return 'tree'
        return 'river'
      })
    )
    // Ensure starting position is grass
    newTerrain[5][5] = 'grass'
    setTerrain(newTerrain)

    // Place trophy randomly on grass
    let tx, ty
    do {
      tx = Math.floor(Math.random() * 10)
      ty = Math.floor(Math.random() * 10)
    } while (newTerrain[ty][tx] !== 'grass')
    
    setTrophyPos({ x: tx * 50, y: ty * 50 })
  }, [])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    
    // Calculate position relative to the game container
    const x = e.clientX - rect.left - target.clientLeft;
    const y = e.clientY - rect.top - target.clientTop;
    
    // Ensure we're within bounds
    if (x < 0 || x > 500 || y < 0 || y > 500) return;
    
    const tileX = Math.floor(x / 50);
    const tileY = Math.floor(y / 50);
    
    if (terrain[tileY]?.[tileX] === 'grass') {
      // Calculate center of the clicked tile
      const centerX = (tileX * 50) + 25;
      const centerY = (tileY * 50) + 25;
      setTargetPos({ x: centerX, y: centerY });
    }
  }

  // Move character towards target
  useEffect(() => {
    if (!targetPos) return

    const interval = setInterval(() => {
      setCharacterPos(current => {
        if (!targetPos) return current

        const dx = targetPos.x - current.x
        const dy = targetPos.y - current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 2) {
          clearInterval(interval)
          return targetPos
        }

        const speed = 2
        const newX = current.x + (dx / distance) * speed
        const newY = current.y + (dy / distance) * speed

        // Check if character reached trophy
        if (trophyPos && !hasTrophy) {
          const trophyDistance = Math.sqrt(
            Math.pow(newX - trophyPos.x, 2) + 
            Math.pow(newY - trophyPos.y, 2)
          )
          if (trophyDistance < 20) {
            setHasTrophy(true)
            setTrophyPos(null)
          }
        }

        return { x: newX, y: newY }
      })
    }, 16)

    return () => clearInterval(interval)
  }, [targetPos, trophyPos, hasTrophy])

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative w-[500px] h-[500px] border-2 border-gray-400" onClick={handleMapClick}>
        <Map terrain={terrain} />
        <Character position={characterPos} hasTrophy={hasTrophy} />
        {trophyPos && <Trophy position={trophyPos} />}
      </div>
      {hasTrophy && (
        <div className="text-xl text-success">You got the trophy! 🏆</div>
      )}
    </div>
  )
}

export default Game 