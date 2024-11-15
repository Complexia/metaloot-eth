import "MetadataViews"
import "MetaLootNFT"

access(all) fun main(): [Type] {
    return MetaLootNFT.getContractViews(resourceType: Type<@MetaLootNFT.NFT>()) 
}