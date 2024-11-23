"use client";

import React from 'react';
import { InventoryItem } from '@/components/types';
import InventoryCard from './swapCard';
import * as fcl from "@onflow/fcl";
import { getAllItem } from '../utilities/nftStorageCheck';
import SwapCard from './swapCard';

export const SwapPanel = () => {
  const [items, setItems] = React.useState<InventoryItem[] | null>([
    {
      id: "1",
      uuid: "coupon-001", 
      description: "10% off on your next purchase at MetaStore",
      itemName: "Discount Coupon",
      name: "10% Off Coupon",
      itemType: "Code",
      attributes: {
        // discount: "50%",
        validUntil: "2024-12-31",
        store: "MetaStore"
      },
      metadata: {
        issueDate: "2023-12-01",
        terms: "Cannot be combined with other offers"
      },
      thumbnail: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/Image%2010.jpeg"
    },
    {
      id: "2", 
      uuid: "voucher-002",
      description: "Free shipping on orders over $50",
      itemName: "Free Shipping Voucher",
      name: "Free Shipping Voucher",
      itemType: "voucher",
      attributes: {
        // minPurchase: "$50",
        validUntil: "2024-06-30",
        region: "Worldwide"
      },
      metadata: {
        issueDate: "2023-12-01",
        terms: "Valid for standard shipping only"
      },
      thumbnail: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/Pink%20and%20Red%20Modern%20Bold%20Typography%20Cosmetic%20Brand%20Logo.png"
    },
    {
      id: "3", 
      uuid: "voucher-003",
      description: "20% discount for all digital bussiness card",
      itemName: "Discount Voucher",
      name: "20% Off Coupon",
      itemType: "Code",
      attributes: {
        // minPurchase: "$50",
        validUntil: "2024-06-30",
        region: "Worldwide"
      },
      metadata: {
        issueDate: "2023-12-01",
        terms: "Valid for standard shipping only"
      },
      thumbnail: "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/Biztouch%20Logo%20Official-2.png"
    },
  ]);

  // const fetchSwaps = async () => {
  //   try {
  //     const currentUser = await fcl.currentUser.snapshot();
  //     if (currentUser.loggedIn && currentUser.addr) {
  //       const items = await getAllItem(currentUser.addr);
  //       console.log("all items here ...... ", items);
  //       setItems(items);
  //     }
  //   } catch (error) {
  //     console.error('Failed to store NFT data:', error);
  //   }
  // };

  React.useEffect(() => {
    // fetchSwaps();
  }, []); 
  return (
    <>
      {items && (
        <div className="flex flex-wrap mx-2">
          {items.map((item) => (
            <div key={item.id} className="w-full sm:w-1/3 md:w-1/3  lg:w-1/3 px-2 mb-4 mt-6 ">
              <SwapCard {...item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
