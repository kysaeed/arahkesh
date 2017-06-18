'use strict';

var PlayerModel = function(player) {
    this.king = {
        hp: player.minionGrid.king.hp,
        maxHp: player.minionGrid.king.hp,
    };

    var minions = [];
    player.minionGrid.minions.forEach(function(minion) {
        var minionModel = {
            key: minion.key,
            cost: minion.cost,
            minionType: minion.minionType,
            at: minion.at,
            hp: minion.hp,
            maxHp: minion.maxHp,
            isManualAttacked: false,
        };
    });

    this.deck = [];
    this.hand = [];
};

PlayerModel.prototype = {
    addMinion: function() {

    },
};

var Attempter = function() {
    this.attemptTree = null;
};

Attempter.prototype.startAttempt = function(player, enemyPlayer) {
    this.attemptTree = this.createRootAttemptNode(player, enemyPlayer);
    this.attemptTree.useCardCounter = this.createUseCardCounter(player);
    return this.attemptTree;
};

Attempter.prototype.createUseCardCounter = function(player) {
    var useCardCounter = {};
    player.hand.forEach(function(cardKey) {
        if (!useCardCounter[cardKey]) {
            useCardCounter[cardKey] = 1;
        } else {
            useCardCounter[cardKey]++;
        }
    });
    return useCardCounter;
};

Attempter.prototype.isAvalableCard = function(cardKey, node) {
    if (!node.useCardCounter[cardKey]) {
        return false;
    }
    return true;
};

Attempter.prototype.markUseCard = function(cardKey, useCardCounter) {
    var newUseCardCounter = {};
    for (var key in useCardCounter) {
        if (useCardCounter.hasOwnProperty(key)) {
            newUseCardCounter[key] = useCardCounter[key];
        }
    }
    newUseCardCounter.__proto__ = useCardCounter.__proto__;

    if (!newUseCardCounter[cardKey]) {
        return newUseCardCounter;
    }

    newUseCardCounter[cardKey]--;
    return newUseCardCounter;
};

Attempter.prototype.attemptUseCard = function(node, cardIndex, gridIndex) {
    var player = node.players[0];
    var cardKey = player.hand[cardIndex];
    var cardParam = Const.CardParam[cardKey];

    if (player.coin < cardParam.cost) {
        return false;
    }

    node.operation = {
        type: 'useCard',
        args: {
            handIndex: cardIndex,
            gridIndex: gridIndex,
        },
    };
    player.coin -= cardParam.cost;

    var newHand = [];
    for (var i = 0; i < player.hand.length; i++) {
        if (i != cardIndex) {
            newHand.push(player.hand[i]);
        }
    }
    player.hand = newHand;

    if (cardParam.cardType == Const.CardType.Minion) {
        player.addMinion(gridIndex, cardKey);
    }
    if (cardParam.cardType == Const.CardType.Spell) {
        player.coin += 1;
    }

    return true;
};

Attempter.prototype.attemptAutoAttack = function(player, enemyPlayer) {
    if (player.minions.length > 0) {
        var autoAttackTargetCount = 1;
        var rankType = (player.minions.length % 2);
        var enemyRankType = (enemyPlayer.minions.length % 2);

        if (rankType != enemyRankType) {
            autoAttackTargetCount++;
        }

        var autoAttack = function(index) {
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
                if (enemyPlayer.king.hp < 0) {
                    enemyPlayer.king.hp = 0;
                }
            }
        };

        var heal = function(index) {
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
};

Attempter.prototype.attemptManualAttack = function(node, attackerIndex, targetIndex) {
    var player = node.players[0];
    var enemyPlayer = node.players[1];

    if ((attackerIndex < 0) || (attackerIndex >= player.minions.length)) {
        return false;
    }

    var attacker = player.minions[attackerIndex];
    if (targetIndex < 0) {
        attacker.isManualAttacked = true;
        return true;
    }

    if ((targetIndex < 0) || (targetIndex >= enemyPlayer.minions.length)) {
        return false;
    }
    var target = enemyPlayer.minions[targetIndex];

    if (attacker.isManualAttacked) {
        return false;
    }

    target.hp -= attacker.hp;
    if (target.hp < 0) {
        target.hp = 0;
    }

    attacker.hp -= target.at;
    if (attacker.hp < 0) {
        attacker.hp = 0;
    }

    attacker.isManualAttacked = true;

    node.operation = {
        type: 'manualAttack',
        args: {
            attackerIndex: attackerIndex,
            targetIndex: targetIndex,
        }
    };

    return true;
};

Attempter.prototype.startMoveMinion = function(node) {
    var minionIndexList = [];
    var count = node.players[0].minions.length;
    for (var i = 0; i < count; i++) {
        minionIndexList.push(i);
    }
    node.minionIndexList = minionIndexList;
};

Attempter.prototype.attemptMoveMinion = function(node, gridIndex, step) {
    var player = node.players[0];
    var swapIndex = gridIndex + step;

    player.coin -= 1;

    var newMinions = player.minions.slice(0);
    var swapMinion = newMinions[swapIndex];
    newMinions[swapIndex] = newMinions[gridIndex];
    newMinions[gridIndex] = swapMinion;
    player.minions = newMinions;

    var newMinionIndexList = node.minionIndexList.slice(0);
    var swapNumber = newMinionIndexList[swapIndex];
    newMinionIndexList[swapIndex] = newMinionIndexList[gridIndex];
    newMinionIndexList[gridIndex] = swapNumber;
    node.minionIndexList = newMinionIndexList;

    node.operation = {
        type: 'moveMinion',
        args: {
            gridIndex: gridIndex,
            step: step,
        }
    };

    return true;
};

Attempter.prototype.entombDeadMinions = function(node) {
    function entomb(player) {
        var alliveMinions = [];
        player.minions.forEach(function(minion) {
            if (minion.hp > 0) {
                alliveMinions.push(minion);
            }
        });
        player.minions = alliveMinions;
    }

    entomb(node.players[0]);
    entomb(node.players[1]);
};

Attempter.prototype.createRootAttemptNode = function(player, enemyPlayer) {
    var useCardCounter = {};
    player.hand.forEach(function(cardKey) {
        if (!useCardCounter[cardKey]) {
            useCardCounter[cardKey] = 1;
        } else {
            useCardCounter[cardKey]++;
        }
    });

    var node = {
        parent: null,
        players: [player, enemyPlayer],
        useCardCounter: {},
        children: [],
        operation: null,
        minionIndexList: null,
        manualAttackScoreList: [],
        score: 0,
    };
    return node;
};

Attempter.prototype.createAttemptNode = function(parent) {
    // console.log('createAttemptNode : enter');
    var newNode = {
        parent: parent,
        players: [
            parent.players[0].clone(),
            parent.players[1].clone()
        ],
        useCardCounter: parent.useCardCounter,
        children: [],
        minionIndexList: parent.minionIndexList,
        operation: null,
        manualAttackScoreList: parent.manualAttackScoreList,
        score: 0,
    };
    parent.children.push(newNode);

    return newNode;
};

var Ai = function() {
    this.attemper = new Attempter();
    this.sendMessageCallback = null;
};

Ai.prototype.think = function(player, enemyPlayer) {
    console.log('AI-think!');

    this.highScoreNode = null;

    (function thinkStep(self, baseNode) {

        for (var attackerIndex = 0; attackerIndex < baseNode.players[0].minions.length; attackerIndex++) {
            if (baseNode.players[0].minions[attackerIndex].minionType == Const.MinionType.ManualAttack) {
                if (!baseNode.players[0].minions[attackerIndex].isManualAttacked) {
                    for (var targetIndex = -1; targetIndex < baseNode.players[1].minions.length; targetIndex++) {
                        var node = self.attemper.createAttemptNode(baseNode);
                        node.players = [
                            baseNode.players[0].cloneBoard(),
                            baseNode.players[1].cloneBoard()
                        ];
                        self.attemper.attemptManualAttack(node, attackerIndex, targetIndex);
                        var manualAttackScoreList = node.manualAttackScoreList.slice(0);
                        manualAttackScoreList.push(self.evaluationManualAttackResult(node.players[0], node.players[1], attackerIndex, targetIndex));
                        self.attemper.entombDeadMinions(node);
                        thinkStep(self, node);
                    }
                    return;
                }
            }
        }

        var players = [
            baseNode.players[0].cloneBoard(),
            baseNode.players[1].cloneBoard()
        ];

        self.attemper.attemptAutoAttack(players[0], players[1]);
        var score = self.evaluation(players[0], players[1]);
        baseNode.manualAttackScoreList.forEach(function(manualAttackScore) {
            score += manualAttackScore;
        });
        baseNode.score = score;

        if (self.highScoreNode == null) {
            self.highScoreNode = baseNode;
        } else {
            if (self.highScoreNode.score < baseNode.score) {
                self.highScoreNode = baseNode;
            }
        }

        var player = baseNode.players[0];


        var coinIndex = player.hand.indexOf('Coin');
        if (coinIndex >= 0) {
            var node = self.attemper.createAttemptNode(baseNode);
            self.attemper.attemptUseCard(node, coinIndex, null);
            thinkStep(self, node);
        }

        var useCardCounter = baseNode.useCardCounter;
        player.hand.forEach(function(cardKey, cardIndex) {
            var cardParam = Const.CardParam[cardKey];
            if (player.coin >= cardParam.cost) {
                if (cardParam.cardType == Const.CardType.Minion) {
                    if (player.minions.length < 7) {
                        if (self.attemper.isAvalableCard(cardKey, baseNode)) {
                            useCardCounter = self.attemper.markUseCard(cardKey, useCardCounter);
                            for (var index = 0; index <= player.minions.length; index++) {
                                var node = self.attemper.createAttemptNode(baseNode);
                                node.useCardCounter = useCardCounter;
                                self.attemper.attemptUseCard(node, cardIndex, index);
                                thinkStep(self, node);
                            }
                        }
                    }
                }
            }
        });
    })(this, this.attemper.startAttempt(player, enemyPlayer));

    this.attemper.startMoveMinion(this.highScoreNode);
    (function thinkStepMoveMinion(self, baseNode, stepLimit) {
        var players = [
            baseNode.players[0].cloneBoard(),
            baseNode.players[1].cloneBoard()
        ];
        self.attemper.attemptAutoAttack(players[0], players[1]);
        var score = self.evaluation(players[0], players[1]);
        baseNode.score = score;

        if (self.highScoreNode == null) {
            self.highScoreNode = baseNode;
        } else {
            if (self.highScoreNode.score < baseNode.score) {
                self.highScoreNode = baseNode;
            }
        }

        if (stepLimit <= 0) {
            return;
        }
        stepLimit--;

        var player = baseNode.players[0];
        if (player.coin > 1) {
            for (var i = 0; i < (player.minions.length - 1); i++) {
                var swapTargetIndex = i + 1;
                if (baseNode.minionIndexList[swapTargetIndex] != i) {
                    var node = self.attemper.createAttemptNode(baseNode);
                    self.attemper.attemptMoveMinion(node, i, 1);
                    thinkStepMoveMinion(self, node, (stepLimit - 1));
                }
            }
        }

    })(this, this.highScoreNode, 6);

    var node = this.highScoreNode;
    var operationSequence = [];
    while (node != null) {
        if (node.operation) {
            operationSequence.unshift(node.operation);
        }
        node = node.parent;
    }
    console.log('AI-think end.');

    return operationSequence;
};

Ai.prototype.evaluationManualAttackResult = function(player, enemyPlayer, attackerIndex, targetIndex) {
    var score = 0;

    var minion = player.minions[attackerIndex];
    if (minion.minionType == Const.MinionType.ManualAttack) {
        if (minion.hp <= 0) {
            score -= (minion.maxHp) * minion.cost * 5;
        }
    }

    if (targetIndex >= 0) {
        if (minion.hp <= 0) {
            var minion = enemyPlayer.minions[targetIndex];
            var typeParam = 10;
            if (minion.minionType == Const.MinionType.ManualAttack) {
                typeParam = 5;
            }
            if (minion.minionType == Const.MinionType.ManualHeal) {
                typeParam = 18;
            }

            if (minion.hp <= 0) {
                score += (minion.cost * minion.maxHp) * typeParam;
            }
        }
    }

    return score;
};

Ai.prototype.evaluation = function(player, enemyPlayer) {
    var score = 0;
    score += player.hand.length;

    /*
    if (player.deck.indexOf('Knight') >= 0) {
        score += 1800;
    }
    */

    player.minions.forEach(function(minion) {
        var typeParam = 10;
        if (minion.minionType == Const.MinionType.ManualAttack) {
            typeParam = 5;
        }
        if (minion.minionType == Const.MinionType.ManualHeal) {
            typeParam = 12;
        }
        score -= (minion.maxHp - minion.hp) * minion.cost * typeParam;
    });

    score += (enemyPlayer.king.maxHp - enemyPlayer.king.hp);
    enemyPlayer.minions.forEach(function(minion) {
        var typeParam = 10;
        if (minion.minionType == Const.MinionType.ManualAttack) {
            typeParam = 15;
        }
        if (minion.minionType == Const.MinionType.ManualHeal) {
            typeParam = 12;
        }

        score -= (minion.hp * typeParam) * minion.cost;
        if (minion.hp <= 0) {
            score += (minion.cost) * typeParam;
        }
    });

    if (enemyPlayer.king.hp - enemyPlayer.fatigue <= 0) {
        score += 100000;
    } else {
        if (enemyPlayer.deck.length <= 0) {
            if (enemyPlayer.king.hp - (enemyPlayer.fatigue + 1) <= 0) {
                score += 100000;
            }
        }
    }

    var isEnemyHasQueen = (enemyPlayer.hand.indexOf('Queen') > -1) || (enemyPlayer.deck.indexOf('Queen') > -1);
    if (isEnemyHasQueen) {
        if (player.hand.indexOf('Knight') >= 0) {
            if (player.deck.indexOf('Knight') >= 0) {
                score += 200;
            } else {
                score += 400;
            }
        }
    }

    return score;
};

Ai.prototype.go = function() {
    this.send('ready', {});

    this.send('mulligan', {
        cancelCardIndexList: []
    });
    this.send('mulliganEnd', {});
};

Ai.prototype.onMessage = function(client, type, args) {
    // console.log('*AI* get message : ' + type);

    if (type == 'startTurn') {
        var operationSequence = this.think(client.player, client.enemyClient.player);

        while (operationSequence.length > 0) {
            var message = operationSequence.shift();
            this.send(message.type, message.args);
            console.log(message.type);
        }

        ///////// TEST
        // this.dumpTree();
        //////////////

        this.send('endTurn', {});
        this.send('endTurnComplete', {});
    }
    if (type == 'endTurn') {
        this.send('endTurnComplete', {});
    }
};

Ai.prototype.send = function(type, args) {
    // console.log('*AI* say : ' + type + ' args=' + JSON.stringify(args));
    if (this.sendMessageCallback) {
        this.sendMessageCallback(type, args);
    }
};

Ai.prototype.dumpTree = function() {
    (function dumpNode(node, step) {
        var indentString = '';
        for (var i = 0; i < step; i++) {
            indentString += '    ';
        }

        var player = node.players[0];

        var logText = indentString + '[]' + node.score + ']' + 'HAND: ' + player.hand + ' COIN:' + player.coin;
        if (node.operation) {
            logText += ' OP:' + node.operation.type;
            if (node.operation.args.handIndex != null) {
                logText += ' (handIndex:' + node.operation.args.handIndex + ')';
            }
        }
        logText += '  minions:' + player.minions;
        console.log(logText);

        ++step;
        node.children.forEach(function(childNode) {
            dumpNode(childNode, step);
        });
    })(this.attemper.attemptTree, 0);
};
