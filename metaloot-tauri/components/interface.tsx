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
  const [userAddress, setUserAddress] = useState<string>("");
  const [tab, setTab] = useState<any>("games");
  const [sideBar, setSideBar] = useState<any>("");

  const updateTab = (tab) => {
    console.log("tab opened ", tab)
    setTab(tab);
  }

  return (
    <div className="flex flex-col">
      <Navbar updateTab={updateTab} setUserAddress={setUserAddress} />
      <div className="flex">
        <div className="w-1/5">
          <Sidebar tab={tab} setSideBar={setSideBar} />
        </div>
        <div className="w-4/5">
          {tab === "Arcade" ? (
            <GamesPanel userAddress={userAddress} />
          ) : tab === "MetaTreasures" ? (
            <InventoryPanel sideBar={sideBar} />
          ) : tab === "Metanomics" ? (
            <InventoryPanel sideBar={sideBar} />
          ) : tab === "Swapverse" ? (
            <SwapPanel />
          ) : tab === "Transactions" ? (
            <TransactionsPanel />
          ) : tab === "Shop" ? (
            <AiPanel />
          ) : (
            <GamesPanel userAddress={userAddress} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Interface;
