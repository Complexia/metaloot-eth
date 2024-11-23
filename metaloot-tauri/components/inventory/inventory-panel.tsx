"use client";

import React from 'react';
import { InventoryItem } from '@/components/types';
import InventoryCard from './inventory-card';
import * as fcl from "@onflow/fcl";
import { getAllItem } from '../utilities/nftStorageCheck';

export const InventoryPanel = () => {
  const [items, setItems] = React.useState<InventoryItem[] | null>(null);

  const fetchItems = async () => {
    try {
      const currentUser = await fcl.currentUser.snapshot();
      if (currentUser.loggedIn && currentUser.addr) {
        const items = await getAllItem(currentUser.addr);
        console.log("all items here ...... ", items);
        setItems(items);
      }
    } catch (error) {
      console.error('Failed to store NFT data:', error);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []); 
  return (
    <>
      {items && (
        <div className="flex flex-wrap mx-2">
          {items.map((item) => (
            <div key={item.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 mt-6 ">
              <InventoryCard {...item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
