// import MetaLootNFT2 from "../contracts/MetaLootNFT2.cdc"
import "MetaLootNFT2"

// This transaction transfers an NFT from one user's collection
// to another user's collection.
transaction (recipientAddress:Address,nftID:UInt64){

    // The field that will hold the NFT as it is being
    // transferred to the other account
    let transferToken: @MetaLootNFT2.NFT

    prepare(acct: auth(BorrowValue) &Account) {

        // Borrow a reference from the stored collection
        let collectionRef = acct.storage
            .borrow<auth(MetaLootNFT2.Withdraw) &MetaLootNFT2.Collection>(from: MetaLootNFT2.CollectionStoragePath)
            ?? panic("Could not borrow a collection reference to MetaLootNFT2.Collection"
            .concat(" from the path ")
            .concat(MetaLootNFT2.CollectionPublicPath.toString())
            .concat(". Make sure user has set up its account ")
            .concat("with an MetaLootNFT2 Collection."))

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
            .borrow<&MetaLootNFT2.Collection>(MetaLootNFT2.CollectionPublicPath)
            ?? panic("Could not borrow a collection reference to 0x07's MetaLootNFT2.Collection"
                     .concat(" from the path ")
                     .concat(MetaLootNFT2.CollectionPublicPath.toString())
                     .concat(". Make sure account 0x07 has set up its account ")
                     .concat("with an MetaLootNFT2 Collection."))

        // Deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken)

        log("NFT ID 1 transferred from account 0x06 to account 0x07")
    }
}