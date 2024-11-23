"use client";

import { InventoryItem } from "@/components/types";
import { open } from '@tauri-apps/plugin-shell'


const SwapCard = (item: InventoryItem) => {
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
                console.log(`Clicked item: ${item.itemName}`);
            }}
            className="relative bg-base-100 shadow-xl h-96 cursor-pointer overflow-hidden transform hover:scale-105 transition-transform duration-200"
        >
            {/* Ticket zigzag edges */}
            <div className="absolute top-0 left-0 right-0 h-2">
                <div className="w-full h-full bg-base-100" style={{
                    clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)"
                }}></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2">
                <div className="w-full h-full bg-base-100" style={{
                    clipPath: "polygon(0 100%, 5% 0, 10% 100%, 15% 0, 20% 100%, 25% 0, 30% 100%, 35% 0, 40% 100%, 45% 0, 50% 100%, 55% 0, 60% 100%, 65% 0, 70% 100%, 75% 0, 80% 100%, 85% 0, 90% 100%, 95% 0, 100% 100%)"
                }}></div>
            </div>

            {/* Perforation line */}
            <div className="absolute left-1/4 top-0 bottom-0 border-l-2 border-dashed border-base-content/20"></div>
            
            <div className="grid grid-cols-4 h-full">
                {/* Left side - Stub */}
                <div className="col-span-1 p-4 flex flex-col items-center justify-center border-r border-base-content/10">
                    <div className="writing-mode-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
                        <h3 className="text-lg font-bold mb-2">ADMIT ONE</h3>
                        <p className="text-sm opacity-75">{item.itemType?.toUpperCase()}</p>
                    </div>
                </div>

                {/* Right side - Main content */}
                <div className="col-span-3 p-4 flex flex-col">
                    {/* Image section */}
                    <div className="relative h-1/2 mb-4">
                        <img
                            src={item.thumbnail?.startsWith('https') ? item.thumbnail : "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/box.jpg"}
                            alt="Ticket"
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                            <div className="badge badge-secondary">TICKET #{item.id}</div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-xl font-bold mb-2">
                            {truncateText(item.name || "", 30)}
                        </h2>
                        <p className="opacity-75 mb-4">
                            {truncateText(item.description, 60)}
                        </p>
                        
                        {/* Attributes section */}
                        <div className="mt-auto flex flex-wrap gap-2">
                            {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                                <div key={key} className="badge badge-outline">
                                    {key}: {value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapCard;
