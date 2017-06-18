'use strict';

var Client = require('./client.js');

var LoginRoom = function() {
    this.onExit = null;
};


LoginRoom.prototype = {
    onMessage: function(client, type, args) {
        console.log('LoginRoom::onMessage ... ' + type);
        if (type == 'login') {
            client.name = this.sanitizeName(args.name);
            console.log('login NAME: ' + client.name);

            var isSuccess = true;
            if (!client.name) {
                isSuccess = false;
            } else if (client.name === '') {
                isSuccess = false;
            }

            client.isLogin = isSuccess;

            var args = {
                isSuccess: isSuccess,
                name: client.name,
            };

            client.send(type, args);

            if (isSuccess) {
                if (this.onExit != null) {
                    this.onExit(client);
                }
            }
        }
    },

    sanitizeName: function(name) {
        var resultName = '' + name;
        resultName = resultName.replace(/[<>&\\]/gi, '');
        resultName = resultName.trim().substr(0, 10);
        return resultName;
    },

    onDisconnect: function(client) {},
};

module.exports = LoginRoom;
