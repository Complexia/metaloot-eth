'use client';

import { useEffect, useRef, useState } from 'react';

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Player extends GameObject {
    velocityY: number;
    isJumping: boolean;
}

interface Platform extends GameObject { }

export default function Game() {

    const [user, setUser] = useState<any | null>(null)
    const [userError, setUserError] = useState<string | null>(null)
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [gameMetadata, setGameMetadata] = useState<any>(null)
    const [nameTag, setNameTag] = useState<string>("Noob")
    const [loading, setLoading] = useState(false)
    const [nftData, setNftData] = useState<any>(null)

    const fetchUser = async () => {
        try {
            setLoading(true)
            const response = await fetch('/server/get-user-data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const userData = await response.json();
            setUser(userData);
            setUserError(null); // Clear any previous errors

            const nft_response = await fetch('/server/get-user-nfts');
            if (!nft_response.ok) {
                throw new Error(`HTTP error! status: ${nft_response.status}`);
            }
            const nftData = await nft_response.json();
            console.log("nft data: ", nftData)
            setNftData(nftData)
            nftData.forEach((nft: any) => {
                console.log("nft: ", nft)
                console.log("nft name: ", nft.name)
                if (nft.name === "Boxing Gloves") {
                    setNameTag("Champion");
                }
            });

            setLoading(false)
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserError(error instanceof Error ? error.message : 'Failed to fetch user data');
            setLoading(false)
        }
    }

    

    // Add user fetch effect
    useEffect(() => {
        fetchUser()
    }, [])

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playerRef = useRef<Player>({
        x: 100,
        y: 300,
        width: 30,
        height: 30,
        velocityY: 0,
        isJumping: false,
    });

    const [platforms] = useState<Platform[]>([
        { x: -1000, y: 450, width: 3000, height: 20 },
        { x: 100, y: 400, width: 200, height: 20 },
        { x: 400, y: 350, width: 200, height: 20 },
        { x: 700, y: 400, width: 200, height: 20 },
        { x: 1000, y: 300, width: 200, height: 20 },
    ]);

    const gravity = 0.4;
    const jumpForce = -15;
    const moveSpeed = 12;

    const keysRef = useRef<{ [key: string]: boolean }>({});

    const cameraOffsetRef = useRef(0);

    const resetGame = () => {
        playerRef.current = {
            x: 100,
            y: 300,
            width: 30,
            height: 30,
            velocityY: 0,
            isJumping: false,
        };
        cameraOffsetRef.current = 0;
        keysRef.current = {};
    };

    const initializeGame = async () => {
        if (!user) {
            setUserError("Please log in with Metaloot to play");
            return;
        }

        try {
            const response = await fetch('/server/game/start');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // const metadata = await response.json();
            // setGameMetadata(metadata);
            
            // Reset game state
            resetGame();
            setIsGameStarted(true);
        } catch (error) {
            console.error('Error starting game:', error);
            setUserError(error instanceof Error ? error.message : 'Failed to start game');
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isGameStarted) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (!playerRef.current.isJumping) {
                        playerRef.current.velocityY = jumpForce;
                        playerRef.current.isJumping = true;
                    }
                    break;
            }
        };

        const handleKeyPress = (e: KeyboardEvent) => {
            keysRef.current[e.key] = true;
        };

        const handleKeyRelease = (e: KeyboardEvent) => {
            keysRef.current[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);
        window.addEventListener('keydown', handleKeyDown);

        const gameLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update player position
            let newPlayer = { ...playerRef.current };

            // Handle horizontal movement
            if (keysRef.current.ArrowRight) {
                newPlayer.x += moveSpeed;
                if (newPlayer.x > canvas.width / 2) {
                    cameraOffsetRef.current += moveSpeed;
                    newPlayer.x = canvas.width / 2;
                }
            }
            if (keysRef.current.ArrowLeft) {
                newPlayer.x -= moveSpeed;
                if (newPlayer.x < 0) {
                    newPlayer.x = 0;
                }
            }

            // Apply gravity
            newPlayer.velocityY = Math.min(newPlayer.velocityY + gravity, 12);
            newPlayer.y += newPlayer.velocityY;

            // Check platform collisions
            let onPlatform = false;
            platforms.forEach(platform => {
                const adjustedPlatformX = platform.x - cameraOffsetRef.current;
                if (
                    newPlayer.x < adjustedPlatformX + platform.width &&
                    newPlayer.x + newPlayer.width > adjustedPlatformX &&
                    newPlayer.y + newPlayer.height > platform.y &&
                    newPlayer.y + newPlayer.height < platform.y + platform.height + newPlayer.velocityY
                ) {
                    newPlayer.y = platform.y - newPlayer.height;
                    newPlayer.velocityY = 0;
                    newPlayer.isJumping = false;
                    onPlatform = true;
                }
            });

            playerRef.current = newPlayer;

            // Draw player
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(newPlayer.x, newPlayer.y, newPlayer.width, newPlayer.height);

            // Draw player name
            ctx.fillStyle = '#FF0000';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(nameTag, newPlayer.x + newPlayer.width / 2, newPlayer.y - 10);

            // Draw platforms
            ctx.fillStyle = '#795548';
            platforms.forEach(platform => {
                const adjustedX = platform.x - cameraOffsetRef.current;
                ctx.fillRect(adjustedX, platform.y, platform.width, platform.height);
            });

            requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyRelease);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isGameStarted]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-base-200">
            {userError ? (
                <div className="alert alert-error mb-4 max-w-xl w-full">
                    <span>{userError}</span>
                    <button 
                        onClick={fetchUser}
                        className="btn btn-sm btn-outline"
                    >
                        Retry
                    </button>
                </div>
            ) : user && (
                <div className="alert alert-info mb-4 max-w-xl w-full">
                    <div>
                        <p>Player Address: {user.addr}</p>
                        {user.cid && <p>CID: {user.cid}</p>}
                    </div>
                </div>
            )}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Crazy Jumper</h2>
                        <div className="flex gap-2">
                            {!isGameStarted ? (
                                <button
                                    onClick={initializeGame}
                                    className="btn btn-sm btn-primary"
                                    disabled={!user}
                                >
                                    Start Game
                                </button>
                            ) : (
                                <button
                                    onClick={resetGame}
                                    className="btn btn-sm btn-outline"
                                >
                                    Reset Game
                                </button>
                            )}
                        </div>
                    </div>
                    {isGameStarted && (
                        <>
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={500}
                                className="border border-base-300 rounded-lg"
                            />
                            <div className="text-sm mt-4 text-center text-base-content/70">
                                Use arrow keys to move and jump
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
