/**
 * Handling & Displaying Modal
 */

// modal constants
const startModal = document.getElementById('startModal');
const completeModal = document.getElementById('completeModal');
const gameInfoModal = document.getElementById('gameInfoModal');
const keyInfoModal = document.getElementById('keyInfoModal');

// button contants
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const continueGameBtn = document.getElementById('continueGame');
const newGameBtn = document.getElementById('newGame');
const closeKeyModalBtn = document.getElementById('closeKeyModalBtn');
const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');


// info btn
const gameInfoBtn = document.querySelector('.instruct-info .fa-info-circle');
const keyInfoBtn = document.querySelector('.instruct-info .fa-keyboard-o');

// animated classed for modal
const modalInClasses = ['animated', 'zoomIn'];
const modalOutClasses = ['animated', 'zoomOut'];

// player variables
let players = [];
let playerName = null;
let currentPlayerIndex = null;
let currentPlayer = null;

/**
 * @description Load modal 
 * @param {HTMLElement} modal - modal to be loaded
 */
function loadModal(modal) {
	modal.style.display = 'block';
	modal.querySelector('.modal-content').classList.add(...modalInClasses);
}

/**
 * @description Hide modal
 * @param {HTMLElement} modal - modal to be closed
 */
function hideModal(modal) {
	modal.querySelector('.modal-content').classList.remove(...modalInClasses);
	modal.querySelector('.modal-content').classList.add(...modalOutClasses);
	setTimeout(() => {
		modal.style.display = 'none';
		modal.querySelector('.modal-content').classList.remove(...modalOutClasses);
	}, 400);
}

/**
 * @description Event listerner to activate start game for valid user
 */
playerNameInput.addEventListener('keyup', () => {
	if (playerNameInput.value && playerNameInput.value.length) {
		playerName = playerNameInput.value;
		startGameBtn.classList.remove('disabled');
	} else {
		startGameBtn.classList.add('disabled');
	}
});

/**
 * @description Adding click event listener to game info button
 */
gameInfoBtn.addEventListener('click', () => {
	loadModal(gameInfoModal)
});

/**
 * @description Adding click event listener on key info button
 */
keyInfoBtn.addEventListener('click', () => {
	loadModal(keyInfoModal)
});

/**
 * @description Adding click event listener on close button of info modal
 */
closeInfoModalBtn.addEventListener('click', () => {
	hideModal(gameInfoModal)
});

/**
 * @description Adding click event listener on close button of key modal
 */
closeKeyModalBtn.addEventListener('click', () => {
	hideModal(keyInfoModal)
});

/**
 * @description Adding click event listener on start game button
 */
startGameBtn.addEventListener('click', () => {
	// set player name to game board
	document.querySelector('.player-name').textContent = playerName;
	hideModal(startModal);

});

/**
 * @description Adding click event listener on continue game button
 * reset game
 */
continueGameBtn.addEventListener('click', () => {
	// reset game
	resetBtn.click(); // app <script>
	hideModal(completeModal);
});

/**
 * @description Adding click event listener on new game button
 * reset game & player
 */
newGameBtn.addEventListener('click', () => {
	// reset player
	resetPlayer();
	// reset game
	resetBtn.click(); // app <script>

	hideModal(completeModal);
	loadModal(startModal);
});

/**
 * @description Reset player fields
 */
function resetPlayer() {
	playerNameInput.value = '';
	document.querySelector('.player-name').textContent = '';

	playerName = null;
	currentPlayerIndex = null;
	currentPlayer = null;
}

/**
 * @description Save player & its records to local storage
 */
function saveToLocalStorage() {
	if (checkLocalStorage()) {
		// fetch from local storage
		players = JSON.parse(localStorage.getItem('players')) || [];
		if (currentPlayerIndex) {
			for (const player of players) {
				// update player records of currently player [when player choses continue]
				if (player.index === currentPlayerIndex) {
					player.moves = movesCount;
					player.rating = starCount;
					player.time = timer;
					currentPlayer = player;
				}
			}
		} else {
			// create new player
			currentPlayerIndex = players.length + 1;
			let player = {
				name: playerName.toLowerCase(),
				moves: movesCount,
				time: timer,
				rating: starCount,
				index: players.length + 1
			}
			currentPlayer = player;
			// push to player list
			players.push(player);
		}
		// set to local storage
		localStorage.setItem('players', JSON.stringify(players));
	}
}

/**
 * @description Check local storage
 * @return {boolean}
 */
function checkLocalStorage() {
	if (typeof (Storage) !== 'undefined') {
		return true;
	} else {
		alert('Sorry !! Local Storage not available.');
		// hide leader board if local storage not exist
		leaderBoardEle.classList.add('hide'); // leader <script>
		return false;
	}
}

/**
 * @description Generate complete modal with winning stats
 */
function genrateCompleteModal() {
	completeModal.querySelector('.winning-title').innerHTML = currentPlayer.name.toUpperCase();
	completeModal.querySelector('.winning-stats').innerHTML = `With <strong>${currentPlayer.moves}</strong> and <strong>${currentPlayer.rating}</strong> Stars in <strong>${currentPlayer.time}<strong>`;
}

/**
 * @description Generate and load complete modal
 */
function savePlayerStats() {
	saveToLocalStorage();
	genrateCompleteModal();
	generateLeaderBoard(); // leader <script>
	loadModal(completeModal);
}