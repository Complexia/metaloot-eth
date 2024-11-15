import "MetaLootNFT2"


// This transaction allows the Minter account to mint an NFT
// and deposit it into its own collection.

transaction(itemType: String, attributes: {String: String}?, metadata: {String: String}?) {
    // idelaly should check for user history

    // The reference to the collection that will be receiving the NFT
    let receiverRef: &MetaLootNFT2.Collection

    prepare(acct: auth(BorrowValue) &Account) {
        // Get the owner's collection capability and borrow a reference
        self.receiverRef = acct.capabilities
            .borrow<&MetaLootNFT2.Collection>(MetaLootNFT2.CollectionPublicPath)
            ?? panic("Could not borrow a collection reference to 0x06's MetaLootNFT2.Collection"
                     .concat(" from the path ")
                     .concat(MetaLootNFT2.CollectionPublicPath.toString())
                     .concat(". Make sure account 0x06 has set up its account ")
                     .concat("with an MetaLootNFT2 Collection."))
    }

    execute {
        // Use the minter reference to mint an NFT, which deposits
        // the NFT into the collection that is sent as a parameter.
        let newNFT <- MetaLootNFT2.createNFT(itemType: itemType, attributes: attributes, metadata: metadata)

        self.receiverRef.deposit(token: <-newNFT)

        log("NFT Minted and deposited to Accoun's Collection")
    }
}