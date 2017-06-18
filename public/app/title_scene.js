'use strict';

var TitleScene = Class.create(Scene, {
    initialize: function(core) {
        Scene.call(this);
        this.core = core;

        var bg = new Sprite(1200, 800);
        bg.image = core.assets[Resource.TitleBg];
        bg.moveTo(0, 0);
        this.addChild(bg);

        var nameEntryBg = new Sprite(700, 300);
        nameEntryBg.opacity = 0.0;
        nameEntryBg.image = core.assets[Resource.NameEntryBg];
        nameEntryBg.moveTo(220, 470);
        var self = this;
        nameEntryBg.tl.delay(60).fadeIn(120).then(function() {
            var nameEntryLabel = new Label('Your Name: ');
            nameEntryLabel.color = '#FFFFFF';
            nameEntryLabel.moveTo(240, 590);
            nameEntryLabel.font = '50px abyss';
            self.addChild(nameEntryLabel);

            var nameEntry = new Entity();
            nameEntry.moveTo(500, 590);
            nameEntry.tl.clear();
            nameEntry.width = 350;
            nameEntry.height = 50;
            nameEntry._element = document.createElement('input');
            nameEntry._element.setAttribute('name', 'nameEntry');
            nameEntry._element.setAttribute('type', 'text');
            //nameEntry._element.setAttribute('style', 'font-size: 30px');
            nameEntry._element.style.fontSize = '40px';
            nameEntry._element.style.fontFamily = 'gokuboso';
            self.addChild(nameEntry);

            var button = new ArkButton('Enter', 160, 60);
            button.setFont('30px abyss');
            button.moveTo(700, 670);
            self.addChild(button);


            button.pushedCallback = function() {
                core.network.login(nameEntry._element.value, function(isSuccess, name) {
                    if (isSuccess) {
                        core.name = name;
                        self.removeChild(button);
                        self.removeChild(nameEntryLabel);
                        self.removeChild(nameEntry);
                        nameEntryBg.tl.clear();
                        nameEntryBg.tl.fadeOut(120).then(function() {
                            var nextScene = new MatchingScene(core);
                            core.replaceScene(nextScene);
                        });
                    } else {
                        nameEntry._element.value = name;
                        nameEntry.tl.moveBy(-10, 0, 3);
                        nameEntry.tl.moveBy(20, 0, 6).moveBy(-20, 0, 6);
                        nameEntry.tl.moveBy(20, 0, 6).moveBy(-20, 0, 6);
                        nameEntry.tl.moveBy(10, 0, 6);
                    }
                });
            };
        });

        this.addChild(nameEntryBg);
        core.replaceScene(this);
    },
});
