import "NonFungibleToken"
import "MetaLootNFT"
import "MetadataViews"
import "FungibleToken"

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
