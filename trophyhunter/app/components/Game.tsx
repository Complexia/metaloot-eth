'use client'

import { useState, useEffect } from 'react'
import Map from './Map'
import Character from './Character'
import Trophy from './Trophy'
// import { open } from '@tauri-apps/plugin-shell'

// import { invoke } from '@tauri-apps/api/core';


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
  const [user, setUser] = useState<any | null>(null)
  const [userError, setUserError] = useState<string | null>(null)
  const [gameMetadata, setGameMetadata] = useState<any>(null)

  // Move fetchUser outside useEffect
  const fetchUser = async () => {
    try {
      const response = await fetch('/server/get-user-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
      setUserError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserError(error instanceof Error ? error.message : 'Failed to fetch user data');
    }
  }

  // Add user fetch effect
  useEffect(() => {
    fetchUser()
  }, [])

  // Initialize terrain immediately
  useEffect(() => {
    const newTerrain: TerrainType[][] = Array(10).fill(null).map(() =>
      Array(10).fill(null).map(() => {
        const random = Math.random()
        if (random < 0.7) return 'grass'
        if (random < 0.85) return 'tree'
        return 'river'
      })
    )
    newTerrain[5][5] = 'grass'
    setTerrain(newTerrain)

    let tx, ty
    do {
      tx = Math.floor(Math.random() * 10)
      ty = Math.floor(Math.random() * 10)
    } while (newTerrain[ty][tx] !== 'grass')
    
    setTrophyPos({ x: tx * 50, y: ty * 50 })
    setCharacterPos({ x: 50, y: 50 })
  }, []) // Run once on component mount

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

        // Stop moving if we're close enough to target
        if (distance < 2) {
          clearInterval(interval)
          setTargetPos(null) // Clear the target once reached
          return current // Keep current position
        }

        const speed = 2 // Increased speed to reduce number of updates
        const newX = current.x + (dx / distance) * speed
        const newY = current.y + (dy / distance) * speed

        // Check trophy collection only when very close
        if (trophyPos && !hasTrophy) {
          const trophyDistance = Math.sqrt(
            Math.pow(newX - trophyPos.x, 2) + 
            Math.pow(newY - trophyPos.y, 2)
          )
          if (trophyDistance < 20) {
            const payload = {
                "itemName": "The Mike Tyson",
                "itemType": "Gloves",
                "attributes": {
                    "key": "Creativity",
                    "value": "100%"
                },
                "thumpNail": "rgb(0, 255, 255)"
            
            }
            fetch('/server/item/add', {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(() => {
                setHasTrophy(true)
                setTrophyPos(null)
              })
              .catch(error => {
                console.error("Failed to open metaloot:", error)
              });
          }
        }

        return { x: newX, y: newY }
      })
    }, 33) // Reduced update frequency (approximately 30 FPS instead of 60)

    return () => clearInterval(interval)
  }, [targetPos, trophyPos, hasTrophy])

  // Add resetGame function
  const resetGame = () => {
    setHasTrophy(false)
    setTargetPos(null)
    
    // Reset terrain and positions
    const newTerrain: TerrainType[][] = Array(10).fill(null).map(() =>
      Array(10).fill(null).map(() => {
        const random = Math.random()
        if (random < 0.7) return 'grass'
        if (random < 0.85) return 'tree'
        return 'river'
      })
    )
    newTerrain[5][5] = 'grass'
    setTerrain(newTerrain)

    // Spawn new trophy on grass
    let tx, ty
    do {
      tx = Math.floor(Math.random() * 10)
      ty = Math.floor(Math.random() * 10)
    } while (newTerrain[ty][tx] !== 'grass')
    
    setTrophyPos({ x: tx * 50, y: ty * 50 })
    setCharacterPos({ x: 50, y: 50 })
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* User Info Section */}
      <div className="w-[500px] mb-4">
        {userError ? (
          <div className="p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
            {userError}
            <button 
              onClick={() => fetchUser()} 
              className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        ) : user ? (
          <div className="p-3 bg-blue-100 text-blue-700 rounded-md">
            <p>Player Address: {user.addr}</p>
            {user.cid && <p>CID: {user.cid}</p>}
          </div>
        ) : (
          <div className="p-3 bg-gray-100 text-gray-700 rounded-md">
            Loading player details...
          </div>
        )}
      </div>

      {/* Game Content - Modified to always show map */}
      <div className="w-[500px] h-[500px] border-2 border-gray-400">
        <div className="relative w-full h-full" onClick={handleMapClick}>
          <Map terrain={terrain} />
          <Character position={characterPos} hasTrophy={hasTrophy} />
          {trophyPos && <Trophy position={trophyPos} />}
        </div>
      </div>
      
      {/* Trophy Status and Reset Button */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm text-gray-600">
          {hasTrophy 
            ? "You got the trophy! 🏆 Your rare sword has been added to your inventory."
            : "Find and collect the trophy to receive a rare sword!"}
        </div>
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}

export default Game 