import { getUser } from "./nftStorageCheck";
import * as fcl from "@onflow/fcl";




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

export default function metaLootClient(urls: string[], user: User | null): MetaLootResponse {
    console.log('🌟 Welcome to MetaLoot - Your Gateway to Web3! 🚀\n',
        '⛓️ Processing URLs:', urls, '\n',
        '💎 Powered by Flow Blockchain\n',
        '✨ Building the Future of Digital Assets ✨'
    );
    // Check if user is logged in
    if (!user || !user.loggedIn) {
        return {
            data: "Please login with Flow wallet",
            timestamp: new Date().toISOString(),
            status: "error",
        };
    }
    // Parse URL path and query parameters
    const processUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.toLowerCase();
            const queryParams = Object.fromEntries(urlObj.searchParams);

            if (path.includes('get-user')) {
                console.log('Getting user info...');
                // Handle user retrieval logic
                if (user.addr) {
                    getUser(user.addr);
                } else {
                    console.error('Address parameter is required for get-user endpoint');
                }
                return {
                    action: 'get-user',
                    params: queryParams
                };
            }

            if (path.includes('read-item-meta')) {
                console.log('Reading item metadata...');
                // Handle item metadata reading
                return {
                    action: 'read-item-meta',
                    params: queryParams
                };
            }

            if (path.includes('start-game')) {
                console.log('Starting new game session...');
                // Handle game start logic
                return {
                    action: 'start-game',
                    params: queryParams
                };
            }

            if (path.includes('end-game')) {
                console.log('Ending game session...');
                // Handle game end logic
                return {
                    action: 'end-game',
                    params: queryParams
                };
            }

            if (path.includes('add-item')) {
                console.log('Adding new item...', queryParams);
                // Handle item addition logic
                return {
                    action: 'add-item',
                    params: queryParams
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

    const results = urls.map(processUrl);
    return {
        data: results,
        timestamp: new Date().toISOString(),
        status: "success"
    };
}
