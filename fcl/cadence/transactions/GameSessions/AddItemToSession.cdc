import "GameSession" 

// access(all) event ItemAdded(user: Address, itemType: String)

transaction(itemName:String,itemType: String, attributes: {String: String}, thumpNail: String) {
    let user : Address
    prepare(acct: &Account) {
        self.user = acct.address
        // Logic to initialize a new item
        // This could involve setting up resources or data specific to the session
        // Fill me ......
        log("Adding a new Item into a game session for user")
    }
    execute {
         // Add item to user's session
        GameSession.addItemToSession(
            user: self.user,
            itemName:itemName,
            itemType: itemType,
            attributes: attributes,
            thumpNail: thumpNail,
        )
        // Transsaction will panic if fail and won't emit success event
        // Emit an event to indicate the item was added
        // emit ItemAdded(user: self.user, itemType: itemType)
    }
}
