"use client";

import React from 'react';
import GameCard from '@/components/games/game-card';
import { InventoryItem } from '@/components/types';
import InventoryCard from './inventory-card';

// interface GamesPanelProps {
//   games: Game[];
// }



export const InventoryPanel = () => {

  const items: InventoryItem[] = [
    {
      id: "1",
      itemName: "Celestial Bow",
      itemType: "Weapon",
      attributes: {
        rarity: "Legendary",
        originGame: "Trophy Hunter",
        description: "An ancient bow imbued with starlight, each arrow leaves a trail of cosmic energy."
      },
      thumbnail: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/items/celestial-bow.png"
    },
    {
      id: "2",
      itemName: "Vorpal Blade",
      itemType: "Weapon",
      attributes: {
        rarity: "Epic",
        originGame: "Agent Town",
        description: "A dimensional-cutting sword that phases through reality itself."
      },
      thumbnail: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/items/vorpal-blade.png"
    },
    {
      id: "3",
      itemName: "Dragon Scale Armor",
      itemType: "Armor",
      attributes: {
        rarity: "Rare",
        originGame: "Noodle-Quest",
        description: "Protective armor forged from the scales of an ancient dragon."
      },
      thumbnail: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/items/dragon-scale.png"
    },
    {
      id: "4",
      itemName: "Quantum Shield",
      itemType: "Shield",
      attributes: {
        rarity: "Epic",
        originGame: "SamusVSMegaman",
        description: "A high-tech shield that can absorb and redirect energy attacks."
      },
      thumbnail: "https://eiwzivmnxlmtwrzejwdl.supabase.co/storage/v1/object/public/items/quantum-shield.png"
    }
  ];

  // Use sampleGames if no games are provided
  return (
    <div className="flex flex-wrap mx-2">
      {items.map((item) => (
        <div key={item.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 ">
          <InventoryCard {...item} />
        </div>
      ))}
    </div>
  );
};
