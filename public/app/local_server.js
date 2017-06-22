'use strict';

var LocalServer = (function() {

    var PlayerModel = function(playerId) {
        this.playerId = playerId;
        this.isReady = false;

        this.isMulliganEnd = false;
        this.isWaitFirstTurn = false;

        this.hasControl = false;
        this.team = null;
        this.coin = 0;
        this.maxCoin = 0;
        this.minions = [];
        this.hand = [];
        this.deck = [];
        this.fatigue = 0;
        this.isCompleteStartTurn = false;
        this.isCompleteEndTurn = false;
        this.isGameEnd = false;

        this.king = {
            minionType: Const.MinionType.King,
            at: 0,
            hp: 10,
            maxHp: 10,
        };
    };

    PlayerModel.prototype = {
        createDeck: function() {
            var deck = [];
            for (var i = 0; i < 8; i++) {
                deck.push('Pawn');
            }
            for (var i = 0; i < 2; i++) {
                deck.push('Bishop');
            }
            for (var i = 0; i < 2; i++) {
                deck.push('Knight');
            }
            for (var i = 0; i < 2; i++) {
                deck.push('Rook');
            }
            deck.push('Queen');

            this.deck = deck;
        },

        shuffleDeck: function() {
            for (var i = (this.deck.length - 1); i > 0; i--) {
                var swapIndex = Math.floor(Math.random() * (i + 1));
                var temp = this.deck[i];
                this.deck[i] = this.deck[swapIndex];
                this.deck[swapIndex] = temp;
            }
        },

        addMinion: function(index, key) {
            if ((index < 0) || (index > this.minions.length)) {
                return;
            }

            var param = Const.CardParam[key];
            if (!param) {
                return;
            }
            if (param.cardType != Const.CardType.Minion) {
                return;
            }

            var addMinion = {
                key: key,
                name: param.name,
                cost: param.cost,
                minionType: param.minionType,
                at: param.at,
                hp: param.hp,
                maxHp: param.hp,
                isManualAttacked: false,
            };

            var newMinions = this.minions.slice(0);
            newMinions.splice(index, 0, addMinion);
            this.minions = newMinions;
        },

        addMaxCoin: function(add) {
            this.maxCoin += add;
            if (this.maxCoin > 10) {
                this.maxCoin = 10;
            }

        },

        entombDeadMinions: function() {
            var alliveMinions = [];
            for (var i = 0; i < this.minions.length; i++) {
                if (this.minions[i].hp > 0) {
                    alliveMinions.push(this.minions[i]);
                }
            }
            this.minions = alliveMinions;
        },

        fullRecoverCoin: function() {
            this.coin = this.maxCoin;
        },

        clone: function() {
            var clonePlayer = {};
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    clonePlayer[key] = this[key];
                }
            }
            clonePlayer.__proto__ = this.__proto__;
            return clonePlayer;
        },

        cloneBoard: function() {
            function cloneMinion(minion) {
                var cloneMinion = {};
                for (var key in minion) {
                    if (minion.hasOwnProperty(key)) {
                        cloneMinion[key] = minion[key];
                    }
                }
                cloneMinion.__proto__ = minion.__proto__;
                return cloneMinion;
            }

            var clonePlayer = this.clone();
            clonePlayer.minions = [];
            this.minions.forEach(function(minion) {
                clonePlayer.minions.push(cloneMinion(minion));
            });
            clonePlayer.king = cloneMinion(this.king);
            return clonePlayer;
        },
    };

    var Client = function(connection) {
        this.connection = connection;
        this.isLogin = true;
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

            this.connection.onLocalMessage(data);
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

    var AiClient = function() {
        this.ai = new Ai();
        var self = this;
        this.ai.sendMessageCallback = function(type, args) {
            self.onMessage(type, args);
        };

        this.isLogin = true;
        this.name = 'AI';
        this.currentRoom = null;

        this.player = null;
        this.enemyClient = null;
    };

    AiClient.prototype = {
        send: function(type, args) {
            // console.log('ai-client.send(): ' + type + ' ' + JSON.stringify(args));
            this.ai.onMessage(this, type, args);
        },

        onMessage: function(type, args) {
            var self = this;
            setTimeout(function() {
                if (self.currentRoom) {
                    self.currentRoom.onMessage(self, type, args);
                }
            }, 10);
        },

        onDisconnect: function() {
            if (this.currentRoom) {
                this.currentRoom.onDisconnect(this);
            }
        },
    };

    var BattleRoom = Class.create({
        initialize: function() {

            this.FirstHandCardCount = [
                3,
                4
            ];

            this.onExit = null;
            var self = this;
            var createHandlers = function() {
                var sendStartTurn = function(client) {
                    var player = client.player;
                    var enemyPlayer = client.enemyClient.player;

                    if (!player.isReady) {
                        return;
                    }

                    player.addMaxCoin(1);
                    player.fullRecoverCoin();
                    player.minions.forEach(function(minion) {
                        minion.isManualAttacked = false;
                    });

                    if (player.deck.length > 0) {
                        var drawCardKey = player.deck.pop();
                        if (player.hand.length < 10) {
                            player.hand.push(drawCardKey);
                        }
                    } else {
                        player.fatigue++;
                        player.king.hp -= client.player.fatigue;
                    }

                    ///////////////////////////////////////////
                    console.log(client.name + ' ===========================');
                    console.log(' hand: ' + player.hand);
                    ///////////////////////////////////////////

                    client.send('startTurn', {
                        drawCardKey: drawCardKey,
                        deckAmount: player.deck.length,
                        fatigue: player.fatigue,
                    });


                    client.enemyClient.send('startEnemyTurn', {
                        deckAmount: player.deck.length,
                        fatigue: player.fatigue,
                    });

                    if (player.king.hp <= 0) {
                        sendVictory(client.enemyClient);
                    }
                };

                var sendVictory = function(client) {
                    client.player.isGameEnd = true;
                    client.enemyClient.player.isGameEnd = true;

                    client.send('victory', {});
                    client.enemyClient.send('defeat', {});
                };

                var handlers = {
                    ready: function(client, type, args) {
                        if (!client.isLogin) {
                            return;
                        }

                        var player = client.player;
                        var enemyPlayer = client.enemyClient.player;
                        if (player.isReady) {
                            return;
                        }
                        player.isReady = true;

                        var data = {
                            team: player.team,
                            hand: player.hand,
                            deckAmount: player.deck.length,
                            enemyHandCount: enemyPlayer.hand.length,
                            enemyDeckAmount: enemyPlayer.deck.length,
                        };
                        client.send(type, data);
                    },

                    mulligan: function(client, type, args) {
                        var player = client.player;
                        var enemyPlayer = client.enemyClient.player;

                        if (!player.isReady) {
                            return;
                        }

                        args.cancelCardIndexList.forEach(function(index) {
                            var key = player.hand[index];
                            if ((index > -1) && (index < player.hand.length)) {
                                player.hand[index] = '';
                                player.deck.push(key);
                            }
                        });
                        player.shuffleDeck();

                        var newCardKeys = [];
                        args.cancelCardIndexList.forEach(function(index) {
                            var key = player.deck.pop();
                            newCardKeys.push(key);
                            if ((index > -1) && (index < player.hand.length)) {
                                player.hand[index] = key;
                            }
                        });
                        var data = {
                            newCardKeys: newCardKeys
                        };

                        player.isMulliganEnd = true;
                        client.send(type, data);

                        if (player.isMulliganEnd && enemyPlayer.isMulliganEnd) {
                            var notifyClients = [
                                client,
                                client.enemyClient
                            ];

                            var self = this;
                            notifyClients.forEach(function(client) {
                                var player = client.player;
                                var data = {
                                    isFirstPlayer: player.hasControl,
                                    deckAmount: player.deck.length,
                                };

                                if (player.team == Const.TeamType.Black) {
                                    player.hand.push('Coin');
                                }
                                client.send('mulliganEnd', data);
                            });


                        }
                    },

                    mulliganEnd: function(client, type, args) {
                        var player = client.player;
                        var enemyPlayer = client.enemyClient.player;
                        player.isWaitFirstTurn = true;
                        if (player.isWaitFirstTurn && enemyPlayer.isWaitFirstTurn) {
                            if (player.hasControl) {
                                sendStartTurn(client);
                            } else {
                                sendStartTurn(client.enemyClient);
                            }
                        }
                    },

                    startTurnComplete: function(clinet, type, args) {
                        var player = clinet.player;
                    },

                    useCard: function(client, type, args) {
                        var player = client.player;
                        if (!player.isReady) {
                            return;
                        }

                        if (!player.hasControl) {
                            return;
                        }

                        if (player.isGameEnd) {
                            return;
                        }

                        if ((args.handIndex < 0) || (args.handIndex >= player.hand.length)) {
                            return;
                        }

                        var cardKey = player.hand[args.handIndex];
                        player.hand.splice(args.handIndex, 1);

                        console.log('use card: no.' + args.handIndex);
                        console.log('use card: key=' + cardKey);

                        var param = Const.CardParam[cardKey];
                        if (param.cost > client.player.coin) {
                            return;
                        }
                        player.coin -= param.cost;
                        if (param.cardType == Const.CardType.Minion) {
                            player.addMinion(args.gridIndex, cardKey);
                        } else if (param.cardType == Const.CardType.Spell) {
                            player.coin += 1;
                        }

                        var data = {
                            useCardKey: cardKey,
                            handIndex: args.handIndex,
                            gridIndex: args.gridIndex,
                        };

                        var enemyClient = client.enemyClient;
                        enemyClient.send(type, data);
                    },

                    manualAttack: function(client, type, args) {
                        var player = client.player;
                        if (!player.isReady) {
                            return;
                        }

                        if (!player.hasControl) {
                            return;
                        }

                        var enemyClient = client.enemyClient;
                        if ((args.attackerIndex < 0) || (args.attackerIndex >= client.player.minions.length)) {
                            return;
                        }
                        if ((args.targetIndex < 0) || (args.targetIndex >= enemyClient.player.minions.length)) {
                            return;
                        }

                        var attacker = player.minions[args.attackerIndex];
                        var target = enemyClient.player.minions[args.targetIndex];

                        if (attacker.isManualAttacked) {
                            return;
                        }

                        // console.log('manualAttack: befor attacker.hp=' + attacker.hp + ' target.hp=' + target.hp);
                        target.hp -= attacker.at;
                        if (target.hp < 0) {
                            target.hp = 0;
                        }

                        attacker.hp -= target.at;
                        if (attacker.hp < 0) {
                            attacker.hp = 0;
                        }
                        // console.log('manualAttack: after attacker.hp=' + attacker.hp + ' target.hp=' + target.hp);

                        attacker.isManualAttacked = true;
                        client.player.entombDeadMinions();
                        // console.log('manualAttack: befor entomb minions=' + enemyClient.player.minions);
                        enemyClient.player.entombDeadMinions();
                        // console.log('manualAttack: after entomb minions=' + enemyClient.player.minions);

                        var data = {
                            attackerIndex: args.attackerIndex,
                            targetIndex: args.targetIndex,
                        };

                        enemyClient.send(type, data);
                    },

                    moveMinion: function(client, type, args) {
                        var player = client.player;
                        if (!player.isReady) {
                            return;
                        }

                        if (!player.hasControl) {
                            return;
                        }

                        if (player.coin < 1) {
                            return;
                        }
                        player.coin -= 1;

                        if ((args.step > 1) || (args.step < -1)) {
                            return;
                        }

                        var swapTargetIndex = args.gridIndex + args.step;
                        if ((args.gridIndex < 0) || (args.gridIndex >= player.minions.length)) {
                            return;
                        }
                        if ((swapTargetIndex < 0) || (swapTargetIndex >= player.minions.length)) {
                            return;
                        }

                        var minion = player.minions[args.gridIndex];
                        player.minions[args.gridIndex] = player.minions[swapTargetIndex];
                        player.minions[swapTargetIndex] = minion;

                        var data = {
                            gridIndex: args.gridIndex,
                            step: args.step,
                        };
                        client.enemyClient.send(type, data);
                    },

                    endTurn: function(client, type, args) {
                        var player = client.player;
                        var enemyPlayer = client.enemyClient.player;

                        if (!player.isReady) {
                            return;
                        }

                        if (!player.hasControl) {
                            return;
                        }

                        if (player.minions.length > 0) {
                            var autoAttackTargetCount = 1;
                            var rankType = (player.minions.length % 2);
                            var enemyRankType = (enemyPlayer.minions.length % 2);

                            if (rankType != enemyRankType) {
                                autoAttackTargetCount++;
                            }

                            function autoAttack(index) {
                                var minionCount = player.minions.length;
                                var rankDiff = Math.floor((enemyPlayer.minions.length - player.minions.length) / 2);
                                var isAttacked = false;
                                for (var i = 0; i < autoAttackTargetCount; i++) {
                                    var enemyPosIndex = rankDiff + index + i;
                                    if ((enemyPosIndex > -1) && (enemyPosIndex < enemyPlayer.minions.length)) {
                                        enemyPlayer.minions[enemyPosIndex].hp -= player.minions[index].at;
                                        if (enemyPlayer.minions[enemyPosIndex].hp < 0) {
                                            enemyPlayer.minions[enemyPosIndex].hp = 0;
                                        }
                                        isAttacked = true;
                                    }
                                }
                                if (!isAttacked) {
                                    enemyPlayer.king.hp -= player.minions[index].at;
                                    console.log('hit to king damage=' + player.minions[index].at + ' king-hp=' + enemyPlayer.king.hp);
                                    if (enemyPlayer.king.hp < 0) {
                                        enemyPlayer.king.hp = 0;
                                    }
                                }
                            };

                            function heal(index) {
                                var targetOffset = [-1, 1];
                                for (var i = 0; i < 2; i++) {
                                    var targetIndex = index + targetOffset[i];
                                    if ((targetIndex >= 0) && (targetIndex < player.minions.length)) {
                                        player.minions[targetIndex].hp += 2;
                                        if (player.minions[targetIndex].hp > player.minions[targetIndex].maxHp) {
                                            player.minions[targetIndex].hp = player.minions[targetIndex].maxHp;
                                        }
                                    }
                                }
                            };

                            for (var i = 0; i < player.minions.length; i++) {
                                if (player.minions[i].minionType == Const.MinionType.AutoAttack) {
                                    autoAttack(i);
                                }
                                if (player.minions[i].minionType == Const.MinionType.Heal) {
                                    heal(i);
                                }
                            }

                        }
                        enemyPlayer.entombDeadMinions();

                        var enemyClient = client.enemyClient;
                        ////////////////// TEST
                        var logString = '';
                        enemyPlayer.minions.forEach(function(m) {
                            logString += m.name + '(' + m.hp + '),';
                        });
                        console.log(enemyClient.name + ':' + logString);
                        var logString = '';
                        player.minions.forEach(function(m) {
                            logString += m.name + '(' + m.hp + '),';
                        });
                        console.log(client.name + ':' + logString);
                        console.log(client.name + '-king:hp=' + player.king.hp + ' ' + enemyClient.name + '-king:hp=' + enemyClient.player.king.hp);
                        //////////////////
                        enemyClient.send(type, {});
                    },

                    endTurnComplete: function(client, type, args) {
                        var player = client.player;
                        var enemyPlayer = client.enemyClient.player;

                        player.isCompleteEndTurn = true;
                        if (enemyPlayer.isCompleteEndTurn) {
                            player.isCompleteEndTurn = false;
                            enemyPlayer.isCompleteEndTurn = false;

                            if ((player.king.hp > 0) && (enemyPlayer.king.hp > 0)) {
                                if (player.hasControl) {
                                    player.hasControl = false;
                                    enemyPlayer.hasControl = true;
                                    sendStartTurn(client.enemyClient);
                                } else {
                                    player.hasControl = true;
                                    enemyPlayer.hasControl = false;
                                    sendStartTurn(client);
                                }
                            } else {
                                if (enemyPlayer.king.hp <= 0) {
                                    sendVictory(client);
                                } else {
                                    sendVictory(client.enemyClient);
                                }
                            }
                        }
                    },

                    exitBattle: function(client, type, args) {
                        if (client.player.isGameEnd) {
                            client.enemyClient = null;
                            client.player = null;
                            if (self.onExit) {

                                self.onExit(client);

                            }
                        }
                    },
                };

                return handlers;
            };

            this.handlers = createHandlers();
        },


        enter: function(clients) {
            if (clients.length != 2) {
                return false;
            }
            console.log('BattleRoom.enter: ' + clients[0].name + ', ' + clients[1].name);

            clients.forEach(function(client, index) {
                client.player = new PlayerModel(index);
            });

            clients[0].enemyClient = clients[1];
            clients[1].enemyClient = clients[0];

            var firstPlayerId = Math.floor(Math.random() * 2);
            clients.forEach(function(client, id) {
                if (id == firstPlayerId) {
                    client.player.team = Const.TeamType.White;
                    client.player.hasControl = true;
                } else {
                    client.player.team = Const.TeamType.Black;
                    client.player.hasControl = false;
                }
            });

            /*
            clients[0].player.team = Const.TeamType.White;
            clients[1].player.team = Const.TeamType.Black;
            clients[0].player.hasControl = true;
            clients[1].player.hasControl = false;
            */

            for (var playerId = 0; playerId < 2; playerId++) {
                clients[playerId].player.createDeck();
                clients[playerId].player.shuffleDeck();
                clients[playerId].player.hand = [];
                for (var i = 0; i < this.FirstHandCardCount[clients[playerId].player.team]; i++) {
                    var key = clients[playerId].player.deck.pop();
                    if (key != null) {
                        clients[playerId].player.hand.push(key);
                    }
                }
            }

            for (var playerId = 0; playerId < 2; playerId++) {
                if (clients[playerId].ai) {
                    clients[playerId].ai.onStartBattle();
                }
            }
            return true;
        },

        onMessage: function(client, type, args) {
            var handler = this.handlers[type];
            if (handler) {
                handler(client, type, args);
            }
        },

        /*
        onDisconnect: function(client) {
            var enemyPlayer = client.enemyClient.player;
            enemyPlayer.isGameEnd = true;
            if (this.onExit) {
                this.onExit(client.enemyClient);
            }

            client.enemyClient.send('enemyResign', {});
        },
        */
    });

    return Class.create({
        initialize: function(localConnection) {
            this.localConnection = localConnection;
            this.battleRoom = new BattleRoom();

            this.clients = [
                new Client(localConnection),
                new AiClient(),
            ];

            var playerClient = this.clients[0];
            localConnection.onSendCallback = function(message) {
                playerClient.onMessage(message.type, message.args);
            };

            this.clients[0].currentRoom = this.battleRoom;
            this.clients[1].currentRoom = this.battleRoom;

        },

        startBattle: function() {
            this.battleRoom.enter(this.clients);
        },
    });
})();
