// import MetaLootNFT2 from "../contracts/MetaLootNFT2.cdc"
import "MetaLootNFT2"


// This transaction configures a user's account
// to use the NFT contract by creating a new empty collection,
// storing it in their account storage, and publishing a capability
transaction {
    prepare(acct: auth(SaveValue, Capabilities) &Account) {
        log("Requested for capabilities")

        // Create a new empty collection
        let collection <- MetaLootNFT2.createEmptyCollection()

        // store the empty NFT Collection in account storage
        acct.storage.save(<-collection, to: MetaLootNFT2.CollectionStoragePath)

        log("Collection created for account")

        // create a public capability for the Collection
        let cap = acct.capabilities.storage.issue<&MetaLootNFT2.Collection>(MetaLootNFT2.CollectionStoragePath)
        acct.capabilities.publish(cap, at: MetaLootNFT2.CollectionPublicPath)

        log("Capability created")
    }
}