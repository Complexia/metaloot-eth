import "GameSession"

access(all) fun main(user: Address): [GameSession.Session]? {
    // Call the startSession function from GameSession contract
    return GameSession.findUserHistorySessions(user: user)
}
