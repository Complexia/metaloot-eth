"use client";

import React, { useState } from 'react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('My games');

  const sidebarItems = [
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
              onClick={() => setActiveItem(item.name)}
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

