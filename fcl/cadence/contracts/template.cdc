// import ItemNFTInterface from "./ItemNFTInterface.cdc"
access(all) contract MetaLootNFT2 {

    // Declare Path constants so paths do not have to be hardcoded
    // in transactions and scripts
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    // Counter to track the total number of NFTs created
    access(all) var totalSupply: UInt64


    // Declare the NFT resource type
    access(all) resource NFT {
        // The unique ID that differentiates each NFT
        access(all) let id: UInt64

        access(all) var attributes: {String: String}
        access(all) var itemType: String
        access(all) var metadata: {String: String}


        // Function to update Game Item
        access(all) fun updateMetaData(key: String, value: String) {
            self.metadata[key] = value
        }

        access(all) fun updateAttributes(key: String, value: String) {
            self.attributes[key] = value
        }

        access(all) fun updateItemType(key: String) {
            self.itemType = key
        }
        
        // initializer
        init(initID:UInt64,itemType: String, attributes: {String: String}?, metadata: {String: String}?) {
            self.id = initID
            self.itemType = itemType
            self.attributes = attributes ?? {}
            self.metadata = metadata ?? {}
        }

    
   
}
    
    access(all) entitlement Withdraw

    // The definition of the Collection resource that
    // holds the NFTs that a user owns
    access(all) resource Collection{
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        access(all) var ownedNFTs: @{UInt64: NFT}

        // Initialize the NFTs field to an empty collection
        init () {
            self.ownedNFTs <- {}
        }

        // withdraw
        //
        // Function that removes an NFT from the collection
        // and moves it to the calling context
        access(Withdraw) fun withdraw(withdrawID: UInt64): @NFT {
            // If the NFT isn't found, the transaction panics and reverts
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("Could not withdraw an ExampleNFT.NFT with id="
                          .concat(withdrawID.toString())
                          .concat("Verify that the collection owns the NFT ")
                          .concat("with the specified ID first before withdrawing it."))

            return <-token
        }

        // deposit
        //
        // Function that takes a NFT as an argument and
        // adds it to the collections dictionary
        access(all) fun deposit(token: @NFT) {
            // add the new token to the dictionary with a force assignment
            // if there is already a value at that key, it will fail and revert
            self.ownedNFTs[token.id] <-! token
        }

        // idExists checks to see if a NFT
        // with the given ID exists in the collection
        access(all) fun idExists(id: UInt64): @NFT? {
            return <-self.ownedNFTs.remove(key: id)
            }

        // getIDs returns an array of the IDs that are in the collection
        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }
    
}

    // creates a new empty Collection resource and returns it
    access(all) fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // Function to create a new NFT
    access(all) fun createNFT(itemType: String, attributes: {String: String}?, metadata: {String: String}?): @NFT {
        // Use totalSupply as the unique ID for the NFT
        let nftID = self.totalSupply
        let nft <- create NFT(initID:nftID,itemType: itemType, attributes: attributes, metadata: metadata)
        // Increment totalSupply to ensure the next NFT has a unique ID
        self.totalSupply = self.totalSupply + 1
        return <-nft
    }

    // Function to update metadata of an existing NFT
    access(all) fun updateMetadata(nft: &NFT, key: String, value: String) {
        nft.updateMetaData(key: key, value: value)
    }

    // Function to update metadata of an existing NFT
    access(all) fun updateAttributes(nft: &NFT, key: String, value: String) {
        nft.updateAttributes(key: key, value: value)
    }

    // Create a single new NFT and save it to account storage
    // init() {
    //     self.account.storage.save(<-create NFT(initID: 1, itemType: "Default", attributes: {}, metadata: {}), to: /storage/MetalootNFTPath)
    // }
    
    // Initialize with GameSessions address
    init() {

        self.CollectionStoragePath = /storage/MetalootNFTCollection
        self.CollectionPublicPath = /public/MetalootNFTCollection
        self.MinterStoragePath = /storage/MetalootNFTMinter

        self.totalSupply = 1 // Starting ID for the first NFT

        // Create a public capability for the collection - good practice to make sure collections are ready
        self.account.storage.save(<-self.createEmptyCollection(), to: self.CollectionStoragePath)

        // publish a capability to the Collection in storage
        let cap = self.account.capabilities.storage.issue<&Collection>(self.CollectionStoragePath)
        self.account.capabilities.publish(cap, at: self.CollectionPublicPath)
        }


    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        panic("TODO")
    }
}