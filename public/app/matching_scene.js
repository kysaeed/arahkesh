'use strict';

var MatchingScene = Class.create(Scene, {
    initialize: function(core) {
        Scene.call(this);
        this.core = core;

        var self = this;
        core.network.matchedCallback = function(enemyName) {
            var nextScene = new BattleScene(core, enemyName);
            core.replaceScene(nextScene);
        };

        var bg = new Sprite(1200, 800);
        bg.image = core.assets[Resource.TitleBg];
        bg.moveTo(0, 0);
        this.addChild(bg);

        var nameEntryBg = new Sprite(700, 300);
        nameEntryBg.image = core.assets[Resource.NameEntryBg];
        nameEntryBg.opacity = 0.0;
        nameEntryBg.moveTo(220, 470);
        this.addChild(nameEntryBg);

        var self = this;
        nameEntryBg.tl.clear();
        nameEntryBg.tl.fadeIn(120).then(function() {
            var messageLabel = new Label('Mode Select');
            messageLabel.color = '#FFFFFF';
            messageLabel.width = 1000;
            messageLabel.moveTo(440, 510);
            messageLabel.font = '50px abyss';
            self.addChild(messageLabel);

            var buttonSingle = new ArkButton('SinglePlay', 240, 60);
            buttonSingle.moveTo(460, 590);
            buttonSingle.setFont('30px champage');
            self.addChild(buttonSingle);
            buttonSingle.pushedCallback = function() {
                self.removeChild(buttonSingle);
                self.removeChild(buttonMulti);
                messageLabel.text = '';
                core.network.startSinglePlay();
            };

            var buttonMulti = new ArkButton('MultiPlay', 240, 60);
            buttonMulti.moveTo(460, 670);
            buttonMulti.setFont('30px champage');
            self.addChild(buttonMulti);
            buttonMulti.pushedCallback = function() {
                self.removeChild(buttonSingle);
                self.removeChild(buttonMulti);
                messageLabel.moveTo(490, 640);
                messageLabel.text = 'Finding......';
                var waitIcon = new Sprite(100, 100);
                waitIcon.image = core.assets[Resource.IconLoading];
                waitIcon.moveTo(490, 520);
                var sc = 1.0;
                waitIcon.scaleX = sc;
                waitIcon.scaleY = sc;
                waitIcon.originX = 50;
                waitIcon.originY = 50;
                self.addChild(waitIcon);
                waitIcon.rotation = 0;
                waitIcon.tl.delay(1).then(function() {
                    waitIcon.rotation = (waitIcon.rotation + 5) % 360;
                }).loop();

                core.network.startMatching();
            };
        });


        core.replaceScene(this);
    },
});
