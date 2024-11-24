"use client";

import Sidebar from '@/components/ui/sidebar';
import { GamesPanel } from '@/components/games/games-panel';
import Navbar from '@/components/ui/navbar';
import { useState } from 'react';
import { InventoryPanel } from './inventory/inventory-panel';
import { TransactionsPanel } from './transactions/transactions-panel';
import { AiPanel } from './ai/mainMenu';
import { SwapPanel } from './swapverse/swapPanel';

const Interface: React.FC = () => {

  const [tab, setTab] = useState<any>("games");

  const updateTab = (tab) => {
    console.log("uoo", tab)
    setTab(tab);
  }

  return (
    <div className="flex flex-col">
      <Navbar updateTab={updateTab} />
      <div className="flex">
        <div className="w-1/5">
          <Sidebar />
        </div>
        <div className="w-4/5">
          {tab === "Arcade" ? (
            <GamesPanel />
          ) : tab === "MetaTreasures" ? (
            <InventoryPanel />
          ) : tab === "Metanomics" ? (
            <InventoryPanel />
          ) : tab === "Swapverse" ? (
            <SwapPanel />
          ) : tab === "Transactions" ? (
            <TransactionsPanel />
          ) : tab === "Shop" ? (
            <AiPanel />
          ) : (
            <GamesPanel />
          )}
        </div>
      </div>
    </div>
  );
};

export default Interface;
