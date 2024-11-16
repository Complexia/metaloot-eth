"use client";

import { Game } from "@/components/types";
import { open, Command } from '@tauri-apps/plugin-shell'
import ThreeComponent from "../ai/ThreeComponent";


const AiCard = (game: Game) => {
    // Function to open external URI using Tauri shell
    const openExternalUri = async () => {
        // try {
        //     // Execute the cd command in a new terminal window
        //     const cdOutput = await Command.sidecar('run-trophyhunter')
        //         .execute();
        //     console.log('CD command output:', cdOutput);
            
        //     // Execute cargo tauri dev in a new terminal window
        //     const cargoOutput = await Command.sidecar('run-cargo-tauri')
        //         .execute();
        //     console.log('Cargo command output:', cargoOutput);
        // } catch (error) {
        //     console.error('Failed to execute command:', error);
        // }
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
            className="card bg-base-100 shadow-xl  h-96 cursor-pointer">
            <figure className="h-1/2">
                {/* <img
                    src={game.media}
                    alt="Shoes"
                    className="w-full h-full object-cover"
                /> */}
                <ThreeComponent chatBotState={game.media} actions={game.actions}/>
            </figure>
            <div className="card-body h-1/2 flex flex-col">
                <h2 className="card-title text-lg">
                    {truncateText(game.title, 30)}
                    <div className="badge badge-secondary">Unity</div>
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

export default AiCard;
