/// Script to get NFT IDs in an account's collection

import "NonFungibleToken"
import "MetaLootNFT"

access(all) fun main(address: Address): [UInt64] {
    let account = getAccount(address)
    let collectionRef = account.capabilities.borrow<&{NonFungibleToken.Collection}>(
            MetaLootNFT.CollectionPublicPath
    ) ?? panic("The account ".concat(address.toString()).concat(" does not have a NonFungibleToken Collection at ")
                .concat(MetaLootNFT.CollectionPublicPath.toString())
                .concat(". The account must initialize their account with this collection first!"))

    return collectionRef.getIDs()
}