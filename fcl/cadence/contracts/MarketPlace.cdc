
// This contract enables users to list and exchange NFTs minted from in-game items. It should:
// Allow users to list NFTs for sale or trade.
// Include a bidding or direct sale mechanism.
// Provide a secure exchange of NFTs for other tokens or assets.

access(all) contract Marketplace {
    access(all) struct Listing {
        access(all) let nftID: UInt64
        access(all) let price: UFix64

        init(nftID: UInt64, price: UFix64, name: String, nftType: String) {
            self.nftID = nftID
            self.price = price
        }
    }

    access(all) fun listNFT(nftID: UInt64, price: UFix64,name: String,nftType:String) {
        let listing = Listing(nftID: nftID, price: price, name: name, nftType: nftType)
        self.listings[nftID] = listing
    }

    access(all) fun buyNFT(nftID: UInt64, buyer: Address) {
         let listing = self.listings.remove(key: nftID)
            ?? panic("Listing not found")
    }

    access(self) var listings: {UInt64: Listing}

     init() {
        self.listings = {}
    }

}
