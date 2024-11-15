import "NonFungibleToken"
import "MetaLootNFT"
import "MetadataViews"
import "FungibleToken"

transaction(
    recipient: Address,
    name: String,
    description: String,
    thumbnail: String,
    attributes: {String: String},
    // cuts: [UFix64],
    // royaltyDescriptions: [String],
    // royaltyBeneficiaries: [Address]
) {

    let minter: &MetaLootNFT.NFTMinter
    let recipientCollectionRef: &{NonFungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {

        // Borrow a reference to the NFTMinter resource in storage
        self.minter = signer.storage.borrow<&MetaLootNFT.NFTMinter>(from: MetaLootNFT.MinterStoragePath)
            ?? panic("Account does not store an object at the specified path")

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient).capabilities.borrow<&{NonFungibleToken.Receiver}>(
                MetaLootNFT.CollectionPublicPath
            ) ?? panic("Could not get receiver reference to the NFT Collection")
    }

    // pre {
    //     cuts.length == royaltyDescriptions.length && cuts.length == royaltyBeneficiaries.length: "Array length should be equal for royalty related details"
    // }

    execute {

        // Create the royalty details
        var count = 0
        // var royalties: [MetadataViews.Royalty] = []
        // while royaltyBeneficiaries.length > count {
        //     let beneficiary = royaltyBeneficiaries[count]
        //     let beneficiaryCapability = getAccount(beneficiary).capabilities.get<&{FungibleToken.Receiver}>(
        //         MetadataViews.getRoyaltyReceiverPublicPath()
        //     )

        //     if !beneficiaryCapability.check() {
        //         panic("The royalty beneficiary "
        //                .concat(beneficiary.toString())
        //                .concat(" does not have a FungibleToken Receiver configured at ")
        //                .concat(MetadataViews.getRoyaltyReceiverPublicPath().toString())
        //                .concat(". They should set up a FungibleTokenSwitchboard Receiver at this path to receive any type of Fungible Token"))
        //     }

        //     royalties.append(
        //         MetadataViews.Royalty(
        //             receiver: beneficiaryCapability,
        //             cut: cuts[count],
        //             description: royaltyDescriptions[count]
        //         )
        //     )
        //     count = count + 1
        // }

        // Mint the NFT and deposit it to the recipient's collection
        let mintedNFT <- self.minter.mintNFT(
            name: name,
            description: description,
            thumbnail: thumbnail,
            attributes: attributes,
            // royalties: royalties
        )
        self.recipientCollectionRef.deposit(token: <-mintedNFT)
    }
}
