// import MetaLootNFT from "../contracts/MetaLootNFT.cdc"
import "GameSession" 

transaction() {
    let user : Address
    prepare(acct: &Account) {
      self.user = acct.address
        // Logic to initialize a new game session
        // This could involve setting up resources or data specific to the session
        // Fill me ......
        log("Starting a new game session for user")
    }
      execute {
        // Start a new game session for the provided address
        let result = GameSession.startSession(user: self.user)
        
        log("Game session status: ".concat(result))
    }
}
