// import MetaLootNFT from "../contracts/MetaLootNFT.cdc"
import "GameSession" 
import "MetaLootNFT"
import "NonFungibleToken"

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