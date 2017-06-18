'use strict';

var Client = require('./client.js');

var MatchingRoom = function() {
    this.onExit = null;
    this.clientList = [];
};

MatchingRoom.prototype = {
    onMessage: function(client, type, args) {
        console.log('MatchingRoom::onMessage ... [' + type + ']');
        if (type == 'matching') {
            this.startMatching(client, type, args);
        }
        if (type == 'single') {
            this.startSinglePlay(client);
        }
    },

    startMatching: function(client, type, args) {
        console.log('Enter matching: ' + client.name);
        if (!client.isLogin) {
            console.log('login error');
            return;
        }

        if (this.clientList.indexOf(client) > -1) {
            console.log('exists error');
            return;
        }

        this.clientList.push(client);
        client.send(type, {
            isSuccess: true,
        });

        while (this.clientList.length >= 2) {
            var battleClients = [];
            battleClients.push(this.clientList.shift());
            battleClients.push(this.clientList.shift());

            battleClients[0].enemyClient = battleClients[1];
            battleClients[1].enemyClient = battleClients[0];

            battleClients.forEach(function(client) {
                var data = {
                    enemyName: client.enemyClient.name,
                };
                client.send('matched', data);
            });
            if (this.onExit != null) {
                this.onExit(battleClients);
            }
            this.clientList = [];
        }
    },

    onDisconnect: function(client) {
        var index = this.clientList.indexOf(client);
        if (index < 0) {
            return;
        }
        this.clientList.splice(index, 1);
    },
};

module.exports = MatchingRoom;
