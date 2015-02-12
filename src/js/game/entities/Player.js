/*Phaser.Sprite = Class.extend({
    init: function () {
        //all the stuff
    }
});

var Entity = Phaser.Sprite.extend({
    init: function () {
        this._super();
        //other stuff
    }
});*/

/*(function () {

    var Player = function (game, x, y, rotateSpeed) {
        
    };

    Phaser.Sprite.prototype = {

        // Custom Player Object
        Player = function (game, x, y, rotateSpeed) {
            Phaser.sprite.call(this.game, x, y, 'frigate_02');
            this.rotateSpeed = rotateSpeed;
        };

        Player.prototype = Object.create(Phaser.Sprite.prototype);
        Player.prototype.constructor = Player;

        // Automatically called by World.update
        Player.prototype.update = function () {
            this.angle += this.rotateSpeed;
        };

    };
    module.exports = Player;
}).call(this);*/

/*(function () {

        var Player = function (game) {

        };

        Player = Phaser.Sprite.extend({
            init: function (game) {

            }
        });

        // Custom Player Object
        Player = function (game, x, y, rotateSpeed) {
            Phaser.sprite.call(this, game, x, y, 'frigate_02');
            this.rotateSpeed = rotateSpeed;
        };

        Player.prototype = Object.create(Phaser.Sprite.prototype);
        Player.prototype.constructor = Player;

        // Automatically called by World.update
        Player.prototype.update = function () {
            this.angle += this.rotateSpeed;
        };

    }; module.exports = Player;
}).call(this);*/