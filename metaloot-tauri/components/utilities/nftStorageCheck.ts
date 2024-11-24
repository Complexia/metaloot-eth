import * as fcl from "@onflow/fcl";
import * as t from '@onflow/typedefs';
import { User } from "./metaLootClient";
import { invoke } from "@tauri-apps/api/core";
import { InventoryItem } from "../types";

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║ Flow Client Library (FCL) Configuration                                    ║
// ║ This file handles NFT storage setup and verification for Flow blockchain  ║
// ║ Ensures users can receive NFTs by checking/creating collection capability ║ 
// ╚═══════════════════════════════════════════════════════════════════════════╝

// MAIN
// fcl.config()
//   .put("accessNode.api", "https://rest-mainnet.onflow.org") // For mainnet
//   // .put("accessNode.api", "https://rest-testnet.onflow.org") // For testnet
//   .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")

//LOCAL
// fcl.config()
//   .put("accessNode.api", "127.0.0.1:3569")              // Local emulator API
//   .put("discovery.wallet", "http://localhost:8701/fcl/authn")  // Local wallet discovery
//   .put("flow.network", "emulator")

//TESTNET
fcl.config()
  .put("flow.network", "testnet")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("app.detail.title", "MetaLoot") // Your app's name
  .put("app.detail.icon", "https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/crypto-ql/metalootLogo.png") // URL to your app's icon
  .put("app.detail.description", "A Multiverse Gateway for All Gaming") // Short description of your app
  .put("walletconnect.projectId", "759fd0100ca6feff6d72c03a85e8f223") // URL to your app's icon
  .put("app.detail.url", "https://www.saturnlabs.dev"); // URL to your app

export async function userStorageCheck() {
  const user = await fcl.currentUser.snapshot();
  console.log("Checking user storage for NFT, ", user.addr);
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.mutate({
      cadence: `
import MetaLootNFT from 0xceed54f46d4b1942

// This transaction configures a user's account
// to use the NFT contract by creating a new empty collection,
// storing it in their account storage, and publishing a capability
transaction {
    prepare(acct: auth(SaveValue, Capabilities) &Account) {
        log("Requested for capabilities")

        // Check if collection already exists
        if acct.storage.type(at: MetaLootNFT.CollectionStoragePath) == nil {
            // Create and store collection only if it doesn't exist
            let collection <- MetaLootNFT.createEmptyCollection(nftType: Type<@MetaLootNFT.NFT>())
            acct.storage.save(<-collection, to: MetaLootNFT.CollectionStoragePath)
            log("Collection created for account")
        }

        // Check if capability already exists
        if !acct.capabilities.get<&MetaLootNFT.Collection>(MetaLootNFT.CollectionPublicPath).check() {
            let cap = acct.capabilities.storage.issue<&MetaLootNFT.Collection>(MetaLootNFT.CollectionStoragePath)
            acct.capabilities.publish(cap, at: MetaLootNFT.CollectionPublicPath)
            log("Capability created")
        }
        
        // Check if minter already exists
        if acct.storage.type(at: MetaLootNFT.MinterStoragePath) == nil {
            let minter <- MetaLootNFT.createNFTMinter()
            acct.storage.save(<-minter, to: MetaLootNFT.MinterStoragePath)
            log("NFTMinter resource stored")
            
            // Create minter capability only if we just created the minter
            if !acct.capabilities.get<&MetaLootNFT.NFTMinter>(/public/NFTMinter).check() {
                let minterCap = acct.capabilities.storage.issue<&MetaLootNFT.NFTMinter>(MetaLootNFT.MinterStoragePath)
                acct.capabilities.publish(minterCap, at: /public/NFTMinter)
            }
        }
    }
}
      `,
      authz: fcl.currentUser,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      // limit: 999, // Set an appropriate gas limit
    });
    console.log("this is OC result ", result);
  } catch (error) {
    console.error("Error setting up NFT storage:", error);
    // throw error;
  }
}

export async function getUser(userAddress: string) {
  // let nftContractName = "MetaLootNFT"
  // let nftContractAddress = "0xf8d6e0586b0a20c7";
  console.log("here 0", userAddress);
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.query({
      cadence: `
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetaLootNFT from 0xceed54f46d4b1942

access(all) fun main(address: Address): [UInt64] {
    let account = getAccount(address)
    let collectionRef = account.capabilities.borrow<&{NonFungibleToken.Collection}>(
            MetaLootNFT.CollectionPublicPath
    ) ?? panic("The account ".concat(address.toString()).concat(" does not have a NonFungibleToken Collection at ")
                .concat(MetaLootNFT.CollectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))

    return collectionRef.getIDs()
}
      `,
      // @ts-ignore
      args: (arg, t) => [
        arg(userAddress, t.Address)
      ]
    });
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export async function getItem(userAddress: string, item: any) {
  // let nftContractName = "MetaLootNFT"
  // let nftContractAddress = "0xf8d6e0586b0a20c7";
  console.log("here 0", userAddress);
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.query({
      cadence: `
import NonFungibleToken from 0x631e88ae7f1d7c20
import ViewResolver from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
import MetaLootNFT from 0xceed54f46d4b1942

access(all) struct NFTView {
    access(all) let id: UInt64
    access(all) let uuid: UInt64
    access(all) let name: String
    access(all) let description: String
    access(all) let thumbnail: String
    access(all) let royalties: [MetadataViews.Royalty]
    access(all) let externalURL: String
    access(all) let collectionPublicPath: PublicPath
    access(all) let collectionStoragePath: StoragePath
    access(all) let collectionPublic: String
    access(all) let collectionPublicLinkedType: String
    access(all) let collectionName: String
    access(all) let collectionDescription: String
    access(all) let collectionExternalURL: String
    access(all) let collectionSquareImage: String
    access(all) let collectionBannerImage: String
    access(all) let collectionSocials: {String: String}
    access(all) let traits: MetadataViews.Traits

    init(
        id: UInt64,
        uuid: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        royalties: [MetadataViews.Royalty],
        externalURL: String,
        collectionPublicPath: PublicPath,
        collectionStoragePath: StoragePath,
        collectionPublic: String,
        collectionPublicLinkedType: String,
        collectionName: String,
        collectionDescription: String,
        collectionExternalURL: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
        collectionSocials: {String: String},
        traits: MetadataViews.Traits
    ) {
        self.id = id
        self.uuid = uuid
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.royalties = royalties
        self.externalURL = externalURL
        self.collectionPublicPath = collectionPublicPath
        self.collectionStoragePath = collectionStoragePath
        self.collectionPublic = collectionPublic
        self.collectionPublicLinkedType = collectionPublicLinkedType
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionExternalURL = collectionExternalURL
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.collectionSocials = collectionSocials
        self.traits = traits
    }
}

access(all) fun main(address: Address, id: UInt64): NFTView {
    let account = getAccount(address)

    let collectionData = MetaLootNFT.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("Could not resolve NFTCollectionData view. The MetaLootNFT contract needs to implement the NFTCollectionData Metadata view in order to execute this transaction")

    let collection = account.capabilities.borrow<&MetaLootNFT.Collection>(
            collectionData.publicPath
    ) ?? panic("The account ".concat(address.toString()).concat(" does not have a NonFungibleToken Collection at ")
                .concat(collectionData.publicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))

    let viewResolver = collection.borrowViewResolver(id: id) 
        ?? panic("Could not borrow resolver with given id ".concat(id.toString()))

    let nftView = MetadataViews.getNFTView(id: id, viewResolver : viewResolver)

    let collectionSocials: {String: String} = {}
    for key in nftView.collectionDisplay!.socials.keys {
        collectionSocials[key] = nftView.collectionDisplay!.socials[key]!.url
    }


    return NFTView(
        id: nftView.id,
        uuid: nftView.uuid,
        name: nftView.display!.name,
        description: nftView.display!.description,
        thumbnail: nftView.display!.thumbnail.uri(),
        royalties: nftView.royalties!.getRoyalties(),
        externalURL: nftView.externalURL!.url,
        collectionPublicPath: nftView.collectionData!.publicPath,
        collectionStoragePath: nftView.collectionData!.storagePath,
        collectionPublic: nftView.collectionData!.publicCollection.identifier,
        collectionPublicLinkedType: nftView.collectionData!.publicLinkedType.identifier,
        collectionName: nftView.collectionDisplay!.name,
        collectionDescription: nftView.collectionDisplay!.description,
        collectionExternalURL: nftView.collectionDisplay!.externalURL.url,
        collectionSquareImage: nftView.collectionDisplay!.squareImage.file.uri(),
        collectionBannerImage: nftView.collectionDisplay!.bannerImage.file.uri(),
        collectionSocials: collectionSocials,
        traits: nftView.traits!,
    )
}
      `,
      // @ts-ignore
      args: (arg, t) => [
        arg(userAddress, t.Address),
        arg(item, t.UInt64)
      ]
    });
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export async function startGame() {
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.mutate({
      cadence: `
import GameSession from 0xceed54f46d4b1942
transaction() {
    let user : Address
    prepare(acct: &Account) {
      self.user = acct.address
        // Logic to initialize a new game session
        // This could involve setting up resources or data specific to the session
        // Fill me ......
        log("Starting a new game session for user")
    }
      execute {
        // Start a new game session for the provided address
        let result = GameSession.startSession(user: self.user)
        
        log("Game session status: ".concat(result))
    }
}
      `,
      authz: fcl.currentUser,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
    });
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export async function stopGame() {
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.mutate({
      cadence: `
import GameSession from 0xceed54f46d4b1942
import MetaLootNFT from 0xceed54f46d4b1942
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction() {
     let minter: &MetaLootNFT.NFTMinter
    // The reference to the collection that will be receiving the NFT
    let receiverRef: &MetaLootNFT.Collection
    let user : Address
    prepare(acct: auth(BorrowValue) &Account) {
        log("Ending a game session for user")
        // Get the owner's collection capability and borrow a reference
        self.receiverRef = acct.capabilities
            .borrow<&MetaLootNFT.Collection>(MetaLootNFT.CollectionPublicPath)
            ?? panic("Could not borrow a collection reference to MetaLootNFT.Collection"
                     .concat(" from the path ")
                     .concat(MetaLootNFT.CollectionPublicPath.toString())
                     .concat(". Make sure account user has set up account ")
                     .concat("with an MetaLootNFT Collection."))
        self.user = acct.address
        // Borrow a reference to the NFTMinter resource in storage
        self.minter = acct.storage.borrow<&MetaLootNFT.NFTMinter>(from: MetaLootNFT.MinterStoragePath)
            ?? panic("Account does not store an object at the specified path")
    }
      execute {
        // End the game session and get collected items
        let items: [GameSession.Item]? = GameSession.endSession(user: self.user)
        log("Mintintg Items for user")
        if let items = items {
            // For each collected item, mint an NFT and deposit it to the collection
            for item in items {
                // Created new NFT 
                let newNFT <- self.minter.mintNFT(name:item.name,description: item.itemType,thumbNail:item.thumpNail,attributes: item.attributes)
                // Then deposit into user wallet
                self.receiverRef.deposit(token: <-newNFT)
            }
        }
    }
}
      `,
      authz: fcl.currentUser,
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
    });
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export async function addItem(itemName: string, itemType: string, attributes: object, thumpNail: string) {
  // Check if the user has the NFT receiver capability
  try {
    console.log()
    const result = await fcl.mutate({
      cadence: `
import GameSession from 0xceed54f46d4b1942

transaction(itemName:String,itemType: String, attributes: {String: String}, thumpNail: String) {
    let user : Address
    prepare(acct: &Account) {
        self.user = acct.address
        // Logic to initialize a new item
        // This could involve setting up resources or data specific to the session
        // Fill me ......
        log("Adding a new Item into a game session for user")
    }
    execute {
         // Add item to user's session
        GameSession.addItemToSession(
            user: self.user,
            itemName:itemName,
            itemType: itemType,
            attributes: attributes,
            thumpNail: thumpNail,
        )
        // Transsaction will panic if fail and won't emit success event
        // Emit an event to indicate the item was added
        // emit ItemAdded(user: self.user, itemType: itemType)
    }
}
      `,
      // @ts-ignore
      args: (arg, t) => [
        arg(itemName, t.String),
        arg(itemType, t.String),
        arg(
          { key: "key1", value: "value1" }
          , t.Dictionary({ key: t.String, value: t.String })),
        arg(thumpNail, t.String)
      ]
    });
    let resp = await invoke("store_transaction", { transactionData: JSON.stringify(result) });
    console.log("Transaction stored response:", resp);
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export async function mintNFT(itemName: string, itemType: string, attributes: object, thumpNail: string) {
  // let nftContractName = "MetaLootNFT"
  // let nftContractAddress = "0xf8d6e0586b0a20c7";
  // Check if the user has the NFT receiver capability
  try {
    
    const result = await fcl.mutate({
      cadence: `
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetaLootNFT from 0xceed54f46d4b1942
import MetadataViews from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7

transaction(
    name: String,
    description: String,
    attributes: {String: String},
    thumbnail: String,
) {

    let minter: &MetaLootNFT.NFTMinter
    let recipientCollectionRef: &{NonFungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {

        // Borrow a reference to the NFTMinter resource in storage
        self.minter = signer.storage.borrow<&MetaLootNFT.NFTMinter>(from: MetaLootNFT.MinterStoragePath)
            ?? panic("Account does not store an object at the specified path")
        // Borrow the signer's NFT collection reference
        self.recipientCollectionRef = signer.storage.borrow<&{NonFungibleToken.Receiver}>(from: MetaLootNFT.CollectionStoragePath)
            ?? panic("Signer does not have a collection at the specified path")
    }

    execute {
        // Mint the NFT and deposit it to the signer's collection
        let mintedNFT <- self.minter.mintNFT(
            name: name,
            description: description,
            thumbNail: thumbnail,
            attributes: attributes
        )
        self.recipientCollectionRef.deposit(token: <-mintedNFT)
    }
}
      `,
      // @ts-ignore
      args: (arg, t) => [
        arg(itemName, t.String),
        arg(itemType, t.String),
        arg(
          { key: "key1", value: "value1" }
          , t.Dictionary({ key: t.String, value: t.String })),
        // arg(attributes, t.Dictionary({ key: t.String, value: t.String })),
        arg(thumpNail, t.String)
      ]
    });
    await invoke('store_transaction', { transaction: result });
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export async function getAllItem(userAddress:string) {
  // let nftContractName = "MetaLootNFT"
  // let nftContractAddress = "0xf8d6e0586b0a20c7";
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.query({
      cadence: `
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetaLootNFT from 0xceed54f46d4b1942

// Return the NFTs owned by account 0x01.
access(all)
fun main(address: Address): [&{NonFungibleToken.NFT}] {
    // Get the public account object for the specified address
    let nftOwner = getAccount(address)

    // Find the public Receiver capability for their Collection and borrow it
    let collectionRef = nftOwner.capabilities.borrow<&{NonFungibleToken.Collection}>(
            MetaLootNFT.CollectionPublicPath
    ) ?? panic("The account ".concat(address.toString()).concat(" does not have a NonFungibleToken Collection at ")
                .concat(MetaLootNFT.CollectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))

    // Get the IDs of the NFTs owned by the account
    let nftIDs = collectionRef.getIDs()

    // Create an array to store references to the NFTs
    var nfts: [&{NonFungibleToken.NFT}] = []

    // Iterate over the IDs and get each NFT reference
    for id in nftIDs {
        let nftRef: &{NonFungibleToken.NFT} = collectionRef.borrowNFT(id)
            ?? panic("Could not borrow NFT with id ".concat(id.toString()))
        nfts.append(nftRef)
    }
    return nfts
}
      `,
   // @ts-ignore
   args: (arg, t) => [
    arg(userAddress, t.Address),
  ]
    });
    console.log("on-chain res: ", result);
    return result;
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}

export const transferNFT = async (recipientAddress: string, tokenId: number) => {
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import MetaLootNFT from 0xceed54f46d4b1942

        transaction(recipient: Address, withdrawID: UInt64) {
          prepare(acct: &Account) {
            // Get the Collection reference from the signer
            let collectionRef = signer.borrow<&MetaLootNFT.Collection>(
              from: MetaLootNFT.CollectionStoragePath
            ) ?? panic("Could not borrow Collection reference")

            // Get the recipient's public account object
            let recipientAccount = getAccount(recipient)

            // Get the Collection reference from the recipient
            let depositRef = recipientAccount.getCapability(MetaLootNFT.CollectionPublicPath)
              .borrow<&{NonFungibleToken.CollectionPublic}>()
              ?? panic("Could not borrow Collection receiver reference")

            // Withdraw the NFT and deposit it to the recipient's Collection
            let nft <- collectionRef.withdraw(withdrawID: withdrawID)
            depositRef.deposit(token: <-nft)
          }
        }
      `,
      args: (arg, t) => [
        arg(recipientAddress, t.Address),
        arg(tokenId, t.UInt64)
      ],
      limit: 1000
    });

    console.log("Transfer transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Error transferring NFT:", error);
    throw error;
  }
}

export const swapNFT = async (recipientAddress: string, payload: {swapItem: InventoryItem, inventory: InventoryItem[]}) => {
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import MetaLootNFT from 0xceed54f46d4b1942

        transaction(recipient: Address, withdrawID: UInt64) {
          prepare(acct: &Account) {
            // Get the Collection reference from the signer
            let collectionRef = signer.borrow<&MetaLootNFT.Collection>(
              from: MetaLootNFT.CollectionStoragePath
            ) ?? panic("Could not borrow Collection reference")

            // Get the recipient's public account object
            let recipientAccount = getAccount(recipient)

            // Get the Collection reference from the recipient
            let depositRef = recipientAccount.getCapability(MetaLootNFT.CollectionPublicPath)
              .borrow<&{NonFungibleToken.CollectionPublic}>()
              ?? panic("Could not borrow Collection receiver reference")

            // Withdraw the NFT and deposit it to the recipient's Collection
            let nft <- collectionRef.withdraw(withdrawID: withdrawID)
            depositRef.deposit(token: <-nft)
          }
        }
      `,
      args: (arg, t) => [
        arg(recipientAddress, t.Address),
        ...payload.inventory.map(tokenId => arg(tokenId.id, t.UInt64))
      ],
      limit: 1000
    });

    console.log("Transfer transaction submitted:", transactionId);
    return transactionId;
  } catch (error) {
    console.error("Error transferring NFT:", error);
    throw error;
  }
}
