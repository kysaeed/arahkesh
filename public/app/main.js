'use strict';

window.onload = function() {
    var core = new Core(1200, 800);
    var top = (window.innerHeight - (core.height * core.scale)) / 2;
    var left = (window.innerWidth - (core.width * core.scale)) / 2;
    var stage = document.getElementById('enchant-stage');
    stage.style.position = 'absolute';
    stage.style.top = top + 'px';
    stage.style.left = left + 'px';
    core._pageX = left;
    core._pageY = top;

    core.fps = 60;
    core.loadingScene = new ArkLoadingScene(core);

    Object.keys(IconResource).forEach(function(key) {
        IconResource[key].forEach(function(icon) {
            core.preload(icon);
        });
    });
    Object.keys(Resource).forEach(function(key) {
        core.preload(Resource[key]);
    });

    core.onload = function() {

        core.network = new ArkNetwork();
        core.addEventListener(Event.ENTER_FRAME, function() {
            core.network.dispatch();
        });

        var title = new TitleScene(core);
    };

    core.start();
};
