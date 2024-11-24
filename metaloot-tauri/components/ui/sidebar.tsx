"use client";

import React, { useState } from 'react';

const Sidebar = ({ tab, setSideBar }) => {
  console.log("this is tab ...... , ",tab);
  const [activeItem, setActiveItem] = useState('');

  const sidebarItems = tab === "Arcade" ? [
    { name: 'My games', count: 12 },
    { name: 'Installed games', count: 5 }, 
    { name: 'All games', count: 87 },
    { name: 'Favorites', count: 8 },
  ] : tab === "MetaTreasures" ? [
    { name: 'My NFTs', count: 3 },
    { name: 'Redeemables', count: 2 },
    // { name: 'Marketplace', count: 50 },
    // { name: 'Watchlist', count: 5 },
  ] : tab === "Metanomics" ? [
    { name: 'Balances', count: 1 },
    { name: 'Trading', count: 0 },
    // { name: 'Analytics', count: 0 },
    { name: 'History', count: 12 },
  ] : tab === "Swapverse" ? [
    // { name: 'Available Swaps', count: 8 },
    // { name: 'My Offers', count: 2 },
    { name: 'Offers', count: 5 },
    // { name: 'Watchlist', count: 3 },
  ] : tab === "Transactions" ? [
    { name: 'Recent', count: 15 },
    { name: 'Pending', count: 2 },
    { name: 'Completed', count: 45 },
    { name: 'Failed', count: 1 },
  ] : tab === "Shop" ? [
    { name: 'Featured', count: 10 },
    { name: 'Categories', count: 6 },
    { name: 'Deals', count: 4 },
    { name: 'Cart', count: 0 },
  ] : [
    { name: 'My games', count: 12 },
    { name: 'Installed games', count: 5 },
    { name: 'All games', count: 87 },
    { name: 'Favorites', count: 8 },
  ];

  return (
    <div className="bg-base-200 h-screen p-4 flex flex-col justify-between">
      <ul className="menu menu-vertical w-full">
        {sidebarItems.map((item) => (
          <li key={item.name}>
            <a
              className={`flex justify-between items-center ${
                activeItem === item.name ? 'active' : ''
              }`}
              onClick={() => {
                setActiveItem(item.name);
                setSideBar(item.name);
              }}
            >
              <span>{item.name}</span>
              <span className="badge badge-primary badge-md rounded-md">
                {item.count}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="p-4 mb-36">
        <img 
          src="https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/vr-side.png"
          alt="Game Box"
          className=" object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Sidebar;

