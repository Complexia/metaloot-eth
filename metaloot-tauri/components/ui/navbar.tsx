'use client';

import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import * as fcl from "@onflow/fcl";
import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
// Import Flow configuration
import { addItem, mintNFT, startGame, stopGame, transferNFT, userStorageCheck } from '@/components/utilities/nftStorageCheck';
import { useUser } from '../context/UserContext';
import metaLootClient, { processUrl, User } from '../utilities/metaLootClient';
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core';
import WebSocket from '@tauri-apps/plugin-websocket'

const Navbar = ({ updateTab, setUserAddress }) => {
  const { user, setUser } = useUser();
  // possibly don't need -> only need to send Message Back
  const [ws, setWs] = useState<WebSocket | null>(null); // Store WebSocket instance 
  const [isLoading, setIsLoading] = useState(false);

  /****************************************************
   * 🎮 WEBSOCKET GAME STATE SYNCHRONIZATION 🎮
   * ==========================================
   * 
   * 🔌 Real-time connection to game server
   * 👥 Handles multiplayer interactions
   * 🎯 Manages player state updates
   * 
   * 🔗 Flow Blockchain Integration:
   * - Verifies asset ownership
   * - Secures in-game items
   * - Enables NFT minting
   ****************************************************/
  const setupWebSocket = async (address: string) => {
    try {
      const connection = await WebSocket.connect(`ws://localhost:8000/websocket/${address}`);
      setWs(connection);
      // Add message listener
      connection.addListener((msg) => {
        console.log('Received Message From WebSocket: ', msg);
        // Check if msg.data exists and is exactly "game-start"
        if (msg.data && msg.data === "game-start") {
          console.log('Game started!');
          startGame();
          // Add game start logic here
        } else if (msg.data && msg.data === "game-end") {
          console.log('Game Ended!');
          stopGame();
          // Add game end logic here
        } else {
          console.log("ELSE ......");
          let data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
          // Add mint NFT logic here
          console.log('Item Minting ! ', data);
          const payload = data as {
            itemName: string;
            itemType: string,
            attributes: object,
            thumpNail: string
          };
          mintNFT(payload.itemName, payload.itemType, payload.attributes, payload.thumpNail);
        }
      });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await fcl.authenticate();
      console.log("logging in...")
      setIsLoading(true);
      fcl.currentUser.subscribe(async (currentUser: User) => {
        setUser(currentUser);
        setUserAddress(currentUser.addr);
        console.log("set this to current user ", currentUser);
        if (currentUser.loggedIn) {
          setupWebSocket(currentUser.addr);
          await userStorageCheck();
        }
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  const handleLogout = () => {
    fcl.unauthenticate();
    setUser({ addr: "", loggedIn: false });
  };

  return (
    <nav className="navbar bg-base-200">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="flex flex-col items-center gap-4">
            {/* <div className="loading loading-spinner loading-lg text-primary"></div> */}
            <div className="loading loading-ring loading-lg text-secondary"></div>
            <p className="text-lg font-semibold animate-pulse text-white">Please allow apps permission on your wallet...</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between w-full px-4">
          {/* First sector: Avatar and Welcome */}
          <div className="flex items-center">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                {user?.loggedIn ? (
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src="https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/profile_media/7294811" alt="User Avatar" />
                    </div>
                  </div>
                ) : (
                  <FaUserCircle className="text-2xl" />
                )}

              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Profile</a></li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
              </ul>
            </div>
            {user?.loggedIn && (
              <div className="ml-2">
                <h2>Welcome, {user.addr}</h2>
              </div>
            )}
          </div>

          {/* Second sector: Navigation Links */}

          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><span onClick={() => updateTab("Arcade")}>Arcade</span></li>
              <li><span onClick={() => updateTab("MetaTreasures")}>MetaTreasures</span></li>
              <li><span onClick={() => updateTab("Swapverse")}>Swapverse</span></li>
              {/* <li><span onClick={() => updateTab("Metanomics")}>Metanomics</span></li> */}
              <li><span className="opacity-50 cursor-not-allowed">Metanomics</span></li>
              {/* <li><span onClick={() => updateTab("Transactions")}>Transactions</span></li> */}
              <li><span className="opacity-50 cursor-not-allowed">Transactions</span></li>
              {/* <li><span onClick={() => updateTab("Shop")}>Shop</span></li> */}
              <li><span className="opacity-50 cursor-not-allowed">Shop</span></li>
            </ul>
          </div>

          {/* Third sector: Login/Logout */}
          <div className="flex-none">
            {user?.loggedIn ? (
              <button onClick={handleLogout} className="btn btn-ghost">
                Logout
              </button>
            ) : (
              <button onClick={handleLogin} className="btn btn-ghost">
                Login with Flow Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
