'use strict';

/*
      Arahkesh
*/

var TurnStartLabel = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);
        this.core = core;

        this.bg = new Sprite(1200, 800);
        this.bg.moveTo(0, 0);
        this.bg.image = core.assets[Resource.TurnStartBg];
        this.addChild(this.bg);

        this.label = new Sprite(600, 200);
        this.label.moveTo(240, 210);
        this.label.image = core.assets[Resource.TurnStartLabel];
        this.addChild(this.label);
    },

    setToOverlay: function(overlay, endCallback) {
        this.moveTo(0, 0);
        this.bg.opacity = 0.0;
        this.label.opacity = 0.0;
        var self = this;
        this.bg.tl.fadeIn(10).then(function() {
            self.label.tl.fadeIn(10).delay(60).fadeOut(10);
        }).delay(80).fadeOut(10).then(function() {
            overlay.removeChild(self);
            endCallback();
        });

        overlay.addChild(this);
    },
});

var EndVictoryLabel = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);
        this.core = core;

        this.bg = new Sprite(1200, 800);
        this.bg.moveTo(0, 0);
        this.bg.image = core.assets[Resource.EndBg];
        this.addChild(this.bg);

        this.label = new Sprite(600, 200);
        this.label.moveTo(240, 210);
        this.label.image = core.assets[Resource.EndVictoryLabel];
        this.addChild(this.label);

        this.labelLight = new Sprite(600, 200);
        this.labelLight.moveTo(240, 210);
        this.labelLight.compositeOperation = 'lighter';
        this.labelLight.image = core.assets[Resource.EndVictoryLabelLight];
        this.addChild(this.labelLight);
    },

    setToOverlay: function(overlay, endCallback) {
        this.moveTo(0, 0);
        this.bg.opacity = 0.0;
        this.label.opacity = 0.0;
        this.labelLight.opacity = 0.0;

        var self = this;
        this.bg.tl.delay(20).fadeIn(10).then(function() {
            self.label.tl.fadeIn(10).delay(10).then(function() {
                self.labelLight.tl.fadeTo(0.5, 16).and().scaleTo(1.2, 1.2, 16).delay(16).fadeOut(6);
            }).delay(290).fadeOut(10);
        }).delay(360).fadeOut(10).then(function() {
            overlay.removeChild(self);
            endCallback();
        });

        overlay.addChild(this);
    },
});

var EndDefeatLabel = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);
        this.core = core;

        this.bg = new Sprite(1200, 800);
        this.bg.moveTo(0, 0);
        this.bg.image = core.assets[Resource.EndBg];
        this.addChild(this.bg);

        this.label = new Sprite(600, 200);
        this.label.moveTo(240, 210);
        this.label.image = core.assets[Resource.EndDefeatLabel];
        this.addChild(this.label);
    },

    setToOverlay: function(overlay, endCallback) {
        this.moveTo(0, 0);
        this.bg.opacity = 0.0;
        this.label.opacity = 0.0;
        var self = this;
        this.bg.tl.delay(20).fadeIn(10).then(function() {
            self.label.tl.fadeIn(10).delay(300).fadeOut(10);
        }).delay(360).fadeOut(10).then(function() {
            overlay.removeChild(self);
            endCallback();
        });

        overlay.addChild(this);
    },
});

var Coin = Class.create(Group, {
    initialize: function(core, player) {
        Group.call(this);

        this.maxCoin = 0;
        this.coin = this.maxCoin;

        var bg = new Sprite(180, 58);
        bg.image = core.assets[Resource.CoinBg];
        bg.moveTo(0, 0);
        bg.opacity = 1.0;
        this.addChild(bg);

        var icon = new Sprite(64, 64);
        icon.image = core.assets[IconResource.Coin[0]];
        icon.originX = 0;
        icon.originY = 0;
        icon.moveTo(4, 4);
        icon.opacity = 1.0;
        icon.scale(0.5, 0.5);
        this.addChild(icon);

        var titleText = new Label('COIN');
        titleText.moveTo(40, 14);
        titleText.color = '#ffffff';
        titleText.font = '24px champage';
        this.addChild(titleText);

        var slashText = new Label('/');
        slashText.moveTo(143, 16);
        slashText.color = '#ffffff';
        slashText.font = '41px champage';
        this.addChild(slashText);

        var coinText = new Label('');
        coinText.width = 84;
        coinText.textAlign = 'center';
        coinText.moveTo(80, 4);
        coinText.color = '#ffffff';
        coinText.font = '41px champage';
        this.addChild(coinText);

        var maxCoinText = new Label('');
        maxCoinText.textAlign = 'center';
        maxCoinText.width = 34;
        maxCoinText.moveTo(147, 40);
        maxCoinText.color = '#ffffff';
        maxCoinText.font = '16px champage';
        this.addChild(maxCoinText);

        this.coinText = coinText;
        this.maxCoinText = maxCoinText;

        this.updateCoinText();
        this.moveTo(1010, 734 - (player.playerId * 728));
        core.currentScene.addChild(this);

        this.coinUseLight = new Sprite(180, 58);
        this.coinUseLight.image = core.assets[Resource.CoinBg]; // TODO: 白の矩形
        this.coinUseLight.moveTo(0, 0);
        this.coinUseLight.scaleX = 1.0;
        this.coinUseLight.scaleY = 1.0;
        this.coinUseLight.compositeOperation = 'lighter';
        this.coinUseLight.opacity = 1.0;

        this.coinUseLabel = new Label('');
        this.coinUseLabel.textAlign = 'center';
        this.coinUseLabel.width = 60;
        this.coinUseLabel.height = 40;
        this.coinUseLabel.color = '#0d0d0d';
        this.coinUseLabel.font = '20px champage';
    },

    setMax: function(max) {
        this.maxCoin = max;
        this.updateCoinText();
    },

    addCoin: function(add) {
        this.coin += add;
        this.updateCoinText();
    },

    use: function(count) {
        if (this.coin < count) {
            return false;
        }
        this.coin -= count;

        var self = this;
        this.coinUseLight.opacity = 1.0;
        this.coinUseLight.tl.fadeOut(12).then(function() {
            self.coinUseLabel.moveTo(0, 0);
            self.coinUseLabel.text = '-' + count;
            self.coinUseLabel.tl.moveBy(0, -20, 60).then(function() {
                self.updateCoinText();
                self.removeChild(self.coinUseLabel);
            });
            self.addChild(self.coinUseLabel);
        });
        this.addChild(this.coinUseLight);

        return true;
    },

    startTurn: function() {
        this.maxCoin++;
        if (this.maxCoin > 10) {
            this.maxCoin = 10;
        }
        this.coin = this.maxCoin;
        this.updateCoinText();
    },

    updateCoinText: function() {
        this.coinText.text = this.coin;
        this.maxCoinText.text = this.maxCoin;
    },
});

var Bullet = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);
        var bullet = new Sprite(64, 64);
        bullet.image = core.assets[Resource.EffectBullet];
        bullet.opacity = 0.5;
        bullet.moveTo(0, 0);
        bullet.scaleX = 0.4;
        bullet.scaleY = 0.4;
        this.addChild(bullet);

        var light = new Sprite(64, 64);
        light.image = core.assets[Resource.EffectBulletLight];
        light.opacity = 1.0;
        light.tl.fadeTo(0.4, 5).fadeTo(1.0, 5).loop();
        light.moveTo(0, 0);
        light.compositeOperation = 'lighter';
        this.addChild(light);
    },
});

var HealBullet = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);

        this.originX = 32;
        this.originY = 32;

        var bullet = new Sprite(64, 64);
        bullet.image = core.assets[Resource.EffectHealBullet];
        bullet.opacity = 0.5;
        bullet.moveTo(0, 0);
        bullet.scaleX = 0.4;
        bullet.scaleY = 0.4;
        this.addChild(bullet);

        var light = new Sprite(64, 64);
        light.image = core.assets[Resource.EffectHealBulletLight];
        light.opacity = 1.0;
        light.tl.fadeTo(0.4, 5).fadeTo(1.0, 5).loop();
        light.moveTo(0, 0);
        light.compositeOperation = 'lighter';
        this.addChild(light);
    },
});

var Minion = Class.create(Group, {
    initialize: function(core, player, key) {
        Group.call(this);

        this.core = core;
        this.player = player;
        this.direction = player.direction;

        this.atCellAsset = core.assets[Resource.AtCell];
        this.hpCellAsset = core.assets[Resource.HpCell];
        this.nullCellAsset = core.assets[Resource.NullCell];

        var param = Const.CardParam[key];
        this.key = key;
        this.minionType = param.minionType;
        this.cost = param.cost;
        this.at = param.at;
        this.maxHp = param.hp;
        this.hp = this.maxHp;
        this.isAttacked = false;

        this.icon = new Sprite(64, 64);
        this.icon.x = 0;
        this.icon.y = 0;
        this.icon.image = core.assets[param.icon[player.team]];
        this.icon.opacity = 0.0;
        this.height = this.icon.height;
        this.width = this.icon.width;

        this.iconAttacked = new Sprite(64, 64);
        this.iconAttacked.x = 0;
        this.iconAttacked.y = 0;
        this.iconAttacked.image = core.assets[Resource.IconAttacked];
        this.iconAttacked.opacity = 0.0;

        this.atTextLabel = null;
        this.hpTextLabel = null;

        var self = this;
        var touchStartCallback = function(event) {
            console.log('AT=' + self.at);
            if (self.player.playerId != 0) {
                return;
            }
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }
            if (self.isAttacked) {
                return;
            }
            if (self.player.isUiLocked) {
                return;
            }

            self.player.minionGrid.clearManualAttackSite();
        };
        var touchMoveCallback = function(event) {
            if (self.player.playerId != 0) {
                return;
            }
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }
            if (self.minionType != Const.MinionType.ManualAttack) {
                return;
            }
            if (self.isAttacked) {
                return;
            }
            if (self.player.isUiLocked) {
                return;
            }

            if ((event.localX >= 0) && (event.localX) < self.icon.width) {
                if ((event.localY >= 0) && (event.localY) < self.icon.height) {
                    self.player.minionGrid.clearManualAttackSite();
                    return;
                }
            }
            self.player.minionGrid.setManualAttackSite(event.x, event.y);
        };
        var touchEndCallback = function(event) {
            if (self.player.playerId != 0) {
                return;
            }
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }

            self.player.minionGrid.clearManualAttackSite();
            if ((event.localX >= 0) && (event.localX) < self.icon.width) {
                if ((event.localY >= 0) && (event.localY) < self.icon.height) {
                    self.player.minionGrid.setFocus(self);
                    return;
                }
            }

            if (self.minionType != Const.MinionType.ManualAttack) {
                return;
            }
            if (self.isAttacked) {
                return;
            }
            if (self.player.isUiLocked) {
                return;
            }
            var enemyMinion = self.player.enemyPlayer.minionGrid.getIntersectToMinion(event.x, event.y);
            if (enemyMinion != null) {

                var attackerIndex = self.player.minionGrid.getMinionIndex(self);
                var targetIndex = self.player.enemyPlayer.minionGrid.getMinionIndex(enemyMinion);
                if ((attackerIndex > -1) && (targetIndex > -1)) {
                    self.core.network.manualAttack(attackerIndex, targetIndex);
                }

                self.player.setLockUiState(true);
                self.startManualAttack(enemyMinion, function() {
                    var entombCount = 0;
                    var entombed = function() {
                        entombCount++;
                        if (entombCount >= 2) {
                            self.player.setLockUiState(false);
                        }
                    };
                    self.player.minionGrid.entombDeadMinions(entombed);
                    self.player.enemyPlayer.minionGrid.entombDeadMinions(entombed);
                });
            }
        };

        if (player.playerId == 0) {
            this.icon.addEventListener('touchstart', touchStartCallback);
            this.icon.addEventListener('touchmove', touchMoveCallback);
            this.icon.addEventListener('touchend', touchEndCallback);

            this.iconAttacked.addEventListener('touchstart', touchStartCallback);
            this.iconAttacked.addEventListener('touchmove', touchMoveCallback);
            this.iconAttacked.addEventListener('touchend', touchEndCallback);
        }

        this.addChild(this.icon);

        this.createDamageLabel();
    },

    enter: function(callback) {
        var light = new Sprite(64, 64);
        light.moveTo(0, 0);
        light.image = this.core.assets[Resource.MinionLight];
        light.compositeOperation = 'lighter';
        light.scaleX = 4.0;
        light.scaleY = 4.0;
        light.opacity = 1.0;
        this.addChild(light);

        var self = this;
        light.tl.fadeOut(20).and().scaleTo(1.0, 1.0, 20).then(function() {
            self.removeChild(light);
        });

        this.icon.opacity = 0.0;
        this.icon.tl.delay(20).fadeTo(1.0, 20).then(function() {
            self.createStatusArea(self.core, self.player.playerId);
            if (callback) {
                callback();
            }
        });
    },

    createStatusArea: function(core, playerId) {
        var minionStatusArea = null;
        var statusY = (this.icon.height / 2) + ((this.icon.height / 2) * this.direction);
        if (this.direction > 0) {
            if (this.minionType != Const.MinionType.King) {
                minionStatusArea = new Sprite(80, 40);
                minionStatusArea.image = core.assets[Resource.MinionStatus];
            } else {
                minionStatusArea = new Sprite(120, 40);
                minionStatusArea.image = core.assets[Resource.KingStatus];
            }
            minionStatusArea.y = statusY;
        } else {
            if (this.minionType != Const.MinionType.King) {
                minionStatusArea = new Sprite(80, 40);
                minionStatusArea.image = core.assets[Resource.MinionStatusE];
            } else {
                minionStatusArea = new Sprite(120, 40);
                minionStatusArea.image = core.assets[Resource.KingStatusE];
            }
            minionStatusArea.y = statusY - minionStatusArea.height;
        }
        minionStatusArea.x = -12;
        this.addChild(minionStatusArea);
        this.minionStatusArea = minionStatusArea;

        this.createStatusContent();
    },

    createDamageLabel: function() {
        this.damageLabel = new Label('');
        //this.damageLabel.moveTo(10, 10);
        this.damageLabel.color = '#ffffff';
        this.damageLabel.font = '90px champage';
    },

    showDamege: function(damage) {
        if (damage > 0) {
            this.damageLabel.color = '#df0000';
            this.damageLabel.text = '-' + damage;
        } else if (damage < 0) {
            this.damageLabel.color = '#0000df';
            this.damageLabel.text = '+' + (-damage);
        } else {
            return;
        }

        this.damageLabel.opacity = 1.0;
        this.addChild(this.damageLabel);

        var self = this;
        this.damageLabel.tl.clear();
        this.damageLabel.moveTo(-10, -25);
        this.damageLabel.tl.moveBy(0, -20, 60).and().fadeOut(60).then(function() {
            self.removeChild(self.damageLabel);
        });
    },

    hideStatusArea: function() {
        this.minionStatusArea.visible = false;
        if (this.atTextLabel != null) {
            this.atTextLabel.visible = false;
            this.atCells.forEach(function(cell) {
                cell.visible = false;
            });
        }
        this.hpTextLabel.visible = false;
        this.hpCells.forEach(function(cell) {
            cell.visible = false;
        });
    },

    createStatusContent: function(at, hp) {
        var baseY = 73;
        var cellBaseX = 0;

        if (this.player.playerId != 0) {
            baseY = -44 + 6;
        }

        this.atCells = [];
        if (this.minionType !== Const.MinionType.King) {
            this.atTextLabel = new Label();
            this.atTextLabel.text = '' + this.at + ' :';
            this.atTextLabel.color = '#000000';
            this.atTextLabel.x = -7;
            this.atTextLabel.y = baseY;
            this.atTextLabel.font = '14px champage';
            this.addChild(this.atTextLabel);

            for (var i = 0; i < this.at; i++) {
                var atCell = new Sprite(8, 8);
                atCell.x = cellBaseX + 10 + (i * 9);
                atCell.y = baseY + 5;
                atCell.image = this.atCellAsset;
                atCell.opacity = 0.8;
                this.addChild(atCell);
                this.atCells.push(atCell);
            }
        } else {
            baseY -= 6;
            cellBaseX += 4;
        }

        this.hpTextLabel = new Label();
        this.hpTextLabel.text = '' + this.hp + ' :';
        this.hpTextLabel.color = '#000000';
        this.hpTextLabel.x = -7;
        this.hpTextLabel.y = baseY + 16;
        this.hpTextLabel.font = '14px champage';
        this.addChild(this.hpTextLabel);

        this.hpCells = [];
        for (var i = 0; i < this.maxHp; i++) {
            var hpCell = new Sprite(8, 8);
            hpCell.x = cellBaseX + 10 + (i * 9);
            hpCell.y = baseY + 20;
            hpCell.image = this.hpCellAsset;
            hpCell.opacity = 0.8;
            this.addChild(hpCell);
            this.hpCells.push(hpCell);
        }
    },

    updateHp: function() {
        this.hpTextLabel.text = '' + this.hp + ' :';
        for (var i = 0; i < this.hpCells.length; i++) {
            if (i < this.hp) {
                this.hpCells[i].image = this.hpCellAsset;
            } else {
                this.hpCells[i].image = this.nullCellAsset;
            }
        }
    },

    setHp: function(hp) {
        if (hp > this.maxHp) {
            hp = this.maxHp;
        } else if (hp < 0) {
            hp = 0;
        }
        this.hp = hp;

        this.hpTextLabel.text = '' + this.hp + ':';
        for (var i = 0; i < this.maxHp; i++) {
            if (i < this.hp) {
                this.hpCells[i].image = this.hpCellAsset;
            } else {
                this.hpCells[i].image = this.nullCellAsset;
            }
        }
    },

    lockonAutoAtackTarget: function(enemyGrid) {
        if (enemyGrid.getMinionCount() < 1) {
            return [null];
        }

        var targetCount = 1;

        var minionsCount = this.player.minionGrid.getMinionCount();
        var rankType = (this.player.minionGrid.getMinionCount() % 2);
        var enemyRankType = (enemyGrid.getMinionCount() % 2);

        if (rankType != enemyRankType) {
            targetCount++;
        }

        var index = this.player.minionGrid.getMinionIndex(this);
        if (index < 0) {
            return [null];
        }

        var targets = [];
        var targetLocked = false;
        var rankDiff = Math.floor((enemyGrid.getMinionCount() - minionsCount) / 2);
        for (var i = 0; i < targetCount; i++) {
            var enemyPosIndex = rankDiff + index + i;
            if ((enemyPosIndex > -1) && (enemyPosIndex < enemyGrid.getMinionCount())) {
                targets.push(enemyGrid.minions[enemyPosIndex]);
                targetLocked = true;
            } else {
                targets.push(null);
            }
        }

        if (!targetLocked) {
            return [null];
        }

        return targets;
    },

    lockonHealTarget: function() {
        var grid = this.player.minionGrid;
        var index = grid.getMinionIndex(this);
        if (index < 0) {
            return [];
        }

        var targetLocked = false;
        var targets = [];
        var targetIndexOffsets = [-1, 1];
        targetIndexOffsets.forEach(function(offset) {
            var targetIndex = index + offset;
            if ((targetIndex > -1) && (targetIndex < grid.getMinionCount())) {
                targetLocked = true;
                targets.push(grid.minions[targetIndex]);
            } else {
                targets.push(null);
            }
        });
        if (!targetLocked) {
            return [null];
        }
        return targets;
    },

    endTurn: function(callback) {
        switch (this.minionType) {
            case Const.MinionType.AutoAttack:
                this.startAutoAttack(callback);
                break;
            case Const.MinionType.Heal:
                this.startHeal(callback);
                break;
            default:
                callback();
        }
    },

    startAutoAttack: function(callback) {
        if (this.minionType !== Const.MinionType.AutoAttack) {
            callback();
            return;
        }

        var targets = this.lockonAutoAtackTarget(this.player.enemyPlayer.minionGrid);

        if (targets.length < 1) {
            callback();
            return;
        }

        var self = this;
        var attackEffect = new Sprite(64, 64);
        attackEffect.opacity = 0.7;
        attackEffect.image = self.core.assets[Resource.EffectBullet];
        attackEffect.moveTo(0, 0);
        this.addChild(attackEffect);
        attackEffect.tl.delay(3).scaleTo(0.01, 0.01, 11).then(function() {
            self.removeChild(attackEffect);
        });

        var fireBulletToEnemyKing = function() {
            var distanceY = (self.player.enemyPlayer.minionGrid.y - self.player.minionGrid.y) - (32 * self.direction);
            var bullet = new Bullet(self.core);
            var bulletX = self.x;
            var bulletY = self.y;
            bulletX += self.player.minionGrid.x;
            bulletY += self.player.minionGrid.y;
            bullet.moveTo(bulletX, bulletY);

            var overlay = self.player.minionGrid.board.effectOverlay;
            var targetKing = self.player.enemyPlayer.king;
            var middlePosX = (targetKing.x - self.x) / 2;
            if (middlePosX < -32) {
                middlePosX = -32;
            }
            if (middlePosX > 32) {
                middlePosX = 32;
            }
            var grid = self.player.enemyPlayer.minionGrid;
            var kingX = targetKing.x + grid.x;
            var kingY = targetKing.y + grid.y;
            bullet.tl.moveBy(middlePosX, distanceY, 10).moveTo(kingX, kingY, 10).then(function() {
                overlay.removeChild(bullet);
            });

            overlay.addChild(bullet);
        };

        var fireBulletToEnemyMinion = function(directionX) {
            var distanceY = self.player.enemyPlayer.minionGrid.y - self.player.minionGrid.y;
            var bullet = new Bullet(self.core);
            var bulletX = self.x;
            var bulletY = self.y;
            bulletX += self.player.minionGrid.x;
            bulletY += self.player.minionGrid.y;
            bullet.moveTo(bulletX, bulletY);

            bullet.tl.moveBy(directionX * 45, distanceY, 10).then(function() {
                overlay.removeChild(bullet);
            });

            var overlay = self.player.minionGrid.board.effectOverlay;
            overlay.addChild(bullet);
        };

        this.tl.moveBy(0, 20 * self.direction, 12).moveBy(0, -20 * self.direction, 3).then(function() {
            if ((targets.length == 1) && (targets[0] == null)) {
                self.tl.delay(20).then(function() {
                    // TODO: 10でなく着弾でコールバックしたほうがいいかも
                    var index = self.player.minionGrid.getMinionIndex(self);
                    if (index > -1) {
                        self.player.enemyPlayer.king.hit(self.at, callback);
                    } else {
                        callback();
                    }
                });
                fireBulletToEnemyKing();
            } else {
                for (var i = 0; i < targets.length; i++) {
                    if (targets[i] != null) {
                        var directionX = 0;
                        if (targets.length > 1) {
                            switch (i) {
                                case 0:
                                    directionX = -1;
                                    break;
                                case 1:
                                    directionX = 1;
                                    break;
                            }
                        }
                        fireBulletToEnemyMinion(directionX);
                    }
                }
                self.tl.delay(10).then(function() {
                    // TODO: 10でなく着弾でコールバックしたほうがいいかも
                    var index = self.player.minionGrid.getMinionIndex(self);
                    if (index > -1) {
                        self.player.enemyPlayer.minionGrid.hitAutoAttack(targets, self.at, callback);
                    } else {
                        callback();
                    }
                });
            }
        });
    },

    startHeal: function(callback) {
        var self = this;

        var castHeal = function(directionX) {
            var bulletX = self.x;
            var bulletY = self.y;
            bulletX += self.player.minionGrid.x;
            bulletY += self.player.minionGrid.y;

            var healBullet = new HealBullet(self.core);
            healBullet.moveTo(bulletX, bulletY);

            var overlay = self.player.minionGrid.board.effectOverlay;
            healBullet.tl.moveBy(directionX * 90, 8 * self.direction, 20).and().scaleTo(1.5, 1.5, 20).then(function() {
                overlay.removeChild(healBullet);
            });
            overlay.addChild(healBullet);
        };

        var targets = this.lockonHealTarget();
        if ((targets.length == 1) && targets[0] == null) {
            callback();
            return;
        }
        this.tl.moveBy(0, -8 * this.direction, 15).then(function() {
            for (var i = 0; i < 2; i++) {
                var distanceX = -1;
                if (i == 1) {
                    distanceX = 1;
                }
                if (targets[i] != null) {
                    castHeal(distanceX);
                }
            }
        }).moveBy(0, 8 * this.direction, 15).delay(1).then(function() {
            targets.forEach(function(target) {
                if (target != null) {
                    target.heal(2, function() {});
                }
            });
        }).delay(70).then(function() {
            callback();
        });
    },

    startManualAttack: function(minion, callback) {
        if (minion === null) {
            return;
        }

        if (this.isAttacked) {
            return;
        }

        var baseX = this.x;
        var baseY = this.y;

        this.player.minionGrid.removeChild(this);
        this.player.minionGrid.addChild(this);

        var self = this;
        var hitCount = 0;
        var cleanupManualAttack = function() {
            hitCount++;
            if (hitCount >= 2) {
                self.tl.delay(5).moveTo(baseX, baseY, 16).then(function() {
                    self.setAttackedState(true);
                    callback();
                });
            }
        };
        this.tl.moveBy(0, 20 * this.direction, 12).moveTo(minion.x, -45 * this.direction, 8).then(function() {
            minion.hit(self.at, cleanupManualAttack);
            self.hit(minion.at, cleanupManualAttack);
        });
    },

    hit: function(damage, callback) {

        var self = this;

        self.hp -= damage;
        if (self.hp < 0) {
            self.hp = 0;
        }

        this.tl.moveBy(0, 15 * this.direction, 1).moveBy(0, -15 * self.direction, 10);

        var hitMark = new Sprite(64, 64);
        hitMark.moveTo(0, 0);
        hitMark.image = this.core.assets[Resource.EffectHit];
        hitMark.scaleX = 0.01;
        hitMark.scaleY = 0.01;
        hitMark.opacity = 1.0;
        hitMark.compositeOperation = 'lighter';

        hitMark.tl.scaleTo(1.2, 1.2, 5).then(function() {
            self.updateHp();
        }).fadeTo(0, 20).delay(21).then(function() {
            self.showDamege(damage);
            self.removeChild(hitMark);
            callback();
        });
        this.addChild(hitMark);
    },

    heal: function(healHp, callback) {
        this.hp += healHp;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
        var hitMark = new Sprite(64, 64);
        hitMark.moveTo(0, 0);
        hitMark.image = this.core.assets[Resource.EffectHeal];
        hitMark.scale(0.01, 0.01);
        hitMark.opacity = 1.0;
        hitMark.compositeOperation = 'lighter';

        var self = this;
        hitMark.tl.scaleTo(1.0, 1.0, 5).then(function() {
            self.updateHp();
        }).fadeTo(0, 20).delay(10).then(function() {
            self.showDamege(-healHp);
            self.removeChild(hitMark);
            callback();
        });
        this.addChild(hitMark);
    },

    entomb: function(callback) {
        if (this.hp > 0) {
            callback();
            return;
        }
        this.hideStatusArea();

        var self = this;
        if (this.minionType != Const.MinionType.King) {
            self.icon.tl.fadeOut(14).then(callback);
        } else {
            self.icon.tl.fadeOut(14);

            var hitMark = new Sprite(64, 64);
            hitMark.moveTo(0, 0);
            hitMark.image = this.core.assets[Resource.EffectHit];
            hitMark.scaleX = 0.01;
            hitMark.scaleY = 0.01;
            hitMark.opacity = 0.9;

            hitMark.tl.scaleTo(12.0, 12.0, 24).and().fadeTo(0.1, 24).then(function() {
                self.removeChild(hitMark);
            });
            self.addChild(hitMark);

            var overlay = self.core.currentScene.globalOverlay;

            var explosion = new Sprite(1200, 800);
            explosion.moveTo(0, 0);
            explosion.image = self.core.assets[Resource.ExplosionOverlay];
            explosion.opacity = 0.0;
            explosion.compositeOperation = 'lighter';
            overlay.addChild(explosion);
            explosion.tl.delay(12).fadeTo(0.7, 8).delay(14).fadeOut(60).delay(120).then(function() {
                overlay.removeChild(explosion);
                callback();
            });
        }
    },

    setAttackedState: function(isAttacked) {
        var self = this;
        if (isAttacked) {
            if (this.isAttacked) {
                return;
            }
            this.isAttacked = isAttacked;
            this.addChild(self.iconAttacked);
            this.iconAttacked.tl.clear();
            this.iconAttacked.tl.delay(20).fadeTo(0.5, 15);
        } else {
            if (!this.isAttacked) {
                return;
            }
            this.isAttacked = isAttacked;
            this.iconAttacked.tl.clear();
            self.iconAttacked.tl.fadeOut(15).then(function() {
                self.removeChild(self.iconAttacked);
            });
        }
    },
});

var MinionMoveUi = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);

        this.core = core;
        this.overlay = null;
        this.removeCallback = null;
        this.moveLeftCallback = null;
        this.moveRightCallback = null;
        this.leftEnabled = true;
        this.rightEnabled = true;
        var self = this;

        this.focusMark = new Sprite(64, 64);
        this.focusMark.image = core.assets[Resource.MinionFocusMark];
        this.focusMark.moveTo(0, 0);
        this.addChild(this.focusMark);

        this.focusMark.addEventListener('touchend', function(event) {
            if (self.removeCallback != null) {
                self.removeCallback();
            }
            self.overlay.removeChild(self);
        });

        this.leftButton = new Sprite(32, 64);
        this.leftButton.opacity = 1.0;
        this.leftButton.image = core.assets[Resource.MinionMoveL];
        this.leftButton.moveTo(-(32 - 10), 0);
        this.leftButton.addEventListener('touchstart', function() {
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }

            if ((self.moveLeftCallback != null) && (self.leftEnabled)) {
                self.moveLeftCallback();
            }
        });

        this.rightButton = new Sprite(32, 64);
        this.rightButton.opacity = 1.0;
        this.rightButton.image = core.assets[Resource.MinionMoveR];
        this.rightButton.moveTo((64 - 10), 0);
        this.rightButton.addEventListener('touchstart', function() {
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }

            if ((self.moveRightCallback != null) && (self.rightEnabled)) {
                self.moveRightCallback();
            }
        });
    },

    setToOverlay: function(overlay) {
        this.removeChild(this.leftButton);
        this.removeChild(this.rightButton);

        var mark = this.focusMark;
        mark.scaleX = 3.0;
        mark.scaleY = 3.0;
        mark.opacity = 0.01;

        var self = this;
        mark.tl.clear();
        mark.tl.fadeTo(0.7, 8).and().scaleTo(1.02, 1.02, 8).delay(1).then(function() {
            if (self.leftEnabled) {
                self.addChild(self.leftButton);
            }
            if (self.rightEnabled) {
                self.addChild(self.rightButton);
            }
        }).then(function() {
            mark.tl.clear();
            mark.tl.fadeOut(4).delay(20).fadeIn(4).delay(20).loop();
        });
        overlay.addChild(this);
        this.overlay = overlay;
    },

    removeFromOverlay: function() {
        if (this.overlay == null) {
            return;
        }
        this.removeChild(this.leftButton);
        this.removeChild(this.rightButton);
        this.overlay.removeChild(this);
    },
});

var ManualAttackSite = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);
        this.site = new Sprite(37, 19);
        this.site.image = core.assets[Resource.ManualAttackSite];
        this.site.moveTo(-(this.site.width / 2), -this.site.height + 1);
        this.addChild(this.site);

        this.label = new Sprite(64, 21);
        this.label.image = core.assets[Resource.ManualAttackLabel];
        this.label.moveTo(-(this.label.width / 2), -(this.site.height + this.label.height + 10));
        this.addChild(this.label);
    },


});

var MinionGrid = Class.create(Group, {
    initialize: function(core, player) {
        Group.call(this);
        this.core = core;
        this.player = player;
        this.spaceIndex = null;
        this.minions = [];
        this.cellWidth = 90;
        this.cellCount = 7;
        this.width = this.cellWidth * this.cellCount - (this.cellWidth - 64);
        this.height = 64;
        this.board = null;
        this.focusedMinion = null;

        var king = new Minion(core, player, 'King');
        var centerY = (this.height / 2);
        var kingCenterY = (king.height / 2);
        var direction = 1;
        if (player.playerId == 1) {
            direction = -1;
        }
        king.moveTo(3 * (this.cellWidth), (centerY - kingCenterY) + (88 + kingCenterY) * direction);
        this.addChild(king);
        king.enter(null);
        this.king = king;

        var self = this;
        this.minionMoveUi = new MinionMoveUi(core);
        this.minionMoveUi.removeCallback = function() {
            self.focusedMinion = null;
        };
        this.minionMoveUi.moveLeftCallback = function() {
            if (self.player.isUiLocked) {
                return;
            }
            self.player.setLockUiState(true);
            self.moveMinion(self.focusedMinion, -1, function() {
                self.player.setLockUiState(false);
            });
        };
        this.minionMoveUi.moveRightCallback = function() {
            if (self.player.isUiLocked) {
                return;
            }
            self.player.setLockUiState(true);
            self.moveMinion(self.focusedMinion, 1, function() {
                self.player.setLockUiState(false);
            });
        };

        this.manualAttackSite = new ManualAttackSite(core);
    },

    moveMinion: function(minion, offset, callback) {
        if (minion == null) {
            return;
        }

        if (!minion.player.coin.use(1)) {
            callback();
            return;
        }
        minion.player.hand.setCostLimit(minion.player.coin.coin);

        var index = this.getMinionIndex(minion);
        if (index < 0) {
            callback();
            return;
        }

        var swapIndex = index + offset;
        if ((swapIndex < 0) || (swapIndex >= this.getMinionCount())) {
            callback();
            return;
        }

        var swapMinion = this.minions[swapIndex];
        this.minions[swapIndex] = minion;
        this.minions[index] = swapMinion;
        this.alignment(callback);

        if (this.player.playerId == 0) {
            this.core.network.moveMinion(index, offset);
        }
    },

    addMinion: function(minion, minionGridIndex, callback) {
        if (this.getMinionCount() >= this.cellCount) {
            if (callback) {
                callback();
            }
            return false;
        }

        //console.log('-----------------------------------------------');
        //console.log('addMinion(): enter minionGridIndex=' + minionGridIndex);

        var self = this;
        var startX = (this.cellCount - this.minions.length - 1) * (this.cellWidth / 2);
        var add = function() {
            //console.log('addMinion(): add to index=' + minionGridIndex);
            minion.x = startX + (minionGridIndex * self.cellWidth);
            minion.y = 0;
            self.minions.splice(minionGridIndex, 0, minion);

            self.addChild(minion);
            minion.enter(callback);
        };

        var minionCountMax = this.minions.length;
        if (minionCountMax > 0) {
            var minionCount = 0;
            self.minions.forEach(function(otherMinion, x) {
                if (x >= minionGridIndex) {
                    x++;
                }
                //console.log('startX=' + startX + ' x=' + x + '  (self.cellWidth=' + self.cellWidth + ')');
                otherMinion.tl.moveTo(startX + (x * self.cellWidth), 0, 15).then(function() {
                    //console.log('addMinion: moveTo is end. (minionCount=' + minionCount + ', otherMinion.x=' + otherMinion.x + ')')
                    minionCount++;
                    if (minionCount >= minionCountMax) {
                        add();
                    }
                });
            });
        } else {
            add();
        }
        //console.log('addMinion(): leave');

        return true;
    },

    alignment: function(callback) {
        this.spaceIndex = null;
        this.setFocus(null);

        if (this.minions.length <= 0) {
            if (callback) {
                callback();
            }
            return;
        }

        var self = this;
        var startX = (this.cellCount - this.minions.length) * (this.cellWidth / 2);
        var alignmentMinionCount = 0;
        self.minions.forEach(function(minion, i) {
            var x = startX + i * self.cellWidth;
            minion.tl.moveTo(x, 0, 15).then(function() {
                alignmentMinionCount++;
                if (alignmentMinionCount >= self.minions.length) {
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },

    makeSpace: function(index) {
        if ((this.getMinionCount() < 1) || (this.getMinionCount() >= this.cellCount)) {
            this.spaceIndex = null;
            return;
        }
        if (index === this.spaceIndex) {
            return;
        }
        this.setFocus(null);

        var self = this;
        var startX = (this.cellCount - this.minions.length - 1) * (this.cellWidth / 2);
        this.minions.forEach(function(otherMinion, i) {
            var j = i;
            if (i >= index) {
                j++;
            }
            var x = startX + j * (self.cellWidth);
            otherMinion.tl.clear();
            otherMinion.tl.moveTo(x, 0, 15);
        });
        this.spaceIndex = index;
    },

    removeSpace: function() {
        if (this.spaceIndex === null) {
            return;
        }
        this.spaceIndex = null;
        this.alignment();
    },

    getMinonInsertIndex: function(x) {
        var minionCount = this.minions.length;
        if (this.spaceIndex !== null) {
            minionCount++;
        }
        x -= (this.x + this.board.x);
        var startX = (this.cellCount - minionCount) * (this.cellWidth / 2);
        var index = Math.floor((x - startX + 32) / this.cellWidth);
        if (this.spaceIndex !== null) {
            if (index > this.spaceIndex) {
                index--;
            }
        }

        if (index > this.minions.length) {
            index = this.minions.length;
        }
        if (index < 0) {
            index = 0;
        }

        return index;
    },

    isValidMinionAddPoint: function(globalX, globalY) {
        if ((globalX >= this.x) && (globalX <= (this.x + 650))) {
            if ((globalY >= this.y) && (globalY <= (this.y + 80))) {
                return true;
            }
        }
        return false;
    },

    isValidSpellCastPoint: function(globalX, globalY) {
        if ((globalX >= this.x) && (globalX <= (this.x + 650))) {
            if ((globalY >= this.y) && (globalY <= (this.y + 220))) {
                return true;
            }
        }
        return false;
    },

    endTurn: function(callback) {
        this.setFocus(null);
        var minions = this.minions;
        if (minions.length < 1) {
            callback();
            return;
        }

        var index = 0;
        var next = function() {
            if (index >= minions.length) {
                minions.forEach(function(minion) {
                    minion.setAttackedState(false);
                });
                callback();
            } else {
                minions[index++].endTurn(next);
            }
        };

        next();
    },

    entombDeadMinions: function(callback) {
        console.log('entombDeadMinions : enter!');
        var self = this;
        var aliveMinions = [];
        var deadMinions = [];
        this.minions.forEach(function(minion) {
            if (minion.hp > 0) {
                aliveMinions.push(minion);
            } else {
                deadMinions.push(minion);
            }
        });

        if (self.king.hp <= 0) {
            deadMinions.push(self.king);
        }

        if (deadMinions.length > 0) {
            var entombCount = 0;
            deadMinions.forEach(function(minion) {
                minion.entomb(function() {
                    self.removeChild(minion);
                    entombCount++;
                    if (entombCount >= deadMinions.length) {
                        self.minions = aliveMinions;
                        self.alignment();
                        console.log('entombDeadMinions : entomb compleate!');
                        callback();
                    }
                });
            });
        } else {
            callback();
        }
    },

    hitAutoAttack: function(targets, damage, callback) {
        if (this.minions.length < 1) {
            callback();
            return;
        }

        if (targets.length < 1) {
            callback();
            return;
        }

        var hitCount = 0;
        targets.forEach(function(targetMinion) {
            var hitOnceCallback = function() {
                hitCount++;
                if (hitCount >= targets.length) {
                    callback();
                }
            };

            if (targetMinion != null) {
                targetMinion.hit(damage, hitOnceCallback);
            } else {
                hitOnceCallback();
            }
        });
    },

    setFocus: function(minion) {
        this.focusedMinion = minion;

        if (minion == null) {
            this.minionMoveUi.removeFromOverlay();
            return;
        }
        if (minion.player.playerId != 0) {
            return;
        }

        var index = this.getMinionIndex(minion);
        if (index < 0) {
            return;
        }
        var overlay = this.board.uiOverlay;
        var focusX = this.x + minion.x;
        var focusY = this.y + minion.y;
        this.minionMoveUi.leftEnabled = (index > 0);
        this.minionMoveUi.rightEnabled = (index < (this.getMinionCount() - 1));
        this.minionMoveUi.moveTo(focusX, focusY);
        this.minionMoveUi.setToOverlay(overlay);
    },

    getMinionIndex: function(minion) {
        return this.minions.indexOf(minion);
    },

    getMinionCount: function() {
        return this.minions.length;
    },

    setManualAttackSite: function(x, y) {
        this.manualAttackSite.x = x - this.board.x;
        this.manualAttackSite.y = y - this.board.y;
        var overlay = this.board.uiOverlay;
        overlay.addChild(this.manualAttackSite);
    },

    clearManualAttackSite: function() {
        var overlay = this.board.uiOverlay;
        overlay.removeChild(this.manualAttackSite);
    },

    getIntersectToMinion: function(globalX, globalY) {
        var minionBaseX = this.board.x + this.x;
        var minionBaseY = this.board.y + this.y;
        for (var i = 0; i < this.getMinionCount(); i++) {
            var x = minionBaseX + this.minions[i].x;
            var y = minionBaseY + this.minions[i].y;
            var width = this.minions[i].icon.width;
            var height = this.minions[i].icon.height;
            if ((globalX >= x) && (globalX <= (x + width))) {
                if ((globalY >= y) && (globalY <= (y + height))) {
                    return this.minions[i];
                }
            }
        }
        return null;
    },
});

var Board = Class.create(Group, {
    initialize: function(core) {
        Group.call(this);

        this.core = core;
        this.minionGrid = [];

        this.width = 700;
        this.height = 800;

        this.effectOverlay = null;
        this.uiOverlay = null;

        this.minionGridLayer = new Group();
        this.minionGridLayer.moveTo(0, 0);
        this.addChild(this.minionGridLayer);

        this.minionGridSelection = new Sprite(650, 74);
        this.minionGridSelection.image = this.core.assets[Resource.GridSelection];

        this.spellCastSelection = new Sprite(650, 220);
        this.spellCastSelection.image = this.core.assets[Resource.SpellSelection];
    },

    attachMinionGrid: function(minionGrid, direction) {
        var cneterX = (this.width / 2);
        var centerY = (this.height / 2);
        var gridCenterY = (minionGrid.height / 2);
        minionGrid.moveTo(46, (centerY - gridCenterY) + ((20 + gridCenterY) * direction));

        if (this.minionGrid.indexOf(minionGrid) < 0) {
            this.minionGrid.push(minionGrid);
        }
        minionGrid.board = this;
        this.minionGridLayer.addChild(minionGrid);
    },

    createOverlay: function() {
        this.effectOverlay = new Group();
        this.effectOverlay.moveTo(0, 0);
        this.addChild(this.effectOverlay);

        this.uiOverlay = new Group();
        this.uiOverlay.moveTo(0, 0);
        this.addChild(this.uiOverlay);
    },

    setSelectionLineMinionGrid: function(grid) {
        this.minionGridSelection.x = grid.x + ((grid.width - this.minionGridSelection.width) / 2);
        this.minionGridSelection.y = grid.y + ((grid.height - this.minionGridSelection.height) / 2);

        var self = this;
        var initSelection = function() {
            self.minionGridSelection.opacity = 0.1;
            self.minionGridSelection.scaleX = 2.0;
            self.minionGridSelection.scaleY = 3.4;
        };
        initSelection();
        self.minionGridSelection.tl.delay(5).fadeTo(0.6, 8).and().scaleTo(1.0, 1.0, 8).delay(1800).then(initSelection).loop();
        this.uiOverlay.addChild(this.minionGridSelection);
    },

    clearSelectionLineMinionGrid: function() {
        if (this.minionGridSelection == null) {
            return;
        }
        this.minionGridSelection.tl.clear();
        this.uiOverlay.removeChild(this.minionGridSelection);
    },

    setSelectionLineSpellCast: function(grid) {
        this.spellCastSelection.x = grid.x + ((grid.width - this.spellCastSelection.width) / 2);
        this.spellCastSelection.y = grid.y;

        var self = this;
        var initSelection = function() {
            self.spellCastSelection.opacity = 0.1;
            self.spellCastSelection.scaleX = 2.0;
            self.spellCastSelection.scaleY = 3.4;
        };
        initSelection();
        self.spellCastSelection.tl.delay(5).fadeTo(0.6, 8).and().scaleTo(1.0, 1.0, 8).delay(1800).then(initSelection).loop();
        this.uiOverlay.addChild(this.spellCastSelection);
    },

    clearSelectionLineSpellCast: function() {
        if (this.spellCastSelection == null) {
            return;
        }
        this.spellCastSelection.tl.clear();
        this.uiOverlay.removeChild(this.spellCastSelection);
    },

    bringToFrontMinionGrid(targetGrid) {
        var layer = this.minionGridLayer;
        var isRemoved = false;
        this.minionGrid.forEach(function(grid) {
            if (grid === targetGrid) {
                layer.removeChild(grid);
                isRemoved = true;
            }
        });
        if (isRemoved) {
            layer.addChild(targetGrid);
        }
    },

});

var Card = Class.create(Group, {
    initialize: function(core, player, key) {
        Group.call(this);

        this.core = core;
        this.player = player;
        this.key = key;
        var param = Const.CardParam[key];
        this.cost = param.cost;
        this.cardType = param.cardType;
        this.isCostOver = false;

        this.cardBase = new Sprite(88, 128);
        this.cardBase.x = 0;
        this.cardBase.y = 0;
        this.cardBase.image = core.assets[Resource.Card];
        this.originX = this.cardBase.width / 2;
        this.originY = this.cardBase.height / 2;
        this.addChild(this.cardBase);

        this.width = this.cardBase.width;

        this.isGrabbed = false;
        this.handIndex = null;

        this.costOverLabel = new Sprite(74, 62);
        this.costOverLabel.image = core.assets[Resource.CostOver];
        this.costOverLabel.moveTo(8, 32);
        this.costOverLabel.opacity = 1.0;

        this.costLabel = this.createCardText(param.cost, 6, 5, 24);
        this.costLabel.color = '#ff9090';

        this.nameLabel = this.createCardText(param.name, 22, 5, 24);
        this.descLabel = this.createCardText(param.desc, 9, 83, 15);
        this.descLabel.color = '#7f7f7f';

        this.statusAt = this.createCardText('', 20, 96, 14);
        this.statusHp = this.createCardText('', 20, 109, 14);

        this.icon = new Sprite(64, 64);
        this.icon.scale(0.8, 0.8);
        this.icon.x = 12;
        this.icon.y = 25;
        this.icon.image = core.assets[param.icon[player.team]];
        this.icon.opacity = 0.7;
        this.addChild(this.icon);

        this.setStatus(param.at, param.hp);

    },

    startFadeOut: function(frame, callback) { // TODO: callback設定
        this.cardBase.tl.fadeOut(frame);

        this.icon.tl.fadeOut(frame);
        this.costLabel.tl.fadeOut(frame);
        this.nameLabel.tl.fadeOut(frame);
        this.descLabel.tl.fadeOut(frame);
        this.statusAt.tl.fadeOut(frame);
        this.statusHp.tl.fadeOut(frame);
    },

    setHandEventListener: function() {
        this.clearEventListener();

        var self = this;
        this.addEventListener('touchstart', function(event) {
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }
            if (self.player.isUiLocked) {
                return;
            }

            if (self.player.coin.coin < self.cost) {
                return;
            }

            if (self.cardType == Const.CardType.Minion) {
                if (self.player.minionGrid.getMinionCount() >= 7) {
                    return;
                }
            }

            self.isGrabbed = true;
            self.player.hand.setSelectedCard(self);

            self.handIndex = self.player.hand.take(self);

            var board = self.player.minionGrid.board;
            self.tl.clear();
            self.scaleX = 1.0;
            self.scaleY = 1.0;
            self.x = event.x - (self.cardBase.width / 2);
            self.y = event.y - (self.cardBase.height / 2);
            self.tl.scaleTo(0.5, 0.5, 5);
            var overlay = self.core.currentScene.globalOverlay;
            overlay.addChild(self);

            var grid = this.player.minionGrid;
            if (self.cardType == Const.CardType.Minion) {
                grid.board.setSelectionLineMinionGrid(grid);
            } else {
                grid.board.setSelectionLineSpellCast(grid);
            }
        });
        this.addEventListener('touchend', function(event) {
            if (!self.isGrabbed) {
                return;
            }

            if (self.player.isUiLocked) {
                return;
            }

            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }

            self.isGrabbed = false;
            self.player.hand.returnCardToHand(self.handIndex, self);
            self.scaleX = 1.0;
            self.scaleY = 1.0;
            self.player.hand.clearSelectedCard();

            var grid = self.player.minionGrid;
            if (self.cardType == Const.CardType.Minion) {
                if (self.player.minionGrid.isValidMinionAddPoint(event.x, event.y)) {
                    if (self.player.coin.use(self.cost)) {
                        var minionPosIndex = self.player.minionGrid.getMinonInsertIndex(event.x);
                        self.player.setLockUiState(true);
                        self.player.hand.useMinionCard(self, minionPosIndex, function() {
                            self.player.hand.setCostLimit(self.player.coin.coin);
                            self.player.setLockUiState(false);
                        });
                    }
                }
                grid.board.clearSelectionLineMinionGrid();
            } else if (self.cardType == Const.CardType.Spell) {
                if (self.player.minionGrid.isValidSpellCastPoint(event.x, event.y)) {
                    self.player.setLockUiState(true);
                    self.player.hand.useSpellCard(self, function() {
                        self.player.hand.setCostLimit(self.player.coin.coin);
                        self.player.setLockUiState(false);
                    });
                }
                grid.board.clearSelectionLineSpellCast();
            }
        });
        this.addEventListener('touchmove', function(event) {
            if (self.core.currentScene.state != self.core.currentScene.StateType.Main) {
                return;
            }

            if (!self.isGrabbed) {
                return;
            }

            // TODO:
            var board = self.player.minionGrid.board;
            self.x = event.x - (self.cardBase.width / 2);
            self.y = event.y - (self.cardBase.height / 2);

            if (self.cardType == Const.CardType.Minion) {
                if (self.player.minionGrid.isValidMinionAddPoint(event.x, event.y)) {
                    var index = self.player.minionGrid.getMinonInsertIndex(event.x);
                    self.player.minionGrid.makeSpace(index);
                } else {
                    self.player.minionGrid.removeSpace();
                }
            } else {
                // TODO: show spell card UI
            }
        });
    },

    mask: function() {
        this.cardBase.tl.clear();
        this.icon.tl.clear();

        this.cardBase.tl.fadeTo(0.2, 5);
        this.icon.tl.fadeTo(0.1, 5);
    },

    unmask: function() {
        this.setDefaultOpacity(10);
    },

    setCostOvewr: function(isOver, fadeFrames) {
        this.isCostOver = isOver;
        if (isOver) {
            this.addChild(this.costOverLabel);
        } else {
            this.removeChild(this.costOverLabel);
        }
        this.setDefaultOpacity(5);
    },

    setDefaultOpacity: function(fadeFrames) {
        if (fadeFrames == null) {
            fadeFrames = 5;
        }
        if (!this.isCostOver) {
            this.cardBase.tl.clear();
            this.icon.tl.clear();
            this.cardBase.tl.fadeTo(1.0, fadeFrames);
            this.icon.tl.fadeTo(0.7, fadeFrames);
        } else {
            this.cardBase.tl.clear().fadeTo(0.2, fadeFrames);
            this.icon.tl.clear().fadeTo(0.1, fadeFrames);
        }
    },
    createCardText: function(text, x, y, size) {
        var label = new Label('' + text);
        label.moveTo(x, y);
        label.font = '' + size + 'px champage';
        label.color = '#000000'; //'#a0a0a0';
        this.addChild(label);
        return label;
    },

    setStatus: function(at, hp) {
        this.at = at;
        this.hp = hp;
        this.statusAt.text = 'attack: ' + this.at;
        this.statusHp.text = 'difence: ' + this.hp;
    },
});

var Hand = Class.create(Group, {
    initialize: function(core, player) {
        Group.call(this);
        this.core = core;
        this.player = player;
        this.cards = [];

        this.x = 10;
        this.y = 646 * (1 - player.playerId);

        var bg = new Sprite(930, 150);
        bg.x = 0;
        bg.y = 0;
        bg.image = core.assets[Resource.HandBg];
        this.addChild(bg);

        this.cardPosX = 16;
        this.cardPosY = 14;

        core.currentScene.addChild(this);
    },

    addCard: function(card) {
        if (this.cards.length >= 10) {
            return;
        }
        card.moveTo(this.getAddCardPosX(), this.cardPosY);
        card.setHandEventListener();
        this.cards.push(card);
        this.addChild(card);
    },

    getAddCardPosX: function() {
        var index = this.cards.length;
        return this.cardPosX + (88 + 2) * index;
    },

    setSelectedCard(selectedCard) {
        this.cards.forEach(function(card) {
            if (selectedCard === card) {
                card.unmask();
            } else {
                card.mask();
            }
        });
    },

    clearSelectedCard() {
        this.cards.forEach(function(card) {
            card.unmask();
        });
    },

    useMinionCard: function(card, minionGridIndex, callback) {

        var minion = new Minion(this.core, card.player, card.key);
        this.player.minionGrid.addMinion(minion, minionGridIndex, callback);

        var usedCardIndex = this.cards.indexOf(card);
        if (usedCardIndex > -1) {
            this.cards.splice(usedCardIndex, 1);
        }

        this.removeChild(card);
        this.alignment();

        this.core.network.useCard(usedCardIndex, minionGridIndex);
    },

    useSpellCard: function(card, callback) {
        var usedCardIndex = this.cards.indexOf(card);
        if (usedCardIndex > -1) {
            this.cards.splice(usedCardIndex, 1);
        }

        this.removeChild(card);
        this.alignment();

        card.clearEventListener();
        card.scaleX = 1.4;
        card.scaleY = 1.4;
        card.moveTo(340, 330);
        card.cardBase.opacity = 1.0;
        card.icon.opacity = 0.7;
        card.tl.clear();

        var overlay = this.core.currentScene.globalOverlay;
        card.tl.delay(15).then(function() {
            card.startFadeOut(10);
            card.tl.scaleTo(3.0, 10).then(function() {
                overlay.removeChild(card);
                this.player.coin.addCoin(1);
                if (callback) {
                    callback();
                }
            });
        });
        overlay.addChild(card);

        this.core.network.useCard(usedCardIndex, null);
    },

    take: function(card) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i] === card) {
                this.cards.splice(i, 1);
                this.removeChild(card);
                this.takenCardIndex = i;
                return i;
            }
        }

        return null;
    },

    returnCardToHand(index, card) {
        if (index === null) {
            return;
        }
        if (card === null) {
            return;
        }
        if (this.cards.indexOf(card) > -1) {
            return;
        }
        card.tl.clear();
        card.scaleX = 1.0;
        card.scaleY = 1.0;
        card.moveTo(this.cardPosX + index * (card.width + 2), this.cardPosY);
        this.cards.splice(index, 0, card);
        this.addChild(card);
    },

    setCostLimit: function(limit) {
        this.cards.forEach(function(card) {
            if (card.cost > limit) {
                card.setCostOvewr(true);
            } else {
                card.setCostOvewr(false);
            }
        });
    },

    clearCostLimit: function() {
        this.cards.forEach(function(card) {
            card.setCostOvewr(false);
        });
    },

    alignment: function() {
        var self = this;
        this.cards.forEach(function(card, index) {
            card.tl.clear();
            card.tl.moveTo(self.cardPosX + (card.width + 2) * index, self.cardPosY, 10);
        });
    },

});

var HiddenHand = Class.create(Group, {
    initialize: function(core, player) {
        Group.call(this);
        this.core = core;
        this.player = player;

        this.x = 10;
        this.y = 4;
        this.cardPosX = 16;
        this.cardPosY = 14;

        this.cards = [];

        var bg = new Sprite(930, 150);
        bg.x = 0;
        bg.y = 0;
        bg.image = core.assets[Resource.HandBg];
        this.addChild(bg);

        core.currentScene.addChild(this);
    },

    addCard: function() {
        if (this.cards.length >= 10) {
            return;
        }

        var card = new Sprite(88, 128);
        //card.x = /* this.cardPosX */ 680 /* + this.cards.length * (card.width + 2) */;
        card.x = this.getAddCardPosX();
        card.y = this.cardPosY;
        card.image = this.core.assets[Resource.CardBack];
        this.addChild(card);
        this.cards.push(card);
        this.alignment();
    },

    addCardObject: function(card) {
        card.x = this.cards.length * (card.width + 2);
        card.y = this.cardPosY;
        this.addChild(card);
        this.cards.push(card);
        this.alignment();
    },

    removeCard: function(index) {
        if ((index < 0) || (index >= this.cards.length)) {
            return;
        }

        var card = this.cards[index];
        this.cards.splice(index, 1);
        this.removeChild(card);

        this.alignment();
    },

    alignment: function() {
        var self = this;
        this.cards.forEach(function(card, index) {
            card.tl.clear();
            card.tl.moveTo(self.cardPosX + (card.width + 2) * index, self.cardPosY, 10);
        });
    },

    useCardByCardKey: function(cardKey, handIndex, minionGridIndex, callback) {
        this.removeCard(handIndex);

        var param = Const.CardParam[cardKey];
        this.player.coin.use(param.cost);
        if (param.cardType == Const.CardType.Minion) {
            var minion = new Minion(this.core, this.player, cardKey);
            this.player.minionGrid.addMinion(minion, minionGridIndex, callback);
        } else if (param.cardType == Const.CardType.Spell) {
            if (cardKey == 'Coin') {

                var card = new Card(this.core, this.player, cardKey);
                card.scaleX = 1.4;
                card.scaleY = 1.4;
                card.moveTo(340, 330);
                card.cardBase.opacity = 1.0;
                card.icon.opacity = 0.7;
                card.tl.clear();

                var overlay = this.core.currentScene.globalOverlay;
                card.tl.delay(15).then(function() {
                    card.startFadeOut(10);
                    card.tl.scaleTo(3.0, 10).then(function() {
                        overlay.removeChild(card);
                        this.player.coin.addCoin(1);
                        callback();
                    });
                });
                overlay.addChild(card);
            } else {
                callback();
            }
        }
    },

    clearCostLimit: function() {},

    setCostLimit: function() {},

    getAddCardPosX: function() {
        return this.cardPosX + (this.cards.length * (88 + 2));
    },

});

var Deck = Class.create(Group, {
    initialize: function(core, player) {
        Group.call(this);

        this.core = core;
        this.player = player;
        this.amount = 0;

        this.moveTo(980, 220 + (200 * (1 - player.playerId)));

        var deckOut = new Sprite(88, 128);
        deckOut.image = core.assets[Resource.DeckOut];
        this.deckOut = deckOut;

        var cardBack = new Sprite(88, 128);
        cardBack.image = core.assets[Resource.CardBack];
        this.cardBack = cardBack;
        this.addChild(cardBack);


        var drawCardBack = new Sprite(88, 128);
        drawCardBack.image = core.assets[Resource.CardBack];
        this.drawCardBack = drawCardBack;


        var badge = new Sprite(32, 32);
        badge.image = core.assets[Resource.DeckBadge];
        badge.moveTo(64, -6);
        this.addChild(badge);
        this.badge = badge;

        var countLabel = new Label();
        countLabel.width = badge.width;
        countLabel.moveTo(badge.x, badge.y + 6);
        countLabel.text = '';
        countLabel.font = '20px champage';
        countLabel.color = 'white';
        countLabel.textAlign = 'center';
        this.addChild(countLabel);
        this.countLabel = countLabel;
    },

    setDeckAmount: function(amount) {
        if (amount < 0) {
            amount = 0;
        }
        this.amount = amount;
        this.countLabel.text = '' + amount;
        if (this.amount < 1) {
            this.removeChild(this.countLabel);
            this.removeChild(this.badge);
            this.removeChild(this.cardBack);
            this.addChild(this.deckOut);
        }
    },

    draw: function(key, callback) {
        var self = this;

        var overlay = self.core.currentScene.globalOverlay;
        var card = new Card(self.core, self.player, key);
        card.scaleX = 2;
        card.scaleY = 2;
        card.opacity = 0.0;

        var drawCardBack = self.drawCardBack;
        drawCardBack.scaleX = 1.0;
        drawCardBack.scaleY = 1.0;
        drawCardBack.rotation = 0;
        drawCardBack.opacity = 1.0;
        drawCardBack.x = self.x + self.cardBack.x;
        drawCardBack.y = self.y + self.cardBack.y;

        var hand = self.player.hand;
        self.drawCardBack.tl.moveBy(-20, -20, 10).moveTo(500, 300, 20).and().rotateTo(360, 20).and().scaleTo(2.0, 2.0, 20).delay(10).then(function() {
            card.x = drawCardBack.x;
            card.y = drawCardBack.y;
            overlay.addChild(card);

            drawCardBack.tl.fadeOut(24).delay(60).then(function() {
                self.core.currentScene.removeChild(drawCardBack);

                var x = hand.x + hand.getAddCardPosX();
                var y = hand.y + hand.cardPosY;
                card.tl.scaleTo(1.0, 1.0, 5).and().moveTo(x, y, 10).then(function() {
                    card.scaleX = 1.0;
                    card.scaleY = 1.0;
                    overlay.removeChild(card);
                    hand.addCard(card);
                    callback();
                });
            });
        });
        this.core.currentScene.addChild(drawCardBack);
    },

    hiddenDraw: function(callback) {
        var self = this;
        // console.log('hiddenDraw()');

        var overlay = self.core.currentScene.globalOverlay;
        var drawCardBack = self.drawCardBack;
        drawCardBack.scaleX = 1.0;
        drawCardBack.scaleY = 1.0;
        drawCardBack.rotation = 0;
        drawCardBack.opacity = 1.0;
        drawCardBack.x = self.x + self.cardBack.x;
        drawCardBack.y = self.y + self.cardBack.y;

        var hand = self.player.hand;
        drawCardBack.tl.clear();
        drawCardBack.tl.moveBy(-20, -20, 10).moveTo(500, 300, 20).and().rotateTo(360, 20).and().scaleTo(2.0, 2.0, 20).delay(10).then(function() {
            var x = hand.x + hand.getAddCardPosX();
            var y = hand.y + hand.cardPosY;
            drawCardBack.tl.scaleTo(1.0, 1.0, 5).and().moveTo(x, y, 10).then(function() {
                drawCardBack.scaleX = 1.0;
                drawCardBack.scaleY = 1.0;
                self.core.currentScene.removeChild(drawCardBack);
                hand.addCard();
                callback();
            });
        });
        this.core.currentScene.addChild(drawCardBack);
    },

    fatigue: function(callback) {
        var attackEffect = new Sprite(88, 128);
        attackEffect.opacity = 0.7;
        attackEffect.scaleX = 1.0;
        attackEffect.scaleY = 1.0;
        attackEffect.image = this.core.assets[Resource.EffectDeckOut];
        attackEffect.moveTo(0, 0);
        attackEffect.compositeOperation = 'lighter';
        this.addChild(attackEffect);
        var self = this;
        attackEffect.tl.delay(3).scaleTo(0.01, 0.01, 22).then(function() {
            self.removeChild(attackEffect);

            var bullet = new Bullet(self.core);
            bullet.moveTo(self.x + (88 / 2) - 32, self.y + (128 / 2) - 32);
            var grid = self.player.minionGrid;
            var king = self.player.king;
            self.core.currentScene.addChild(bullet);
            bullet.tl.moveTo((grid.x + king.x + 32), (grid.y + king.y), 30).then(function() {
                self.core.currentScene.removeChild(bullet);
                callback();
            });
        });
    },
});

var Mulligan = Class.create(Group, {
    initialize: function(core, player) {
        Group.call(this);

        this.core = core;
        this.player = player;
        this.cards = [];
        this.cancelCards = [];
        this.moveTo(0, 0);

        var bg = new Sprite(1200, 800);
        bg.moveTo(0, 0);
        bg.image = core.assets[Resource.MulliganBg];
        bg.opacity = 0.0;
        this.addChild(bg);
        this.bg = bg;

        var window = new Sprite(600, 400);
        window.moveTo(300, 170);
        window.opacity = 0.0;
        window.image = core.assets[Resource.MulliganWindow];
        this.addChild(window);
        this.window = window;

        var button = new ArkButton('OK', 160, 60, ['#000000', '#FFFFFF']);
        button.setFont('32px champage');
        button.x = window.x + 410;
        button.y = window.y + 300;
        this.button = button;
        var self = this;
        button.pushedCallback = function() {
            self.removeChild(button);
            for (var i = 0; i < self.cards.length; i++) {
                self.cards[i].clearEventListener();
            }
            self.changeSelectedCard();
        };

    },

    startMulligan: function(cards, callback) {
        this.cards = cards;

        this.core.network.mulliganEndCallback = function(isFirstPlayer, deckAmount) {
            self.bg.tl.delay(8).fadeOut(60).then(function() {
                self.cards.forEach(function(card) {
                    self.removeChild(card);
                    self.player.hand.addCard(card);
                });
                self.cards = [];
                if (callback) {
                    callback(isFirstPlayer, deckAmount);
                }
            });
        };


        var self = this;
        this.window.tl.delay(12).fadeIn(15).delay(15).then(function() {
            self.addChild(self.button);

            var setCardEventListener = function(card) {
                card.clearEventListener();
                card.addEventListener('touchstart', function(event) {
                    var cardIndex = self.cancelCards.indexOf(card);
                    if (cardIndex < 0) {
                        self.cancelCards.push(card);
                        card.mask();
                    } else {
                        self.cancelCards.splice(cardIndex, 1);
                        card.unmask();
                    }
                });
            };

            var baseX = self.window.x + 120 + (((3 - self.cards.length) * (88 + 32)) / 2);
            var baseY = self.window.y + 120;
            for (var i = 0; i < self.cards.length; i++) {
                var card = self.cards[i];
                setCardEventListener(card);
                card.moveTo(baseX + (i * (card.width + 32)), baseY);
                self.addChild(card);
            }
        });
    },

    changeSelectedCard: function() {
        var cancelCardIndexList = [];
        for (var i = 0; i < this.cancelCards.length; i++) {
            var index = this.cards.indexOf(this.cancelCards[i]);
            if (index > -1) {
                cancelCardIndexList.push(index);
            }
        }
        this.cancelCards = [];

        var self = this;
        self.core.network.mulligan(cancelCardIndexList, function(newCardKeys) {
            for (var i = 0; i < cancelCardIndexList.length; i++) {
                var index = cancelCardIndexList[i];
                if (index > -1) {
                    var newCard = new Card(self.core, self.player, newCardKeys[i]);
                    var oldCard = self.cards[index];
                    newCard.x = oldCard.x;
                    newCard.y = oldCard.y;
                    self.removeChild(oldCard);
                    self.cards[index] = newCard;
                    self.addChild(newCard);
                }
            }
        });
    },
});

var Player = Class.create({
    initialize: function(core, playerId, team) {
        this.core = core;
        this.playerId = playerId;
        this.team = team;
        this.enemyPlayer = null;
        this.deck = null;
        this.isUiLocked = false;
        this.uiLockSateChanged = null;

        this.direction = 1;
        if (this.playerId != 0) {
            this.direction = -1;
        }
        this.coin = 0;

        this.coin = 10; // TEST
    },

    createBoardObjects: function(board) {

        this.minionGrid = new MinionGrid(this.core, this);
        this.king = this.minionGrid.king;

        board.attachMinionGrid(this.minionGrid, this.direction);

        this.deck = new Deck(this.core, this);
        board.addChild(this.deck);
    },

    createHandObjects: function(isHidden) {
        if (!isHidden) {
            this.hand = new Hand(this.core, this);
        } else {
            this.hand = new HiddenHand(this.core, this);
        }
    },

    createCoinObject: function() {
        this.coin = new Coin(this.core, this);
    },

    dispose: function(board) {
        board.removeChild(this.minionGrid);
        board.removeChild(this.deck);
        this.core.currentScene.removeChild(this.hand);
        this.core.currentScene.removeChild(this.coin);
    },

    startTurn: function(drawCardKey, fatigue, callback) {
        if (this.coin) {
            this.coin.startTurn();
        }

        if (fatigue <= 0) {
            this.deck.draw(drawCardKey, callback);
        } else {
            var self = this;
            this.deck.fatigue(function() {
                self.king.hit(fatigue, function() {
                    self.minionGrid.entombDeadMinions(function() {
                        callback();
                    });
                });
            });
        }
    },

    startEnemyTurn: function(drawCardKey, fatigue, callback) {
        if (this.coin) {
            this.coin.startTurn();
        }

        if (fatigue <= 0) {
            this.deck.hiddenDraw(callback);
        } else {
            var self = this;
            this.deck.fatigue(function() {
                self.king.hit(fatigue, function() {
                    self.minionGrid.entombDeadMinions(function() {
                        callback();
                    });
                });
            });
        }
    },

    endTurn: function(callback) {
        var self = this;
        this.hand.clearCostLimit();

        var self = this;
        this.minionGrid.endTurn(function() {
            self.enemyPlayer.minionGrid.entombDeadMinions(function() {
                callback();
            });
        });
    },

    setLockUiState: function(isLocked) {
        this.isUiLocked = isLocked;
        if (this.uiLockSateChanged) {
            this.uiLockSateChanged(isLocked);
        }
    },

});

var BattleScene = Class.create(Scene, {
    initialize: function(core, enemyName) {
        Scene.call(this);
        this.core = core;
        this.enemyName = enemyName;

        this.StateType = {
            GameStart: 0,
            StartTurn: 1,
            Main: 2,
            EndTurn: 3,
            EnemyTurn: 4,
            GameEnd: 5,
        };

        this.state = this.StateType.EnemyTurn;

        core.network.initializeBattle();

        core.replaceScene(this);

        var titleBg = new Sprite(1200, 800);
        titleBg.image = core.assets[Resource.TitleBg];
        titleBg.moveTo(0, 0);
        this.addChild(titleBg);

        var bg = new Sprite(1200, 800);
        bg.opacity = 0.0;
        bg.image = core.assets[Resource.BattleBg];
        bg.moveTo(0, 0);
        this.addChild(bg);

        var createEndTurnButton = function() {
            var buttonX = 560;
            var buttonY = 580;
            var endTurnButton = new ArkButton('END TURN', 160, 60, ['#000000', '#FFFFFF']);
            endTurnButton.setFont('24px abyss');
            endTurnButton.moveTo(buttonX, buttonY);
            endTurnButton.setEnabled(false);

            endTurnButton.pushedCallback = function() {
                endTurnButton.setEnabled(false);
                self.state = self.StateType.EndTurn;
                self.core.network.endTurn();
                self.players[0].endTurn(function() {
                    self.core.network.endTurnComplete();
                    self.state = self.StateType.EnemyTurn;
                });
            };

            return endTurnButton;
        };

        var self = this;
        bg.tl.delay(80).fadeIn(80).then(function() {
            self.removeChild(titleBg);
            self.createBattleObjects();

            self.core.network.enemyResignCallback = function() {
                self.players[1].minionGrid.king.hp = 0;
                self.players[1].minionGrid.king.entomb(function() {
                    self.endBattle();
                });
            };

            self.endTurnButton = createEndTurnButton();
            self.core.network.ready(function(team, handCards, deckAmount, enemyHandCount, enemyDeckAmount) {
                self.players[0].team = team;
                self.players[1].team = 1 - team;

                self.createPlayerObjects();

                for (var i = 0; i < enemyHandCount; i++) {
                    self.players[1].hand.addCard();
                }
                self.players[0].deck.setDeckAmount(deckAmount);
                self.players[1].deck.setDeckAmount(enemyDeckAmount);

                self.addChild(self.endTurnButton);
                self.core.network.startTurnCallback = function(drawCardKey, deckAmount, fatigue) {
                    self.state = self.StateType.TurnStart;
                    var turnStartUi = new TurnStartLabel(core);
                    turnStartUi.setToOverlay(self.globalOverlay, function() {
                        self.players[0].deck.setDeckAmount(deckAmount);
                        self.players[0].startTurn(drawCardKey, fatigue, function() {
                            self.players[0].hand.setCostLimit(self.players[0].coin.coin);
                            self.state = self.StateType.Main;
                            self.endTurnButton.setEnabled(true);
                            self.core.network.onEnemyOperationProcessed();
                        });
                    });
                };
                self.core.network.startEnemyTurnCallback = function(drawCardKey, deckAmount, fatigue) {
                    self.state = self.StateType.EnemyTurn;
                    self.players[1].deck.setDeckAmount(deckAmount);
                    self.players[1].startEnemyTurn(drawCardKey, fatigue, function() {
                        self.core.network.onEnemyOperationProcessed();
                    });
                };

                var firstCards = [];
                handCards.forEach(function(key) {
                    var card = new Card(self.core, self.players[0], key);
                    firstCards.push(card);
                });
                var mulligan = new Mulligan(core, self.players[0]);
                mulligan.startMulligan(firstCards, function(isFirstPlayer, deckAmount) {
                    self.players[0].deck.setDeckAmount(deckAmount);
                    self.globalOverlay.removeChild(mulligan);
                    core.network.enemyUseCardCallback = function(useCardKey, handIndex, gridIndex) {
                        self.players[1].hand.useCardByCardKey(useCardKey, handIndex, gridIndex, function() {
                            console.log('useCardByCardKey: end');
                            core.network.onEnemyOperationProcessed();
                        });
                    };
                    core.network.enemyEndTurnCallback = function() {
                        self.players[1].endTurn(function() {
                            self.core.network.onEnemyOperationProcessed();
                            self.core.network.endTurnComplete();
                        });
                    };
                    core.network.manualAttackCallback = function(attackerIndex, targetIndex) {
                        var attackerMinion = self.players[1].minionGrid.minions[attackerIndex];
                        var targetMinion = self.players[0].minionGrid.minions[targetIndex];
                        attackerMinion.startManualAttack(targetMinion, function() {
                            var entombCount = 0;
                            var manualAttackEnd = function() {
                                entombCount++;
                                if (entombCount >= 2) {
                                    core.network.onEnemyOperationProcessed();
                                }
                            };
                            self.players[0].minionGrid.entombDeadMinions(manualAttackEnd);
                            self.players[1].minionGrid.entombDeadMinions(manualAttackEnd);
                        });
                    };
                    core.network.minionMoveCallback = function(index, offset) {
                        var minion = self.players[1].minionGrid.minions[index];
                        self.players[1].minionGrid.moveMinion(minion, offset, function() {
                            core.network.onEnemyOperationProcessed();
                        });
                    };

                    if (isFirstPlayer) {
                        self.players[1].hand.addCard();
                    } else {
                        self.players[0].hand.addCard(new Card(self.core, self.players[0], 'Coin'));
                        self.players[1].deck.setDeckAmount(self.players[1].deck.amount);
                    }

                    self.core.network.mulliganEnd();
                });
                self.globalOverlay.addChild(mulligan);
            });
        });
    },

    createBattleObjects: function() {
        var core = this.core;

        var board = new Board(core);
        board.moveTo(32, 0);
        this.addChild(board);
        this.board = board;

        var players = [
            new Player(core, Const.TeamType.White, 0),
            new Player(core, Const.TeamType.Black, 1)
        ];
        players[0].enemyPlayer = players[1];
        players[1].enemyPlayer = players[0];
        this.players = players;

        var self = this;
        players[0].uiLockSateChanged = function(isLocked) {
            if (isLocked) {
                self.endTurnButton.setEnabled(false);
            } else {
                self.endTurnButton.setEnabled(true);
            }
        };

        var globalOverlay = new Group();
        globalOverlay.moveTo(0, 0);
        this.globalOverlay = globalOverlay;
        this.addChild(globalOverlay);

        this.core.network.victoryCallback = function() {
            var endLabel = new EndVictoryLabel(self.core);
            endLabel.setToOverlay(self, function() {
                self.endBattle();
            });
        };

        this.core.network.defeatCallback = function() {
            var endLabel = new EndDefeatLabel(self.core);
            endLabel.setToOverlay(self, function() {
                self.endBattle();
            });
        };
    },

    createPlayerObjects: function() {
        var players = this.players;
        for (var i = 0; i < 2; i++) {
            players[i].createBoardObjects(this.board);
        }
        this.board.createOverlay();

        players[0].createHandObjects(false);
        players[1].createHandObjects(true);

        var nameBg = new Sprite(200, 30);
        nameBg.moveTo(10, 614);
        nameBg.image = this.core.assets[Resource.NameBg];
        this.core.currentScene.addChild(nameBg);

        var nameLabel = new Label(this.core.name);
        nameLabel.width = 194;
        nameLabel.height = 30;
        nameLabel.moveTo(14, 614 + 6);
        nameLabel.color = '#FFFFFF';
        nameLabel.font = '18px gokuboso';
        this.core.currentScene.addChild(nameLabel);

        var nameBg = new Sprite(200, 30);
        nameBg.moveTo(10, 156);
        nameBg.image = this.core.assets[Resource.NameBg];
        this.core.currentScene.addChild(nameBg);

        var nameLabel = new Label(this.enemyName);
        nameLabel.width = 194;
        nameLabel.height = 30;
        nameLabel.moveTo(14, 156 + 6);
        nameLabel.color = '#FFFFFF';
        nameLabel.font = '18px gokuboso';
        this.core.currentScene.addChild(nameLabel);

        players[0].createCoinObject();
        players[1].createCoinObject();
    },

    endBattle: function() {
        this.state = this.core.currentScene.StateType.GameEnd;

        this.removeChild(this.endTurnButton);

        var board = this.board;
        this.players.forEach(function(player) {
            player.dispose(board);
        });

        var self = this;
        var titleBg = new Sprite(1200, 800);
        titleBg.image = this.core.assets[Resource.TitleBg];
        titleBg.moveTo(0, 0);
        titleBg.opacity = 0.0;
        this.addChild(titleBg);
        titleBg.tl.fadeIn(80).then(function() {
            self.core.network.exitBattle();
            var nextScene = new MatchingScene(self.core);
            self.core.replaceScene(nextScene);
        });
    },

});
