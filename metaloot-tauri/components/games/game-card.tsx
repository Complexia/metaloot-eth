"use client";

import { Game } from "@/components/types";
import { open } from '@tauri-apps/plugin-shell'

const GameCard = (game: Game) => {
    // Function to open external URI using Tauri shell
    const openExternalUri = async () => {
        try {
            console.error('Try to open URI:', game.uri);
            await open(game.uri);
        } catch (error) {
            console.error('Failed to open URI:', error);
            // Fallback to window.open for web
            window.open(game.uri, '_blank');
        }
    };
    // Function to truncate text
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <div
            key={game.id}
            onClick={async () => {
                // Handle click event for the game card
                console.log(`Clicked game: ${game.title}`);
                await openExternalUri();
            }}
            className="card bg-base-100 shadow-xl  h-96">
            <figure className="h-1/2">
                <img
                    src={game.media}
                    alt="Shoes"
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body h-1/2 flex flex-col">
                <h2 className="card-title text-lg">
                    {truncateText(game.title, 30)}
                    <div className="badge badge-secondary">Game</div>
                </h2>
                <p className="flex-grow overflow-hidden">
                    {truncateText(game.description, 60)}
                </p>
                {/* <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                </div> */}
            </div>
        </div>
    );
};

export default GameCard;
