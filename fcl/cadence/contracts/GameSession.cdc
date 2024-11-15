// import ItemNFTInterface from "./ItemNFTInterface.cdc"

//import NonFungibleToken from 0x631e88ae7f1d7c20 // Update to mainnet address if needed

// 🎮 GAME MASTER CONTRACT: Your Epic Adventure Awaits! 🚀
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🕹️ Track Your Gaming Journey
// ⏰ Time Your Epic Quests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
access(all) contract GameSession {

    // Struct Item Start !!!
    access(all) struct Item {
        // game item 
        access(all) var name: String
        access(all) var attributes: {String: String}
        access(all) var thumpNail:String
        access(all) var itemType: String

        // Function to update Game Item
        access(all) fun updateMetaData(thumpNail:String) {
            self.thumpNail = thumpNail
        }
        access(all) fun updateAttributes(key: String, value: String) {
            self.attributes[key] = value
        }
        access(all) fun updateItemType(key: String) {
            self.itemType = key
        }
        access(all) fun updateItemName(name: String) {
            self.name = name
        }

        init(name:String,itemType: String, attributes: {String: String},thumpNail:String) {
            self.itemType = itemType
            self.thumpNail = thumpNail
            self.attributes = attributes
            self.name = name
        }
    }
    // Struct Item End.

    // Session Struct Start !!!
    access(all) struct Session {
        access(all) let startTime: UFix64
        access(all) var endTime: UFix64?
        access(all) var items: [Item]

        init(startTime: UFix64) {
            self.startTime = startTime
            self.endTime = nil
            self.items = []
        }

        access(all) fun endSession(endTime: UFix64) {
            self.endTime = endTime
        }

        access(all) fun addItem(item: Item) {
            if self.endTime != nil {
                panic("Cannot add items to a session that has ended")
                }
            self.items.append(item)
        }
        
        access(all) fun removeItem(itemType: String, attributes: {String: String}): Bool {
            // Find the index of the item to be removed
            var indexToRemove: Int? = nil
            var i = 0
            // Use a while loop to iterate over the indices
            while i < self.items.length {
                let currentItem = self.items[i]
                if currentItem.itemType == itemType && currentItem.attributes == attributes {
                    indexToRemove = i
                    break
                    }
                    i = i + 1
                    }
                    // If the item was found, remove it from the array
                    if let index = indexToRemove {
                        self.items.remove(at: index)
                        return true
                    } else {
                        return false // Item not found
                    }
            }
    }
    // Session Struct End.
    
    
    // 🎮 ACTIVE SESSIONS TRACKER
    // 🎯 Maps player addresses to their epic gaming moments
    // 🌟 Where the magic happens - your gaming data lives here!
    access(account) var sessions: {Address: Session}
    access(account) var sessionHistory: {Address: [Session]}

    // 🎮 GAME ON! Let's start your epic adventure! 
    // 🚀 Your journey begins here - time to make gaming history!
    // ⏱️ The clock is ticking, hero! Let's get this party started!
    access(all) fun startSession(user: Address): String {
        // Safetey to check - incase user launch multiple game - this will overwrite the existing sessisons .....
        if self.sessions[user] != nil {
            return "Please end your current session and save items before starting a new one."
        }
            let newSession = Session(startTime: getCurrentBlock().timestamp)
            self.sessions[user] = newSession
            return "New session started successfully."
    }

    // 🎮 GAME OVER! Time to collect your epic loot! 🎁
    // 🔥 This function wraps up your gaming session and prepares your items for NFT minting 🚀
    access(all) fun endSession(user: Address): [Item]? {
        // Check if there is an active session for the user
        if let session = self.sessions[user] {
            // Set the end time to mark the session as completed
            session.endSession(endTime: getCurrentBlock().timestamp)
            // Retrieve items collected during the session
            let items = session.items
            // Initialize session history array if it doesn't exist for this user
            if self.sessionHistory[user] == nil {
                self.sessionHistory[user] = []
            }
            // Append the completed session to sessionHistory
            self.sessionHistory[user]?.append(session)
            // Remove the session from active sessions to free up space
            self.sessions.remove(key: user)
            // Return collected items for further processing (e.g., minting NFTs)
            return items
        }
        return nil
    }

    // 🔍 Find active session and return items
    // 📦 Get all the items collected in the current session
    access(all) fun findUserActiveSession(user: Address): Session? {
        // Check if there is an active session for the user
        if let session = self.sessions[user] {
            // Return the items from the active session
            return session
        }
        else{ return nil }
    }
    
    // 📜 Find historical sessions and return all session data
    // 🗂️ Get all past gaming sessions with their details
    access(all) fun findUserHistorySessions(user: Address): [Session]? {
        // Check if there are any historical sessions for the user
        if let history = self.sessionHistory[user] {
            // Return the complete session history
            return history
        }
        else{ return nil }
    }

    // 🎮 LOOT DROP INCOMING! 
    // 🎁 Add epic treasures to your gaming adventure!
    // ⚔️ Stack up those rewards while you play! 
    access(all) fun addItemToSession(user: Address,itemName:String, itemType: String, attributes: {String: String},thumpNail:String) {
        // Only Allow Adding Item Into Active Sessisons
        if let session = self.sessions[user] {
            let newItem = Item(name:itemName,itemType: itemType, attributes: attributes, thumpNail: thumpNail)
            session.addItem(item: newItem)
        } else {
            panic("No active session for user")
        }
    }
    
    init() {
        self.sessions = {}
        self.sessionHistory = {}
        }
}
