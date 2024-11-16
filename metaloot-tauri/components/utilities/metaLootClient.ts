import { getUser, userStorageCheck } from "./nftStorageCheck";
import * as fcl from "@onflow/fcl";
// import express from 'express';
// import metaLootRoutes from './metalootRoutes';
import { listen } from '@tauri-apps/api/event'
import { getAllItem } from '../utilities/nftStorageCheck';
import { invoke } from "@tauri-apps/api/core";




// ╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
// ║                                     MetaLoot Client SDK                                          ║
// ║                                                                                                  ║
// ║ 🎮 A powerful bridge between game studios and Flow blockchain                                    ║
// ║ 🔗 Seamlessly interact with Flow smart contracts                                                 ║
// ║ 🚀 Features:                                                                                     ║
// ║    - User Authentication & Management                                                            ║
// ║    - NFT Metadata Reading & Writing                                                             ║
// ║    - Game Session Handling                                                                      ║
// ║    - Real-time Blockchain Updates                                                               ║
// ║                                                                                                  ║
// ║ 🛠️  Built with TypeScript for type-safe blockchain interactions                                 ║
// ║ 🔒 Security-first design with robust error handling                                             ║
// ║                                                                                                  ║
// ║ 📝 Usage Example of shell command:                                                                               ║
// ║    open "metaloot://callback/add-item?name=Sword&type=weapon&rarity=rare"                             ║
// ║    This deep link adds a rare weapon type NFT to player's inventory                            ║
// ║                                                                                                  ║
// ║ © 2024 MetaLoot - Empowering Game Developers in the Web3 Space                                  ║
// ╚══════════════════════════════════════════════════════════════════════════════════════════════════╝


export interface MetaLootResponse {
    data: any;
    timestamp: string;
    status: "success" | "error";
}

export interface User {
    addr: string;
    cid?: string;
    expiresAt?: number;
    f_type?: string;
    f_vsn?: string;
    loggedIn?: boolean;
    services?: Array<object>;
}

// Extract and export the processUrl function
export const processUrl = (url: string, user: User | null) => {
    try {
        // const urlObj = new URL(url);
        // const path = urlObj.pathname.toLowerCase();
        // const queryParams = Object.fromEntries(urlObj.searchParams);

        // if (!user || !user.loggedIn) {
        //     return {
        //         action: 'error',
        //         error: 'Please login with Flow wallet'
        //     };
        // }

        let path = url;

        console.log("PATH1", path)



        if (path === 'get-stored-user') {
            console.log('Getting stored user info...');
            // Handle user retrieval logic
            // if (user.addr) {
            //     getUser(user.addr);
            // } else {
            //     console.error('Address parameter is required for get-user endpoint');
            // }
            return {
                action: 'get-stored-user',
                user: user
            };
        }


        if (path === 'get-user-nfts') {
            console.log('Getting user nfts...');

            const subscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
                console.log("this is sub user ", currentUser);
                let items = await getAllItem(currentUser.addr);

                console.log("itemsss", items)
                let resp = await invoke("store_user_nft_data", { userNftData: JSON.stringify(items) });
                console.log("this is the response from the store_user_data", resp);

                console.log("invoking update complete")
                let resp_complete = await invoke("update_completed");



            });


            // Handle user retrieval logic
            // if (user.addr) {
            //     getUser(user.addr);
            // } else {
            //     console.error('Address parameter is required for get-user endpoint');
            // }
            return {
                action: 'get-user-nfts',
                user: user
            };
        }

        // if (path === 'get-user') {
        //     console.log('Getting user info...');
        //     // Handle user retrieval logic
        //     if (user.addr) {
        //         getUser(user.addr);
        //     } else {
        //         console.error('Address parameter is required for get-user endpoint');
        //     }
        //     return {
        //         action: 'get-user',
        //         user: user.addr
        //     };
        // }

        if (path == 'read-item-meta') {
            console.log('Reading item metadata...');
            // Handle item metadata reading
            return {
                action: 'read-item-meta',
            };
        }

        //handle start game logic
        if (path == 'start-game') {
            console.log('Starting new game session...');
            let currentUser = fcl.currentUser();
            const subscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
                console.log("this is sub user ", currentUser);
                console.log("this is user ", currentUser);
                if (currentUser.loggedIn) {
                    // Ensure account is set up to receive NFTs

                    await userStorageCheck();
                    // setError(""); // Clear any previous errors


                }

            });



            console.log("currentUser inside start game", currentUser);
            return {
                action: 'start-game',
                user: currentUser
            };
        }

        if (path == 'end-game') {
            console.log('Ending game session...');

            console.log('Starting new game session...');
            let currentUser = fcl.currentUser();
            const subscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
                console.log("this is sub user ", currentUser);


            });

            console.log("currentUser inside start game", currentUser);

            // Handle game end logic
            return {
                action: 'end-game',
            };
        }

        if (path == 'add-item') {
            console.log('Adding new item...');
            // Handle item addition logic

            console.log('Starting new game session...');
            let currentUser = fcl.currentUser();
            const subscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
                console.log("this is sub user ", currentUser);


            });



            console.log("currentUser inside start game", currentUser);


            return {
                action: 'add-item',
                // params: queryParams
            };
        }

        console.warn('Unknown endpoint:', path);
        return {
            action: 'unknown',
            path: path
        };

    } catch (error) {
        console.error('Error processing URL:', error);
        return {
            action: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

export default function metaLootClient(urls: string[], user: User | null): MetaLootResponse {
    console.log('🌟 Welcome to MetaLoot - Your Gateway to Web3! 🚀\n',
        '⛓️ Processing URLs:', urls, '\n',
        '💎 Powered by Flow Blockchain\n',
        '✨ Building the Future of Digital Assets ✨'
    );
    // Check if user is logged in
    console.log("user inside metaLootClient ", user);





    if (!user || !user.loggedIn) {
        return {
            data: "Please login with Flow wallet",
            timestamp: new Date().toISOString(),
            status: "error",
        };
    }

    const results = urls.map(url => processUrl(url, user));
    return {
        data: results,
        timestamp: new Date().toISOString(),
        status: "success"
    };
}
