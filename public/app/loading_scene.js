'use strict';

var ArkLoadingScene = Class.create(Scene, {
    initialize: function(core) {
        Scene.call(this);

        this.backgroundColor = 'white';

        var label = new Label();
        label.moveTo(400, 290);
        label.text = 'LOADING...';
        label.font = '64px abyss';
        label.color = 'black';
        this.addChild(label);

        var labelProgress = new Label();
        labelProgress.moveTo(700, 490);
        labelProgress.text = '0%';
        labelProgress.font = '64px abyss';
        labelProgress.color = 'black';
        this.addChild(labelProgress);

        var abyssLabel = new Label('...');
        abyssLabel.moveTo(1000, 500);
        abyssLabel.font = '10px abyss';
        this.addChild(abyssLabel);

        var gokubosoLabel = new Label('...');
        gokubosoLabel.moveTo(1000, 500);
        gokubosoLabel.font = '10px gokuboso';
        this.addChild(gokubosoLabel);

        var champageLabel = new Label('...');
        champageLabel.moveTo(1000, 500);
        champageLabel.font = '10px Chanpage';
        this.addChild(champageLabel);

        this.addEventListener('progress', function(e) {
            var progress = e.loaded / e.total;
            progress *= 100;
            progress = Math.round(progress);
            labelProgress.text = progress + '%';

            // var loadImg = new Sprite(320,320);
            // loadImg.image = game.assets['画像ファイル'];
            // this.addChild(loadImg);

        });

        this.addEventListener('load', function(e) {
            var core = Core.instance;
            core.removeScene(core.loadingScene);
            core.dispatchEvent(e);
        });
    },
});
