import { invoke } from '@tauri-apps/api/core';

interface ApiResponse<T> {
    data: T;
    timestamp: string;
    status: string;
}

interface User {
    logged_in: boolean;
    address: string;
}

interface ItemMetadata {
    name: string;
    item_type: string;
    rarity: string;
}

interface GameSession {
    session_id: string;
    user_address: string;
    start_time: string;
}

export async function getUserInfo(address: string): Promise<ApiResponse<User>> {
    return await invoke('get_user_info', { address });
}

export async function getItemMetadata(itemId: string, userAddress: string): Promise<ApiResponse<ItemMetadata>> {
    return await invoke('get_item_metadata', { itemId, userAddress });
}

export async function startGameSession(userAddress: string): Promise<ApiResponse<GameSession>> {
    return await invoke('start_game_session', { userAddress });
}

export async function endGameSession(sessionId: string, userAddress: string): Promise<ApiResponse<string>> {
    return await invoke('end_game_session', { sessionId, userAddress });
}

export async function addItem(
    userAddress: string, 
    item: ItemMetadata
): Promise<ApiResponse<ItemMetadata>> {
    return await invoke('add_item', { userAddress, item });
} 