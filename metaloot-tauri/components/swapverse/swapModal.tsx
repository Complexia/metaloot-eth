"use client";

import React from 'react';
import { InventoryItem } from '@/components/types';
import SwapCard from './swapCard';
import { GamesPanel } from '../games/games-panel';
import InventoryCard from '../inventory/inventory-card';
import { getAllItem, swapNFT } from '../utilities/nftStorageCheck';
import * as fcl from "@onflow/fcl";

interface SwapModalProps {
    selectedItem: InventoryItem;
    onClose: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ selectedItem, onClose }) => {
    const [selectedSwapItem, setSelectedSwapItem] = React.useState<InventoryItem[] | null>(null);
    const [items, setItems] = React.useState<InventoryItem[] | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [swapStatus, setSwapStatus] = React.useState(false);
    const [error, setError] = React.useState(false);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const currentUser = await fcl.currentUser.snapshot();
            if (currentUser.loggedIn && currentUser.addr) {
                const items = await getAllItem(currentUser.addr);
                console.log("all items here ...... ", items);
                setItems(items);
            }
        } catch (error) {
            console.error('Failed to store NFT data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchItems();
    }, []);

    const swapItems = async () => {
        try {
            if (!selectedSwapItem) return;

            let payload = {
                swapItem: selectedItem,
                inventory: selectedSwapItem
            };
            //conditions check whether enough value to swap
            // idealy value of voucher needed to be smaller or equal to your items
            // in order to swap ......
            // later ......
            console.log("we are swapping items ..... ", payload);
            const currentUser = await fcl.currentUser.snapshot();
            if (currentUser.loggedIn && currentUser.addr) {
                setError(false);
                setSwapStatus(false);
                setIsLoading(true);
                const result = await swapNFT(payload);
                setIsLoading(false);
                setError(false);
                setSwapStatus(true);
                console.log("swap result: ", result);
                // await fetchItems(); // Refresh items after swap
            }
        } catch (error) {
            setIsLoading(false);
            setError(true);
            setSwapStatus(false);
            console.error('Failed to store NFT data:', error);
        }
    };

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

                {/* Success overlay */}
                {!error && swapStatus && (
                    <div className="absolute inset-0 bg-success bg-opacity-20 flex items-center justify-center z-10 rounded-3xl">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-bold text-success mb-2">Swap Successful!</h3>
                            <button onClick={onClose} className="btn btn-success">OK</button>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 bg-error bg-opacity-20 flex items-center justify-center z-10 rounded-3xl">
                        <div className="text-center">
                            <div className="text-6xl mb-4">❌</div>
                            <h3 className="text-2xl font-bold text-error mb-2">Swap Failed</h3>
                            {/* <p className="text-error-content">There was an error processing your swap</p> */}
                            <button onClick={onClose} className="btn btn-error mt-4">OK</button>
                        </div>
                    </div>
                )}

                <div className="flex h-full gap-4">
                    {/* Left side - Swap options */}
                    <div className={`w-[45%] overflow-y-auto pr-4 transition-transform duration-500 ${isLoading ? 'translate-x-[25%]' : ''}`}>
                        <h2 className="text-2xl font-bold mb-4">Available for Swap</h2>
                        <div className="space-y-4">
                            {items?.map((item) => {
                                const isSelected = selectedSwapItem?.some(selected => selected.id === item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`transform scale-90 cursor-pointer transition-all duration-200 
                                            ${isSelected ? 'ring-4 ring-primary ring-opacity-50 rounded-lg scale-95 shadow-lg bg-primary bg-opacity-10' : ''}
                                            ${isLoading && isSelected ? 'animate-pulse opacity-70' : ''}`}
                                        onClick={() => {
                                            if (!isLoading) {
                                                if (isSelected) {
                                                    setSelectedSwapItem(prev =>
                                                        prev ? prev.filter(i => i.id !== item.id) : null
                                                    );
                                                } else {
                                                    setSelectedSwapItem(prev =>
                                                        prev ? [...prev, item] : [item]
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        <InventoryCard {...item} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Middle - Swap controls */}
                    <div className="w-[10%] flex flex-col items-center justify-center">
                        <div className="flex flex-col gap-4">
                            <button
                                className={`btn btn-primary btn-circle btn-lg ${isLoading ? 'animate-spin' : ''}`}
                                onClick={swapItems}
                                disabled={isLoading}
                            >
                                ⇄
                            </button>
                            <span className="text-center font-bold">
                                {isLoading ? 'SWAPPING...' : 'SWAP'}
                            </span>
                        </div>
                    </div>

                    {/* Right side - Selected item */}
                    <div className={`w-[45%] transition-transform duration-500 ${isLoading ? '-translate-x-[25%]' : ''}`}>
                        <h2 className="text-2xl font-bold mb-4">Your Item</h2>
                        <div className={`transform scale-95 transition-all duration-500 ${isLoading ? 'animate-pulse opacity-70' : ''}`}>
                            <SwapCard {...selectedItem} disableModal={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapModal;
