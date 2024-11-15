// import MetaLootNFT from "../contracts/MetaLootNFT.cdc"
import "MetaLootNFT"


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
}