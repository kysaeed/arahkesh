'use strict';

enchant();

var Config = {
    SocketServer: 'http://localhost:8080/',
    // SocketServer: 'http://arahkesh.cloudno.de/',
    ImageBase: 'app/img/',
};

var IconResource = {
    Pawn: [
        Config.ImageBase + 'w_pawn.png',
        Config.ImageBase + 'b_pawn.png'
    ],
    Bishop: [
        Config.ImageBase + 'w_bishop.png',
        Config.ImageBase + 'b_bishop.png'
    ],
    Rook: [
        Config.ImageBase + 'w_rook.png',
        Config.ImageBase + 'b_rook.png'
    ],
    Knight: [
        Config.ImageBase + 'w_knight.png',
        Config.ImageBase + 'b_knight.png'
    ],
    Queen: [
        Config.ImageBase + 'w_queen.png',
        Config.ImageBase + 'b_queen.png'
    ],
    King: [
        Config.ImageBase + 'w_king.png',
        Config.ImageBase + 'b_king.png'
    ],
    Coin: [
        Config.ImageBase + 'icon_coin.png',
        Config.ImageBase + 'icon_coin.png'
    ]
};

var Resource = {
    TitleBg: Config.ImageBase + 'title_bg.png',
    NameEntryBg: Config.ImageBase + 'name_entry_bg.png',
    BattleBg: Config.ImageBase + 'battle_bg.png',
    TurnStartLabel: Config.ImageBase + 'turn_start_label.png',
    TurnStartBg: Config.ImageBase + 'turn_start_bg.png',
    DeckBadge: Config.ImageBase + 'deck_badge.png',
    DeckOut: Config.ImageBase + 'deck_out.png',
    EffectDeckOut: Config.ImageBase + 'ef_deck_out.png',
    GridSelection: Config.ImageBase + 'grid_selection.png',
    SpellSelection: Config.ImageBase + 'spell_selection.png',
    MinionStatus: Config.ImageBase + 'minion_status.png',
    MinionLight: Config.ImageBase + 'minion_light.png',
    MinionFocusMark: Config.ImageBase + 'minion_focus.png',
    MinionMoveL: Config.ImageBase + 'minion_move_l.png',
    MinionMoveR: Config.ImageBase + 'minion_move_r.png',
    IconAttacked: Config.ImageBase + 'icon_attacked.png',
    ManualAttackSite: Config.ImageBase + 'manual_attack_site.png',
    ManualAttackLabel: Config.ImageBase + 'manual_attack_label.png',
    KingStatus: Config.ImageBase + 'king_status.png',
    MinionStatusE: Config.ImageBase + 'minion_status_e.png',
    KingStatusE: Config.ImageBase + 'king_status_e.png',
    NullCell: Config.ImageBase + 'null_cell.png',
    AtCell: Config.ImageBase + 'at_cell.png',
    HpCell: Config.ImageBase + 'hp_cell.png',
    HandBg: Config.ImageBase + 'hand_bg.png',
    NameBg: Config.ImageBase + 'name_bg.png',
    MulliganBg: Config.ImageBase + 'mulligan_bg.png',
    MulliganWindow: Config.ImageBase + 'mulligan_window.png',
    CoinBg: Config.ImageBase + 'coin_bg.png',
    CoinUseLight: Config.ImageBase + 'coin_use_light.png',
    Card: Config.ImageBase + 'card.png',
    CardBack: Config.ImageBase + 'card_back.png',
    CostOver: Config.ImageBase + 'cost_over.png',
    EffectHit: Config.ImageBase + 'ef_hit.png',
    EffectBullet: Config.ImageBase + 'ef_bullet.png',
    EffectBulletLight: Config.ImageBase + 'ef_bullet_light.png',
    EffectHealBullet: Config.ImageBase + 'ef_heal_bullet.png',
    EffectHealBulletLight: Config.ImageBase + 'ef_heal_bullet_light.png',
    EffectHeal: Config.ImageBase + 'ef_heal.png',
    ExplosionOverlay: Config.ImageBase + 'explosion_overlay.png',
    EndVictoryLabel: Config.ImageBase + 'end_victory_label.png',
    EndDefeatLabel: Config.ImageBase + 'end_defeat_label.png',
    EndVictoryLabelLight: Config.ImageBase + 'end_victory_label_light.png',
    EndBg: Config.ImageBase + 'end_bg.png',
    IconLoading: Config.ImageBase + 'icon_loading.png',
};
