"use client";

import React from 'react';
import GameCard from '@/components/games/game-card';
import { InventoryItem } from '@/components/types';
import InventoryCard from './inventory-card';
import * as fcl from "@onflow/fcl";
import { getAllItem } from '../utilities/nftStorageCheck';
import { User } from '../utilities/metaLootClient';
// interface GamesPanelProps {
//   games: Game[];
// }

export const InventoryPanel = () => {
  const [items, setItems] = React.useState<InventoryItem[] | null>(null);

  React.useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
      console.log("user ", currentUser);
      let items = await getAllItem(currentUser.addr);
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
