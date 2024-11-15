access(all) contract interface ItemNFTInterface {
    access(all) resource interface NFT {
        access(all) let id: UInt64
        access(all) let itemType: String
        access(all) let attributes: {String: String}

        access(all) fun updateMetaData(key: String, value: String)
        access(all) fun updateAttributes(key: String, value: String)
    }
}
