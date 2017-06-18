var Client = function(socket) {
    this.socket = socket;
    this.isLogin = false;
    this.name = 'unknown';
    this.currentRoom = null;

    this.player = null;
    this.enemyClient = null;
};


Client.prototype = {
    send: function(type, args) {
        console.log('client.send(): ' + type);
        var data = {
            type: type,
            args: args,
        };
        if (this.socket) {
            this.socket.send(JSON.stringify(data));
        }
    },

    onMessage: function(type, args) {
        if (this.currentRoom) {
            this.currentRoom.onMessage(this, type, args);
        }
    },

    onDisconnect: function() {
        if (this.currentRoom) {
            this.currentRoom.onDisconnect(this);
        }
    },
};

module.exports = Client;
