import "FungibleToken"
import "MetadataViews"

transaction(vaultPath: StoragePath) {

    prepare(signer: auth(Storage,Capabilities) &Account) {
        // Check if the account already has a vault for the specified fungible token
        if signer.storage.borrow<&{FungibleToken.Vault}>(from: vaultPath) == nil {
            panic("The account does not have a vault for the specified fungible token.")
        }

        // Unpublish any existing capability at the royalty receiver path
        signer.capabilities.unpublish(MetadataViews.getRoyaltyReceiverPublicPath())

        // Create a new capability for the fungible token receiver
        let vaultCap = signer.capabilities.storage.issue<&{FungibleToken.Receiver}>(vaultPath)
        
        // Publish the capability at the royalty receiver path
        signer.capabilities.publish(vaultCap, at: MetadataViews.getRoyaltyReceiverPublicPath())
    }
}
