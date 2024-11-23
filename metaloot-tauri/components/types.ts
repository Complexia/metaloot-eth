interface Game {
  actions?: string[];
  id: string;
  title: string;
  description: string;
  media: string;
  uri: string;
  // action:string[];
  // Add other game properties as needed
}

interface InventoryItem {
  id: string;
  uuid: string;
  description: string;
  itemName: string;
  name?: string;
  itemType: string;
  attributes: object;
  metadata: object;
  thumbnail: string
}

export type { Game, InventoryItem };