// some constants
const BLOCK_WIDTH = 101;
const BLOCK_HEIGHT = 82;
const BUG_Y_OFFSET = 102;
const MAX_BUG_X = BLOCK_WIDTH * 6;
const PLAYER_MIN_X = BLOCK_WIDTH * 0.5;
const PLAYER_MAX_X = BLOCK_WIDTH * 4.5;
const PLAYER_Y_OFFSET = 95;
const PLAYER_MIN_Y = BLOCK_HEIGHT - PLAYER_Y_OFFSET;
const PLAYER_START_ROW = 6;
const PLAYER_START_COLUMN = 3;
const PLAYER_FINISH_ROW = 1;
const NUM_ROWS = 6;
const NUM_COLUMNS = 5;
const BUG_SPEED_SCALE = 500;
const BUG_SPEED_MIN = 100;
const BUG_ROW_MIN = 2;
const BUG_ROW_MAX = 4;
const COLLISION_DIST = 70;
const FINISH_TIME = 0.5;

// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    //initialize the enemy by calling reset function
    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + (BUG_SPEED_MIN + this.speed * BUG_SPEED_SCALE ) * dt;
    // when we reach the end of the board, reset the bug's x position
    if (this.x > MAX_BUG_X) {
        this.reset();
    }
};

// Reset the bug's position and choose a new row and a different speed
Enemy.prototype.reset = function() {
    // speed is a random value between 0 and 1
    this.speed = Math.random();
    // start the bug off screen one block width to the left of the board
    this.x = -BLOCK_WIDTH;
    // choose a random row between BUG_ROW_MIN and BUG_ROW_MAX
    this.row = BUG_ROW_MIN + Math.floor(Math.random() * (BUG_ROW_MAX - BUG_ROW_MIN + 1));
    this.y = this.row * BLOCK_HEIGHT - BUG_Y_OFFSET;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player is the character that the user moves around with the arrow keys
var Player = function() {
    this.sprite = 'images/char-boy.png';
    // initialize the player by calling reset function
    this.reset();
};

Player.prototype.update = function(dt) {
    //check to see if player has made it to the top row
    if (this.row === PLAYER_FINISH_ROW) {
        this.finishTime = this.finishTime + dt;
        //if they have been at the top row for more than .5sec reset
        if (this.finishTime > FINISH_TIME) {
            this.reset();
        }
    }
    //check for collision with each enemy, reset if there is one
    for (i = 0; i < allEnemies.length; i++) {
        // collision happens when we are on the same row as an enemy
        // and we are within some distance of the enemy in the x direction
        if (this.row === allEnemies[i].row &&
            Math.abs(this.x - allEnemies[i].x) < COLLISION_DIST) {
            this.reset();
        }
    }
};

Player.prototype.reset = function() {
    // player resets to the pre-defined row and column on the board every time
    this.row = PLAYER_START_ROW;
    this.column = PLAYER_START_COLUMN;
    this.x = (this.column - 1) * BLOCK_WIDTH;
    this.y = this.row * BLOCK_HEIGHT - PLAYER_Y_OFFSET;
    // keep a timer to figure out when to reset the player's position after winning
    this.finishTime = 0;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handle keyboard inputs, check to make sure player stays on the board
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
        if (this.column > 1) {
            this.column = this.column - 1;
            this.x = this.x - BLOCK_WIDTH;
        }
        break;
        case 'up':
        if (this.row > 1) {
            this.row = this.row - 1;
            this.y = this.y - BLOCK_HEIGHT;
        }
        break;
        case 'right':
        if (this.column < NUM_COLUMNS) {
            this.column = this.column + 1;
            this.x = this.x + BLOCK_WIDTH;
        }
        break;
        case 'down':
        if (this.row < NUM_ROWS) {
            this.row = this.row + 1;
            this.y = this.y + BLOCK_HEIGHT;
        }
        break;
    }
};

var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
