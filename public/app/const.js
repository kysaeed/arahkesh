var Const = (function() {
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
            icon: IconResource.Pawn,
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
            icon: IconResource.Bishop,
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
            icon: IconResource.Rook,
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
            icon: IconResource.Knight,
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
            icon: IconResource.Queen,
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
            icon: IconResource.King,
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
            icon: IconResource.Coin,
            cost: 0,
            minionType: MinionType.None,
            at: 0,
            hp: 1,
        },
    };

    return {
        TeamType: TeamType,
        CardType: CardType,
        MinionType: MinionType,
        CardParam: CardParam,
    };
})();
