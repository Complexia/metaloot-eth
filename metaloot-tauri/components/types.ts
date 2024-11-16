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
    uuid: string;
    description: string;
    itemName: string;
    itemType: string;
    attributes: object;
    metadata: object;
    thumbnail: string;
  }


export type { Game, InventoryItem };