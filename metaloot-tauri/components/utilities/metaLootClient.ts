import { addItem, getItem, getUser, startGame, stopGame } from "./nftStorageCheck";
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

export default function metaLootClient(action: string, user: User | null, data: any): MetaLootResponse {
    console.log('🌟 Welcome to MetaLoot - Your Gateway to Web3! 🚀\n',
        '⛓️ Processing ACTION:', action, '\n',
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

    // Handle different actions
    switch (action) {
        case 'get-user':
            return {
                data: getUser(user.addr),
                timestamp: new Date().toISOString(),
                status: "success"
            };

        case 'get-item':
            return {
                data: getItem(user.addr, data),
                timestamp: new Date().toISOString(),
                status: "success"
            };
        case 'start-game':
            try {
                const result = startGame();
                return {
                    data: result || "Success",
                    timestamp: new Date().toISOString(),
                    status: "success"
                };
            } catch (error) {
                return {
                    data: error,
                    timestamp: new Date().toISOString(),
                    status: "error"
                };
            };

        case 'stop-game':
            try {
                const result = stopGame();
                return {
                    data: result || "Success",
                    timestamp: new Date().toISOString(),
                    status: "success"
                };
            } catch (error) {
                return {
                    data: error,
                    timestamp: new Date().toISOString(),
                    status: "error"
                };
            };

        case 'add-item':
            try {
                const result = addItem(data.itemName, data.itemType, data.attributes, data.thumpNail);
                return {
                    data: result || "Success",
                    timestamp: new Date().toISOString(),
                    status: "success"
                };
            } catch (error) {
                return {
                    data: error,
                    timestamp: new Date().toISOString(),
                    status: "error"
                };
            };

        default:
            return {
                data: "Invalid action specified",
                timestamp: new Date().toISOString(),
                status: "error"
            };
    }
}
