'use strict';

var ArkButton = Class.create(Group, {
    initialize: function(text, width, height, colors, pushedCallback) {
        Group.call(this);

        this.isEnabled = true;
        this.pushedCallback = pushedCallback;

        if (colors == null) {
            colors = ['#FFFFFF', '#000000'];
        }

        this.setColor(colors[0], colors[1]);

        this.createSprites(width, height);

        var normalLabel = new Label();
        normalLabel.touchEnabled = false;
        normalLabel.width = width;
        normalLabel.height = height;
        normalLabel.textAlign = 'center';
        normalLabel.text = text;
        normalLabel.color = this.color;
        normalLabel.x = 0;
        normalLabel.y = (normalLabel.height / 2) - (normalLabel._boundHeight / 2);
        this.addChild(normalLabel);
        this.normalLabel = normalLabel;

        var pushedLabel = new Label();
        pushedLabel.touchEnabled = false;
        pushedLabel.width = width;
        pushedLabel.height = height;
        pushedLabel.color = this.pushedColor;
        pushedLabel.textAlign = 'center';
        pushedLabel.text = text;
        pushedLabel.x = 0;
        pushedLabel.y = (pushedLabel.height / 2) - (pushedLabel._boundHeight / 2);
        this.pushedLabel = pushedLabel;

        this.setFont('30px champage');

        var self = this;
        var fadeIn = function(callback) {
            var frame = 22;
            self.pushedBg.opacity = 0.0;
            self.pushedBg.tl.clear();
            self.pushedBg.tl.fadeTo(0.6, frame);
            self.addChild(self.pushedBg);

            normalLabel.opacity = 1.0;
            normalLabel.tl.clear();
            normalLabel.tl.fadeOut(frame);

            pushedLabel.opacity = 0.0;
            pushedLabel.tl.clear();
            pushedLabel.tl.fadeTo(0.6, frame).delay(15).then(function() {
                if (callback != null) {
                    callback();
                }
            });
            self.addChild(pushedLabel);
        };
        var fadeOut = function(callback) {
            var frame = 22;
            self.pushedBg.tl.clear();
            self.pushedBg.tl.fadeTo(0.0, frame).then(function() {
                self.removeChild(self.pushedBg);
            });

            normalLabel.tl.clear();
            normalLabel.tl.fadeIn(frame);

            pushedLabel.tl.clear();
            pushedLabel.tl.fadeTo(0.0, frame).then(function() {
                self.removeChild(pushedLabel);
                if (callback != null) {
                    callback();
                }
            });
        };

        var self = this;
        this.isPushWaiting = false;
        this.isCanceled = false;
        this.isFadeInEnd = false;
        self.normalBg.addEventListener('touchstart', function(event) {
            self.isCanceled = false;
            self.isFadeInEnd = false;
            fadeIn(function() {
                self.isFadeInEnd = true;
                if (self.isPushWaiting) {
                    self.isPushWaiting = false;
                    fadeOut(function() {
                        if (!self.isCanceled) {
                            if (self.pushedCallback != null) {
                                self.pushedCallback();
                            }
                        }
                    });
                } else {
                    self.isPushWaiting = true;
                }
            });
        });
        self.normalBg.addEventListener('touchend', function(event) {
            if (self.isFadeInEnd) {
                self.isPushWaiting = false;
                if ((event.localX >= 0) && (event.localX < width)) {
                    if ((event.localY >= 0) && (event.localY < height)) {
                        if (self.pushedCallback != null) {
                            self.pushedCallback();
                        }
                    }
                }

                fadeOut(function() {
                    self.isPushWaiting = false;
                    self.isCanceled = false;
                    self.isFadeInEnd = false;
                });
            } else {
                if (event.localX < 0 || event.localX >= width) {
                    self.isCanceled = true;
                }
                if (event.localY < 0 || event.localY >= height) {
                    self.isCanceled = true;
                }
                self.isPushWaiting = true;
            }
        });
    },

    createSprites: function(width, height) {
        var surface = new Surface(width, height);
        var context = surface.context;
        context.strokeStyle = this.color;
        context.strokeRect(0, 0, width, height);

        var normalBg = new Sprite(width, height);
        normalBg.image = surface;
        this.addChild(normalBg);
        this.normalBg = normalBg;


        var surface = new Surface(width, height);
        var context = surface.context;
        context.fillStyle = this.color;
        context.fillRect(0, 0, width, height);

        var pushedBg = new Sprite(width, height);
        pushedBg.image = surface;
        this.pushedBg = pushedBg;


        var surface = new Surface(width, height);
        var context = surface.context;
        context.strokeStyle = this.color;
        context.setLineDash([6, 6]);
        context.strokeRect(0, 0, width, height);

        var disabledBg = new Sprite(width, height);
        disabledBg.image = surface;
        this.disabledBg = disabledBg;
    },

    setFont: function(font) {
        var normalLabel = this.normalLabel;
        var pushedLabel = this.pushedLabel;

        normalLabel.font = font;
        pushedLabel.font = font;

        normalLabel.y = (normalLabel.height / 2) - (normalLabel._boundHeight / 2);
        pushedLabel.y = (pushedLabel.height / 2) - (pushedLabel._boundHeight / 2);
    },

    setColor: function(color, pushedColor) {
        this.color = color;
        this.pushedColor = pushedColor;


    },

    setSize: function(w, h) {
        // TODO:
    },

    setEnabled: function(isEnabled) {
        if (isEnabled) {
            this.normalLabel.opacity = 1.0;
            this.addChild(this.normalBg);
            this.removeChild(this.disabledBg);
        } else {
            this.isPushWaiting = false;
            this.isCanceled = false;
            this.isFadeInEnd = false;
            this.normalLabel.tl.clear();
            this.normalLabel.opacity = 0.1;
            this.addChild(this.disabledBg);
            this.removeChild(this.normalBg);
        }
        this.isEnabled = isEnabled;
    },
});
