'use strict';

var Request = Class.create({
    initialize: function(connection, type) {
        this.connection = connection;
        this.type = type;
        this.callback = null;
    },

    send: function(args, callback) {
        if (this.callback != null) {
            return false;
        }
        if (this.connection == null) {
            return false;
        }

        var requestData = {
            type: this.type,
            args: args,
        };

        this.callback = callback;
        this.connection.send(requestData);
        return true;
    },

    onResponce: function(args) {
        if (this.callback == null) {
            return;
        }
        this.callback(args);
        this.callback = null;
    },
});

var Notify = Class.create({
    initialize: function(connection, message, callback, isOperation) {
        this.connection = connection;
        this.type = message;
        this.callback = callback;
        if (!isOperation) {
            this.isOperation = false;
        } else {
            this.isOperation = true;
        }
    },

    send: function(args, callback) {
        if (this.connection == null) {
            return false;
        }

        var requestData = {
            type: this.type,
            args: args,
        };

        this.connection.send(requestData);
        return true;
    },

    onReceive: function(args) {
        if (this.callback == null) {
            return;
        }
        this.callback(args);
    },
});

var Connection = Class.create({
    initialize: function() {
        this.ws = io.connect(Config.SocketServer);
        this.onMessageCallback = null;
        this.onLocalMessageCallback = null;
        this.onSendCallback = null;
        this.isLocal = false;
        this.localServer = new LocalServer(this);

        var self = this;
        this.ws.on('message', function(event) {
            if (!self.isLocal) {
                if (self.onMessageCallback) {
                    var message = JSON.parse(event);
                    self.onMessageCallback(message);
                }
            }
        });
    },

    send: function(message) {
        if (!this.isLocal) {
            this.ws.send(JSON.stringify(message));
        } else {
            if (this.onSendCallback) {
                this.onSendCallback(message);
            }
        }
    },

    onLocalMessage: function(message) {
        console.log('Local-Message: ' + message.type);
        if (this.isLocal) {
            if (this.onMessageCallback) {
                this.onMessageCallback(message);
            }
        }
    },

});

var ArkNetwork = Class.create({
    initialize: function() {
        this.messageQueue = [];
        this.enemyOperationQueue = [];
        this.isEnemyOperationProcessing = false;
        this.connection = new Connection();

        this.mulliganEndCallback = null;
        this.enemyEndTurnCallback = null;
        this.enemyUseCardCallback = null;
        this.manualAttackCallback = null;
        this.minionMoveCallback = null;
        this.enemyResignCallback = null;
        this.startTurnCallback = null;
        this.startEnemyTurnCallback = null;
        this.victoryCallback = null;
        this.defeatCallback = null;

        var self = this;
        this.requests = {
            login: new Request(this.connection, 'login'),
            ready: new Request(this.connection, 'ready'),
            mulligan: new Request(this.connection, 'mulligan'),
        };
        this.notifys = {
            mulliganEnd: new Notify(this.connection, 'mulliganEnd', function(args) {
                if (self.mulliganEndCallback) {
                    self.mulliganEndCallback(args.isFirstPlayer, args.deckAmount);
                }
            }),
            useCard: new Notify(this.connection, 'useCard', function(args) {
                if (self.enemyUseCardCallback) {
                    self.enemyUseCardCallback(args.useCardKey, args.handIndex, args.gridIndex);
                }
            }, true),
            manualAttack: new Notify(this.connection, 'manualAttack', function(args) {
                if (self.manualAttackCallback) {
                    self.manualAttackCallback(args.attackerIndex, args.targetIndex);
                }
            }, true),

            moveMinion: new Notify(this.connection, 'moveMinion', function(args) {
                if (self.minionMoveCallback) {
                    self.minionMoveCallback(args.gridIndex, args.step);
                }
            }, true),
            endTurn: new Notify(this.connection, 'endTurn', function(args) {
                if (self.enemyEndTurnCallback) {
                    self.enemyEndTurnCallback();
                }
            }, true),
            endTurnComplete: new Notify(this.connection, 'endTurnComplete', null),
            matching: new Notify(this.connection, 'matching', null),
            matched: new Notify(this.connection, 'matched', function(args) {
                if (self.matchedCallback) {
                    self.matchedCallback(args.enemyName);
                }
            }),
            enemyResign: new Notify(this.connection, 'enemyResign', function(args) {
                if (self.enemyResignCallback) {
                    self.enemyResignCallback();
                }
            }, true),
            startTurn: new Notify(this.connection, 'startTurn', function(args) {
                if (self.startTurnCallback) {
                    self.startTurnCallback(args.drawCardKey, args.deckAmount, args.fatigue);
                }
            }, true),
            startEnemyTurn: new Notify(this.connection, 'startEnemyTurn', function(args) {
                if (self.startEnemyTurnCallback) {
                    self.startEnemyTurnCallback(args.drawCardKey, args.deckAmount, args.fatigue);
                }
            }, true),

            victory: new Notify(this.connection, 'victory', function() {
                if (self.victoryCallback) {
                    self.victoryCallback();
                }
            }, true),

            defeat: new Notify(this.connection, 'defeat', function() {
                if (self.defeatCallback) {
                    self.defeatCallback();
                }
            }, true),

            exitBattle: new Notify(this.connection, 'exitBattle', null),
        };

        var self = this;
        // this.connection.on('message', function(event) {
        this.connection.onMessageCallback = function(message) {
            console.log('connection.onMessageCallback "message": ' + message.type);
            self.messageQueue.push(message);
        };
    },

    dispatch: function() {
        while (this.messageQueue.length > 0) {
            var message = this.messageQueue.shift();

            var notify = this.notifys[message.type];
            if (notify) {
                if (notify.onReceive) {
                    if (!notify.isOperation) {
                        notify.onReceive(message.args);
                    } else {
                        this.enemyOperationQueue.push(message);
                        if (!this.isEnemyOperationProcessing) {
                            this.dispatchEnemyOperation();
                        }
                    }
                }
            }

            var request = this.requests[message.type];
            if (request) {
                if (request.onResponce) {
                    request.onResponce(message.args);
                }
            }
        }
    },

    onEnemyOperationProcessed: function() {
        this.isEnemyOperationProcessing = false;
        this.dispatchEnemyOperation();
    },

    initializeBattle: function() {
        this.enemyOperationQueue = [];
        this.isEnemyOperationProcessing = false;
    },

    dispatchEnemyOperation: function() {
        if (this.enemyOperationQueue.length < 1) {
            this.isEnemyOperationProcessing = false;
            return;
        }

        var message = this.enemyOperationQueue.shift();

        console.log('[network] dispatchEnemyOperation: ' + message.type);

        var notify = this.notifys[message.type];
        if (notify) {
            if (notify.onReceive) {
                this.isEnemyOperationProcessing = true;
                notify.onReceive(message.args);
                return;
            }
        }
        this.isEnemyOperationProcessing = false;
    },

    login: function(name, callback) {
        var args = {
            name: name
        };
        this.requests['login'].send(args, function(args) {
            callback(args.isSuccess, args.name);
        });
    },

    startMatching: function() {
        this.connection.isLocal = false;
        this.notifys['matching'].send({});
    },

    startSinglePlay: function() {
        this.connection.isLocal = true;
        this.connection.localServer.startBattle(); // TODO: メッセージ送信にする
        if (this.matchedCallback) {
            this.matchedCallback('AI');
        }
    },

    ready: function(callback) {
        this.requests['ready'].send({}, function(args) {
            callback(args.team, args.hand, args.deckAmount, args.enemyHandCount, args.enemyDeckAmount);
        });
    },

    mulligan: function(cancelCardIndexList, callback) {
        var args = {
            cancelCardIndexList: cancelCardIndexList,
        };
        this.requests['mulligan'].send(args, function(args) {
            callback(args.newCardKeys);
        });
    },

    mulliganEnd: function() {
        this.notifys['mulliganEnd'].send({});
    },

    useCard: function(handIndex, gridIndex) {
        var args = {
            handIndex: handIndex,
            gridIndex: gridIndex,
        };
        this.notifys['useCard'].send(args);
    },

    manualAttack: function(attackerIndex, targetIndex) {
        var args = {
            attackerIndex: attackerIndex,
            targetIndex: targetIndex,
        };
        this.notifys['manualAttack'].send(args);
    },

    moveMinion: function(gridIndex, step) {
        var args = {
            gridIndex: gridIndex,
            step: step,
        };
        this.notifys['moveMinion'].send(args);
    },

    endTurn: function() {
        this.notifys['endTurn'].send({});
    },

    endTurnComplete: function() {
        this.notifys['endTurnComplete'].send({});
    },

    exitBattle: function() {
        this.notifys['exitBattle'].send({});
    },
});
