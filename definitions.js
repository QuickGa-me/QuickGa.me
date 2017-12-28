"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server = /** @class */ (function () {
    function Server(config) {
    }
    Server.prototype.sendMessageToPlayer = function (playerId, message) {
        /*todo*/
    };
    Server.prototype.sendMessageToEveryone = function (message) {
        /*todo*/
    };
    Server.prototype.awardAchievement = function (achievement) {
        /*todo, verify with server*/
    };
    Object.defineProperty(Server.prototype, "receivedMessages", {
        get: function () {
            /* todo */ return null;
        },
        enumerable: true,
        configurable: true
    });
    return Server;
}());
exports.Server = Server;
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.prototype.sendMessage = function (message) {
        /*todo*/
    };
    Object.defineProperty(Client.prototype, "receivedMessages", {
        get: function () {
            /* todo */ return null;
        },
        enumerable: true,
        configurable: true
    });
    return Client;
}());
exports.Client = Client;
