"use client";

import React from 'react';
import { InventoryItem } from '@/components/types';
import SwapCard from './swapCard';

interface SwapModalProps {
  selectedItem: InventoryItem;
  swapOptions: InventoryItem[];
  onClose: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ selectedItem, swapOptions, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-200 p-8 rounded-3xl w-[90%] h-[90%] relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-circle btn-ghost"
        >
          ✕
        </button>

        <div className="flex h-full gap-4">
          {/* Left side - Swap options */}
          <div className="w-[45%] overflow-y-auto pr-4">
            <h2 className="text-2xl font-bold mb-4">Available for Swap</h2>
            <div className="space-y-4">
              {swapOptions.map((item) => (
                <div key={item.id} className="transform scale-90">
                  <SwapCard {...item} />
                </div>
              ))}
            </div>
          </div>

          {/* Middle - Swap controls */}
          <div className="w-[10%] flex flex-col items-center justify-center">
            <div className="flex flex-col gap-4">
              <button className="btn btn-primary btn-circle btn-lg">
                ⇄
              </button>
              <span className="text-center font-bold">SWAP</span>
            </div>
          </div>

          {/* Right side - Selected item */}
          <div className="w-[45%]">
            <h2 className="text-2xl font-bold mb-4">Your Item</h2>
            <div className="transform scale-95">
              <SwapCard {...selectedItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
