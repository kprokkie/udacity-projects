// Modal Window
const startModal = document.getElementById('startModal');
const completeModal = document.getElementById('completeModal');

const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const continueGameBtn = document.getElementById('continueGame');
const newGameBtn = document.getElementById('newGame');

const modalInClasses = ['animated', 'zoomIn'];
const modalOutClasses = ['animated', 'zoomOut'];

let players = [];
let playerName = null;
let currentPlayerIndex = null;
let currentPlayer = null;

// load modal [default]
document.addEventListener('DOMContentLoaded', function () {
    loadModal(startModal);
});

// load modal
function loadModal(modal) {
    removeKeyEventListener();
    modal.style.display = 'block';
    modal.querySelector('.modal-content').classList.add(...modalInClasses);
}

// hide modal
function hideModal(modal) {
    addKeyEventListener();
    modal.querySelector('.modal-content').classList.remove(...modalInClasses);
    modal.querySelector('.modal-content').classList.add(...modalOutClasses);
    setTimeout(function () {
        modal.style.display = 'none';
        modal.querySelector('.modal-content').classList.remove(...modalOutClasses);
    }, 400);
}

// event listner to activate start game button
playerNameInput.addEventListener('keyup', function () {
    if (playerNameInput.value && playerNameInput.value.length) {
        playerName = playerNameInput.value;
        startGameBtn.classList.remove('disabled');
    } else {
        startGameBtn.classList.add('disabled');
    }
});

startGameBtn.addEventListener('click', function () {
    // set player name to game board
    document.querySelector('.player-name').textContent = playerName;
    hideModal(startModal);
    
});

continueGameBtn.addEventListener('click', function () {
    // reset game
    resetGame.click();
    hideModal(completeModal);
});

newGameBtn.addEventListener('click', function () {

    // reset player
    resetPlayer();
    // reset game
    resetGame.click();

    hideModal(completeModal);
    loadModal(startModal);
});

// reset player
function resetPlayer() {
    playerNameInput.value = '';
    document.querySelector('.player-name').textContent = '';

    playerName = null;
    currentPlayerIndex = null;
    currentPlayer = null;
}

// save data to local storage
function saveToLocalStorage() {
    if (checkLocalStorage()) {
        players = JSON.parse(localStorage.getItem('players')) || [];
        if (currentPlayerIndex) {
            for (const player of players) {
                if (player.index === currentPlayerIndex) {
                    player.moves = movesCount;
                    player.rating = starCount;
                    player.time = timer;
                    currentPlayer = player;
                }
            }
        } else {
            currentPlayerIndex = players.length + 1;
            let player = {
                name: playerName.toLowerCase(),
                moves: movesCount,
                time: timer,
                rating: starCount,
                index: players.length + 1
            }
            currentPlayer = player;
            players.push(player);
        }
        localStorage.setItem('players', JSON.stringify(players));
    } else {
        alert('No Local Storage Avaliable !');
    }
}

function genrateCompleteModal() {
    completeModal.querySelector('.winning-title').textContent = currentPlayer.name.toUpperCase();
    completeModal.querySelector('.winning-stats').textContent = `With ${currentPlayer.moves} and ${currentPlayer.rating} Stars in ${currentPlayer.time}`
}

function savePlayerStats() {
    saveToLocalStorage();
    genrateCompleteModal();
    generateLeaderBoard();
    loadModal(completeModal);
}

// check local storage
function checkLocalStorage() {
    if (typeof (Storage) !== 'undefined') {
        return true;
    } else {
        alert('Sorry !! Local Storage not available.');
        return false;
    }
}
