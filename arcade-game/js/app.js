/**
/**
 * Arcade Game [Let's Play]
 * Creating enemy and player instances, render and update their positions
 * Maintaining player scores, levels and chances
 */

// CONSTANTS ------------------------------------------------------ //

// intial player level
var playerLevel = 1;
// number of player chances
var playerChances = 3;
// player mask
var playerMaskId = 'hornBoy';
// current score
var currentScore = 0;
// current score
var highestScore = 0;

// enemy instance holder array
var allEnemies = [];
// initial position coordinates of enemy
const enemyCoordinateX = -100;
const enemyCoordinateY = [60, 145, 230];
// speed levels of enemy
const enemySpeeds = [500, 600, 700, 800, 900, 1000];

// movement direction of player
const PLAYER_MOVE_UP = 'up';
const PLAYER_MOVE_DOWN = 'down';
const PLAYER_MOVE_LEFT = 'left';
const PLAYER_MOVE_RIGHT = 'right';
const GAME_RESET = 'space';

// movement shifters of player
const PLAYER_HORIZONTAL_SHIFTER = 100;
const PLAYER_VERTICAL_SHIFTER = 80;

// initial position coordinates of player
const playerCoordinateX = 200;
const playerCoordinateY = 380;

// wall boundaries
const WALL_X_LEFT = 0;
const WALL_X_RIGHT = 400;
const WALL_Y_TOP = 0;
const WALL_Y_BOTTOM = 380;

// HTML elements
const levelEle = document.querySelector('.level');
const chancesEle = document.querySelector('.chances');
const statusEle = document.querySelector('.status');
const currentScoreEle = document.querySelector('.current-score');
const highestScoreEle = document.querySelector('.highest-score');
const leaderPanel = document.querySelector('.right-panel');

// ENEMY ------------------------------------------------------------ //

/**
 * @description Function Expression of Enemy
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @param {number} a - acceleration
 */
var Enemy = function (x, y, a) {
    this.x = x; // x coordinate
    this.y = y; // y coordinate
    this.a = a; // a acceleration

    this.sprite = 'images/enemy-bug.png';
};

/**
 * @description Update method of Enemy
 * 1. Update enemy position
 * 2. Collision check of player and enemy
 * @param {number} dt -time delta between ticks
 */
Enemy.prototype.update = function (dt) {
    
    // multiply any movement by the dt parameter which will 
    // ensure the game runs at the same speed for all computers.
    this.x += this.a * dt;

    // update enemy postion when they going off canavs
    if (this.x > 600) {
        this.x = enemyCoordinateX;
        this.y = enemyCoordinateY[Math.floor(Math.random() * enemyCoordinateY.length)];
        this.a = 100 + Math.floor(Math.random() * enemySpeeds[playerLevel - 1]);
    }

    // collision check of enemy and player
    if (player.x < this.x + 60 && player.x + 40 > this.x && player.y < this.y + 30 && player.y + 30 > this.y) {
        // reset player coordinates
        player.x = playerCoordinateX;
        player.y = playerCoordinateY;
        
        // reduce player chances
        playerChances--;
        chancesEle.textContent = `Chances ${playerChances}`;

        // display status of game when player looses all chances
        if (!playerChances) {
            statusEle.textContent = 'Game Over';
            statusEle.classList.add('loose', 'animated', 'infinite', 'bounce');
            setTimeout(() => gameReset(), 3000);
        }

        // color effect of collision
        leaderPanel.classList.add('failure');
        setTimeout(() => leaderPanel.classList.remove('failure'), 1000);
    }
};

/**
 * @description Render method of Enemy to draw on screen
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// PLAYER --------------------------------------------------------- //

/**
 * @description Function Expression of Player
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 */
var Player = function (x, y) {
    this.x = x; // x coordinate
    this.y = y; // y coordinate

    this.sprite = 'images/char-boy.png';
}

/**
 * @description Update method of Player
 * 1. Player win condtion and reset its coordinates
 * 2. Updating the player chances and score
 */
Player.prototype.update = function () {

    // player win condtion
    if (this.y < WALL_Y_TOP) {
        // reset player coordinates
        this.x = playerCoordinateX;
        this.y = playerCoordinateY;

        // increment player level to make game hard for next level
        playerLevel++;

        // scores of player
        currentScore += 100;
        highestScore = currentScore > highestScore ? currentScore : highestScore;

        // display status of game when player win all levels
        if (playerLevel > 5) {
            playerLevel = 5;
            statusEle.textContent = 'Game Win';
            statusEle.classList.add('win', 'animated', 'infinite', 'bounce');
            setTimeout(() => gameReset(), 3000);
        }

        // updating leader panel
        levelEle.textContent = `Level ${playerLevel}`;
        currentScoreEle.textContent = currentScore;
        highestScoreEle.textContent = highestScore;

        // color effect of reach to water
        leaderPanel.classList.add('success');
        setTimeout(() => leaderPanel.classList.remove('success'), 1000);
    }
}

/**
 * @description Render method of Player to draw on screen
 */
Player.prototype.render = function () {
    var playerMaskImg = document.getElementById(playerMaskId);
    ctx.drawImage(playerMaskImg, this.x, this.y);
}

/**
 * @description Handle movement of player corresponding to key
 * 1. Update player position with vertical and horizontal shifts
 * 2. Prevent player from going out of canvas and reset game
 * @param {string} direction - direction of player it moves
 */
Player.prototype.handleInput = function (direction) {
    switch (direction) {
        case PLAYER_MOVE_UP: this.y > WALL_Y_TOP ? this.y -= PLAYER_VERTICAL_SHIFTER : this.y;
            break;
        case PLAYER_MOVE_DOWN: this.y < WALL_Y_BOTTOM ? this.y += PLAYER_VERTICAL_SHIFTER : this.y;
            break;
        case PLAYER_MOVE_LEFT: this.x > WALL_X_LEFT ? this.x -= PLAYER_HORIZONTAL_SHIFTER : this.x;
            break;
        case PLAYER_MOVE_RIGHT: this.x < WALL_X_RIGHT ? this.x += PLAYER_HORIZONTAL_SHIFTER : this.x;
            break;
        case GAME_RESET: gameReset();
            break;
    }
}

// player instance with default position
var player = new Player(playerCoordinateX, playerCoordinateY);

/**
 * @description Key event listener to direct player direction
 */
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: PLAYER_MOVE_LEFT,
        38: PLAYER_MOVE_UP,
        39: PLAYER_MOVE_RIGHT,
        40: PLAYER_MOVE_DOWN,
        32: GAME_RESET
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @description Create enemy instances with default position and speed 
 */
function createEnemy() {
    for (var i = 0; i < enemyCoordinateY.length; i++) {
        // enemy instances with default position and speed
        var enemy = new Enemy(
            enemyCoordinateX, // inital position
            enemyCoordinateY[Math.floor(Math.random() * enemyCoordinateY.length)], // enemy can be come from any position
            100 + Math.floor(Math.random() * enemySpeeds[playerLevel]) // speed of enemy depends on player level
        );
        // pushing all enemy instances
        allEnemies.push(enemy);
    }
}

/**
 * @description Create leader panel for displaying score, level & chances
 */
function createLeaderBoard() {
    levelEle.textContent = `Level ${playerLevel}`;
    chancesEle.textContent = `Chances ${playerChances}`;
    currentScoreEle.textContent = currentScore;
    highestScoreEle.textContent = highestScore;
    statusEle.textContent = '';
    statusEle.classList.remove('win', 'loose', 'animated', 'infinite', 'bounce');
}

/**
 * @description Choose player mask and update to canvas
 */
function choosePlayerMask() {
    const playerMasks = document.querySelectorAll('.images > img');
    playerMasks.forEach((mask) => {
		mask.addEventListener('click', () => {
            document.getElementsByClassName('selected')[0].classList.remove('selected');
            playerMaskId = mask.getAttribute('id');
            mask.classList.add('selected');
        });
	});
}

/**
 * @description Reset Game
 * Game is auto reset after Game Win or Loose and by hitting space key
 */
function gameReset() {
    allEnemies = [];

    // reset level, chances & score
    playerLevel = 1;
    playerChances = 3;
    currentScore = 0;

    // reset player coordinates
    player.x = playerCoordinateX;
    player.y = playerCoordinateY;

    createEnemy();
    createLeaderBoard();
}

/**
 * @description Initiate game by IIFE
 */
(function gameInit() {
    createEnemy();
    choosePlayerMask();
    createLeaderBoard();
})();
