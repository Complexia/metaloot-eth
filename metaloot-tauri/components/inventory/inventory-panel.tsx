"use client";

import React from 'react';
import GameCard from '@/components/games/game-card';
import { InventoryItem } from '@/components/types';
import InventoryCard from './inventory-card';
import * as fcl from "@onflow/fcl";
import { getAllItem } from '../utilities/nftStorageCheck';
import { User } from '../utilities/metaLootClient';
import { invoke } from '@tauri-apps/api/core';
// interface GamesPanelProps {
//   games: Game[];
// }

export const InventoryPanel = () => {
  const [items, setItems] = React.useState<InventoryItem[] | null>(null);

  React.useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
      console.log("user ", currentUser);
      let items = await getAllItem(currentUser.addr);
      // Store the NFT data in the backend
      try {
        await invoke('store_user_nft_data', { userNftData: JSON.stringify(items) });
      } catch (error) {
        console.error('Failed to store NFT data:', error);
      }
      setItems(items);
    });

    return () => {
      unsubscribe(); // Cleanup subscription when component unmounts
    };
  }, []); // Empty dependency array for running only on mount

  // Use sampleGames if no games are provided
  return (
    <>
      {items && (
        <div className="flex flex-wrap mx-2">
          {items.map((item) => (
            <div key={item.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 ">
              <InventoryCard {...item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
