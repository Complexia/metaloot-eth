'use client';

import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import * as fcl from "@onflow/fcl";
import { onOpenUrl } from '@tauri-apps/plugin-deep-link'
// Import Flow configuration
import { addItem, mintNFT, startGame, stopGame, userStorageCheck } from '@/components/utilities/nftStorageCheck';
import { useUser } from '../context/UserContext';
import metaLootClient, { processUrl, User } from '../utilities/metaLootClient';
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core';
// Define the User type based on FCL's user state

const Navbar = ({ updateTab }) => {
  const { user, setUser } = useUser();

  useEffect(() => {
    // Move event listeners inside useEffect
    const setupListeners = async () => {
      console.log("USERR", user)
      await listen('get-user', (event) => {
        console.log("user-response12 event listener triggered", event);
      });

      await listen('get-stored-user', (event) => {
        // invoke to BE if needed
        return {
          action: 'get-stored-user',
          user: user
        };
        // console.log("get-stored-user event listener triggered", event);
        // console.log("this is the user here", user);
        // let resp = processUrl(event.event as string, user);
        // let response_p = {
        //   response_data: JSON.stringify(resp),
        //   user_json: JSON.stringify(user),
        //   user: user
        // };
        // console.log("response_ps from navbar", response_p);
      });

      await listen('start-game', (event) => {
        startGame();
        // console.log("start-game event listener triggered", event);
        // console.log("this is the user here", user);
        // let resp = processUrl(event.event as string, user);
        // let response_p = {
        //   response_data: JSON.stringify(resp),
        //   user_json: JSON.stringify(user),
        //   user: user
        // };
        // console.log("response_ps from navbar start game", response_p);
      });

      await listen('end-game', (event) => {
        stopGame();
        // console.log("end-game event listener triggered", event);
        // console.log("this is the user here", user);
        // let resp = processUrl(event.event as string, user);
        // let response_p = {
        //   response_data: JSON.stringify(resp),
        //   user_json: JSON.stringify(user),
        //   user: user
        // };
        // console.log("response_ps from navbar end game", response_p);
      });

      await listen('add-item', (event) => {
        console.log("add-item event listener triggered", event.payload);
        const payload = event.payload as {
          itemName: string;
          itemType: string,
          attributes: object,
          thumpNail: string
        };
        mintNFT(payload.itemName, payload.itemType, payload.attributes, payload.thumpNail);
        // console.log("this is the user here", user);
        // let resp = processUrl(event.event as string, user);
        // let response_p = {
        //   response_data: JSON.stringify(resp),
        //   user_json: JSON.stringify(user),
        //   user: user
        // };
        // console.log("response_ps from navbar add item", response_p);
      });

      await listen('get-user-nfts', (event) => {
        console.log("get-user-nfts event listener triggered", event);
        console.log("this is the user here", user);
        let resp = processUrl(event.event as string, user);
        let response_p = {
          response_data: JSON.stringify(resp),
          user_json: JSON.stringify(user),
          user: user
        };
        console.log("response_ps from navbar get-user-nfts", response_p);

      });
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      setupListeners();
    }
  }, []); // Empty dependency array since these listeners should only be set up once

  const listener = async () => {
    console.log("HELLO from navbar ", user);
    await onOpenUrl(async (urls: string[]) => {
      console.log('deep link:', urls)
      const res = metaLootClient(urls, user);
      console.log("this is meta response ", res);
    })
  };

  const [isLoading, setIsLoading] = useState(false);
  //const [user, setUser] = useState<User>({ addr: "", loggedIn: false });
  // useEffect(() => {

  //   // Subscribe to user state'
  //   //"@ts-expect-error"
  //   const unsubscribe = fcl.currentUser.subscribe(async (currentUser: User) => {
  //     setIsLoading(true);
  //     console.log("this is user ", currentUser);
  //     if (currentUser.loggedIn) {
  //       setUser(currentUser);
  //       // Ensure account is set up to receive NFTs

  //       await userStorageCheck();
  //       setIsLoading(false);
  //       // setError(""); // Clear any previous errors
  //     } else {
  //       setIsLoading(false);
  //       setUser({ addr: "", loggedIn: false });
  //     }
  //   });

  //   // Cleanup subscription on unmount
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {

    console.log("this gets called when user changes ", user);
    listener();

  }, [user]);

  const handleLogin = async () => {
    try {
      await fcl.authenticate();
      console.log("logging in...")
      setIsLoading(true);
      fcl.currentUser.subscribe(async (currentUser: User) => {
        setUser(currentUser);
        console.log("set this to current user ", currentUser);
        let payload = {
          addr: currentUser.addr,
          cid: currentUser.cid,
          loggedIn: currentUser.loggedIn
        }
        let resp = await invoke("store_user_data", { userData: JSON.stringify(payload) });
        console.log("this is the response from the store_user_data", resp);
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Authentication failed:", err);
      // setError("Authentication failed. Please try again.");
    }
  };

  const handleLogout = () => {
    fcl.unauthenticate();
    setUser({ addr: "", loggedIn: false });
  };

  const readUser = () => {
    console.log("current user trace ", user);
    const res = metaLootClient(["metaloot://callback/get-user"], user);
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
              <li><span onClick={() => updateTab("games")}>Games</span></li>
              <li><span onClick={() => updateTab("inventory")}>Inventory</span></li>
              <li><span onClick={() => updateTab("transactions")}>Transactions</span></li>
              <li><span onClick={() => updateTab("shop")}>Shop</span></li>
              {/* <li><Link href="/shop">Shop</Link></li> */}
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
                  TEST
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
