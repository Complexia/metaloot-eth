// import MetaLootNFT from "../contracts/MetaLootNFT.cdc"
import "MetaLootNFT"


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
