import "MarketPlace"

transaction(nftID: UInt64, price: UFix64, name: String, nftType: String) {
    prepare(acct: &Account) {
        // List the NFT in the marketplace
        Marketplace.listNFT(nftID: nftID, price: price, name: name, nftType: nftType)
    }
    execute {
        log("NFT ID ".concat(nftID.toString()).concat(" listed for ").concat(price.toString()))
    }
}
