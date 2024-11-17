import "MetaLootNFT"
import "NonFungibleToken"
import "Marketplace"
// This transaction transfers an NFT from one user's collection
// to another user's collection.
transaction (recipientAddress:Address,nftID:UInt64){

    // The field that will hold the NFT as it is being
    // transferred to the other account
    let transferToken: @{NonFungibleToken.NFT}

    prepare(acct: auth(BorrowValue) &Account) {

        // Borrow a reference from the stored collection
        let collectionRef = acct.storage
            .borrow<auth(NonFungibleToken.Withdraw) &MetaLootNFT.Collection>(from: MetaLootNFT.CollectionStoragePath)
            ?? panic("Could not borrow a collection reference to MetaLootNFT.Collection"
            .concat(" from the path ")
            .concat(MetaLootNFT.CollectionPublicPath.toString())
            .concat(". Make sure user has set up its account ")
            .concat("with an MetaLootNFT Collection."))

        // Call the withdraw function on the sender's Collection
        // to move the NFT out of the collection
        self.transferToken <- collectionRef.withdraw(withdrawID: nftID)
    }

    execute {
        // Get the recipient's public account object
        let recipient: &Account = getAccount(recipientAddress)

        // Get the Collection reference for the receiver
        // getting the public capability and borrowing a reference from it
        let receiverRef = recipient.capabilities
            .borrow<&MetaLootNFT.Collection>(MetaLootNFT.CollectionPublicPath)
            ?? panic("Could not borrow a collection reference to MetaLootNFT.Collection"
                     .concat(" from the path ")
                     .concat(MetaLootNFT.CollectionPublicPath.toString())
                     .concat(". Make sure account recipient has set up its account ")
                     .concat("with an MetaLootNFT Collection."))

        // Deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken)
        // Remove the NFT from marketplace listings if it exists
        Marketplace.buyNFT(nftID: nftID, buyer: recipientAddress)
        log("NFT ID ".concat(nftID.toString()).concat(" transferred to account ").concat(recipientAddress.toString()))
    }
}