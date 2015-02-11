// Custom Player Object
Player = function(game, x, y, rotateSpeed) {
    Phaser.sprite.call(this, game, x, y, 'frigate_02');
    this.rotateSpeed = rotateSpeed;
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Automatically called by World.update
Player.prototype.update = function(){
    this.angle += this.rotateSpeed;
}