export class QGServer {
    constructor(config) { }
    sendMessageToPlayer(player, message) {
        this.$send(player.connectionId, message);
    }
    sendMessageToEveryone(message) {
        for (const player of this.players) {
            this.$send(player.connectionId, message);
        }
    }
    awardAchievement(achievement) {
        /*todo, verify with server*/
    }
}
//# sourceMappingURL=index.js.map