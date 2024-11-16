interface Game {
    id: string;
    title: string;
    description: string;
    media:string;
    uri:string;
    // Add other game properties as needed
  }

  interface InventoryItem {
    id: string;
    itemName: string;
    itemType: string;
    attributes: {
      rarity: string;
      originGame: string;
      description: string;
    };
    thumbnail: string;
  }


export type { Game, InventoryItem };