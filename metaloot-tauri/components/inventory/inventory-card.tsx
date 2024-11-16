"use client";

import { InventoryItem } from "@/components/types";
import { open } from '@tauri-apps/plugin-shell'


const InventoryCard = (item: InventoryItem) => {
    // Function to open external URI using Tauri shell
    // const openExternalUri = async () => {
    //     try {
    //         console.error('Try to open URI:', item.uri);
    //         await open(item.uri);
    //     } catch (error) {
    //         console.error('Failed to open URI:', error);
    //         // Fallback to window.open for web
    //         window.open(item.uri, '_blank');
    //     }
    // };
    // Function to truncate text
    const truncateText = (text: string | null, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <div
            key={item.id}
            onClick={async () => {
                // Handle click event for the item card
                console.log(`Clicked item: ${item.itemName}`);
                // await openExternalUri();
            }}
            className="card bg-base-100 shadow-xl  h-96 cursor-pointer">
            <figure className="h-1/2">
                <img
                    src={item.thumbnail}
                    alt="Shoes"
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body h-1/2 flex flex-col">
                <h2 className="card-title text-lg">
                    {truncateText(item.itemName, 30)}
                    <div className="badge badge-secondary">item</div>
                </h2>
                <p className="flex-grow overflow-hidden">
                    {truncateText(item.description, 60)}
                </p>
                <p className="flex-grow overflow-hidden">
                    {truncateText(JSON.stringify(item.attributes), 60)}
                </p>
                {/* <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                </div> */}
            </div>
        </div>
    );
};

export default InventoryCard;
