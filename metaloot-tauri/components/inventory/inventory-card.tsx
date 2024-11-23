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
            <figure className="">
                <img
                    src={item.thumbnail?.startsWith('https') ? item.thumbnail : "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/box.jpg"}
                    alt="Shoes"
                    className="w-full h-full" // object-cover
                />
            </figure>
            <div className="card-body h-1/2 flex flex-col">
                <h2 className="card-title text-lg">
                    {truncateText(item.name || "", 30)}
                    <div className="badge badge-secondary">item</div>
                </h2>
                <p className="flex-grow overflow-hidden">
                    {truncateText(item.description, 60)}
                </p>
                <div className="card-actions justify-end">
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <div key={key} className="badge badge-outline">
                            {key}: {value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InventoryCard;
