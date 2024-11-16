'use client';

import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import * as fcl from "@onflow/fcl";
import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
// Import Flow configuration
import { mintNFT, stopGame, userStorageCheck } from '@/components/utilities/nftStorageCheck';
import { useUser } from '../context/UserContext';
import metaLootClient, { User } from '../utilities/metaLootClient';
// Define the User type based on FCL's user state

const Navbar: React.FC = () => {
  const { user, setUser } = useUser();

  const listener = async () => {
    await onOpenUrl(async (urls: string[]) => {
      console.log('deep link:', urls)
      // const res = metaLootClient(urls, user);
      // console.log("this is meta response ", res);
    })
  };

  const [isLoading, setIsLoading] = useState(false);
  // const [user, setUser] = useState<User>({ addr: "", loggedIn: false });
  useEffect(() => {
    listener();
    // Subscribe to user state'
    //"@ts-expect-error"
    const unsubscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
      console.log("this is user ", currentUser);
      if (currentUser.loggedIn) {
        await userStorageCheck();
        setUser(currentUser);
        // Ensure account is set up to receive NFTs
        setIsLoading(true);
        setIsLoading(false);
        // setError(""); // Clear any previous errors
      } else {
        setUser({ addr: "", loggedIn: false });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await fcl.authenticate();
      fcl.currentUser.subscribe(async (currentUser: User) => {
        setIsLoading(true);
        setUser(user);
      });
    } catch (err) {
      console.error("Authentication failed:", err);
      // setError("Authentication failed. Please try again.");
    }
  };

  const handleLogout = () => {
    fcl.unauthenticate();
  };

  const readUser = () => {
    console.log("current user trace ", user);
    const res = metaLootClient("get-user", user, "Welcome To MetaLoot");
    console.log("this is meta response ", res);
  };
  const setPathUser = async () => {
    const res = await userStorageCheck();
    console.log(" testing settingPath, ", res);
  };
  const startGame = () => {
    console.log("current user trace ", user);
    const res = metaLootClient("start-game", user, "Welcome To MetaLoot");
    console.log("this is meta response ", res);
  };
  const addItem = (itemName: string, itemType: string, attributes: object, thumpNail: string) => {
    console.log("current user trace ", user);
    const res = metaLootClient("add-item", user, {
      itemName: itemName,
      itemType: itemType,
      attributes: attributes,
      thumpNail: thumpNail
    });
    console.log("this is meta response ", res);
  };
  const endGame = () => {
    console.log("current user trace ", user);
    const res = metaLootClient("stop-game", user, "Welcome To MetaLoot");
    console.log("this is meta response ", res);
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
              <li><Link href="/games">Games</Link></li>
              <li><Link href="/inventory">Inventory</Link></li>
              <li><Link href="/shop">Shop</Link></li>
            </ul>
          </div>

          {/* Third sector: Login/Logout */}
          <div className="flex-none">
            {user?.loggedIn ? (

              // <button onClick={handleLogout} className="btn btn-ghost">
              //   Logout
              // </button>
              <>
                <button onClick={handleLogout} className="btn btn-ghost">
                  Logout
                </button>
                <button onClick={readUser} className="btn btn-ghost">
                  Test: ReadNFTCollectionFromUser
                </button>
                <button onClick={setPathUser} className="btn btn-ghost">
                  Test: SetupCollectionPath
                </button>
                <button onClick={startGame} className="btn btn-ghost">
                  Test: StartGame
                </button>
                <button onClick={() => addItem(
                  "Mystical Sword",
                  "Sword",
                  {
                    key:"Attack",
                    value: "69"
                  },
                  "This Is ThumpNail"
                )} className="btn btn-ghost">
                  Test: AddItem
                </button>
                <button onClick={stopGame} className="btn btn-ghost">
                  Test: StopGame
                </button>
                <button onClick={() => mintNFT(
                  "Mystical Sword",
                  "Sword",
                  {
                    key:"Attack",
                    value: "69"
                  },
                  "This Is ThumpNail"
                )} className="btn btn-ghost">
                  Test: mintNFT
                </button>
              </>

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