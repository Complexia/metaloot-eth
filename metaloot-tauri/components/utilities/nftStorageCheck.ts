import * as fcl from "@onflow/fcl";
import * as t from '@onflow/types';

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
  .put("app.detail.icon", "https://www.saturnlabs.dev") // URL to your app's icon
  // .put("app.detail.description", "A description of your app") // Short description of your app
  .put("walletconnect.projectId", "759fd0100ca6feff6d72c03a85e8f223") // URL to your app's icon
  .put("app.detail.url", "https://www.saturnlabs.dev"); // URL to your app

// Assuming ensureAccountIsSetUp is already defined as in the previous response
export async function nftStorageCheck(userAddress: string) {
  // let nftContractName = "MetaLootNFT"
  // let nftContractAddress = "0xf8d6e0586b0a20c7";
  console.log("here 0", userAddress);
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.query({
      cadence: `
        import HelloWorld from 0xceed54f46d4b1942

     access(all)
fun main(): String {
  return HelloWorld.greeting
}
      `,
    });
    console.log("this is result ", result);
  } catch (error) {
    console.error("Error setting up NFT storage:", error);
    // throw error;
  }
}

export async function userStorageCheck() {
  console.log("here 0");
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

        // Create a new empty collection
        let collection <- MetaLootNFT.createEmptyCollection(nftType: Type<@MetaLootNFT.NFT>())

        // store the empty NFT Collection in account storage
        acct.storage.save(<-collection, to: MetaLootNFT.CollectionStoragePath)

        log("Collection created for account")

        // create a public capability for the Collection
        let cap = acct.capabilities.storage.issue<&MetaLootNFT.Collection>(MetaLootNFT.CollectionStoragePath)
        acct.capabilities.publish(cap, at: MetaLootNFT.CollectionPublicPath)

        log("Capability created")
    }
      `,
    });
    console.log("this is result ", result);
  } catch (error) {
    console.error("Error setting up NFT storage:", error);
    // throw error;
  }
}

export async function getUser(userAddress: any) {
  // let nftContractName = "MetaLootNFT"
  // let nftContractAddress = "0xf8d6e0586b0a20c7";
  console.log("here 0", userAddress);
  // Check if the user has the NFT receiver capability
  try {
    const result = await fcl.query({
      cadence: `
import NonFungibleToken from 0x631e88ae7f1d7c20

access(all) fun main(address: Address, collectionPublicPath: PublicPath): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.capabilities.borrow<&{NonFungibleToken.Collection}>(
            collectionPublicPath
    ) ?? panic("The account ".concat(address.toString()).concat(" does not have a NonFungibleToken Collection at ")
                .concat(collectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))

    return collectionRef.getIDs()
}
      `,
      // @ts-ignore
      args: (arg,t) => [
        arg(userAddress, t.String),
        arg({
          domain:"public",
          type:""
        }, t.PathValue)
      ]
    });
    console.log("on-chain res: ", result);
  } catch (error) {
    console.error("on-chain err: ", error);
    // throw error;
  }
}