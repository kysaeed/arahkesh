'use strict';

var TeamType = {
    White: 0,
    Black: 1
};

var CardType = {
    Minion: 0,
    Spell: 1,
};

var MinionType = {
    None: 0,
    AutoAttack: 1,
    ManualAttack: 2,
    Heal: 3,
    King: 4,
};

var CardParam = {
    Pawn: {
        cardType: CardType.Minion,
        id: 0,
        name: 'Pawn',
        desc: 'auto attack',
        cost: 1,
        minionType: MinionType.AutoAttack,
        at: 1,
        hp: 6,
    },
    Bishop: {
        cardType: CardType.Minion,
        id: 1,
        name: 'Bishop',
        desc: 'heal L / R',
        cost: 3,
        minionType: MinionType.Heal,
        at: 0,
        hp: 6,
    },
    Rook: {
        cardType: CardType.Minion,
        id: 2,
        name: 'Rook',
        desc: 'auto attack',
        cost: 3,
        minionType: MinionType.AutoAttack,
        at: 2,
        hp: 6,
    },
    Knight: {
        cardType: CardType.Minion,
        id: 3,
        name: 'Knight',
        desc: 'attack D&D',
        cost: 4,
        minionType: MinionType.ManualAttack,
        at: 4,
        hp: 3,
    },
    Queen: {
        cardType: CardType.Minion,
        id: 4,
        name: 'Queen',
        desc: 'auto attack',
        cost: 7,
        minionType: MinionType.AutoAttack,
        at: 4,
        hp: 6,
    },
    King: {
        cardType: CardType.Minion,
        id: 5,
        name: 'King',
        desc: '',
        cost: 0,
        minionType: MinionType.King,
        at: 0,
        hp: 10,
    },

    Coin: {
        cardType: CardType.Spell,
        id: 6,
        name: 'Coin',
        desc: 'add 1 coin',
        cost: 0,
        minionType: MinionType.None,
        at: 0,
        hp: 1,
    },
};

var Const = {
    TeamType: TeamType,
    CardType: CardType,
    MinionType: MinionType,
    CardParam: CardParam,
};

module.exports = Const;
