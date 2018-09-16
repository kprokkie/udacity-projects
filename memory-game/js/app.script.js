/**
 * Matching Game [Let's Play]
 * Creating Cards & Compare
 */

// matching pairs
const MATCH_PAIR = 8;

// flipped card array to hold flipped cards
let flippedCards = [];

// list of icons displayed over cards
const cardIcons = [
	'umbrella', 'umbrella',
	'tree', 'tree',
	'magnet', 'magnet',
	'paper-plane', 'paper-plane',
	'futbol-o', 'futbol-o',
	'subway', 'subway',
	'star', 'star',
	'diamond', 'diamond'
];

// trigger class for animate match & mis-match & flipped
const matchClasses = ['success', 'animated', 'rubberBand'];
const mismatchClasses = ['warning', 'animated', 'wobble'];
const clearClasses = ['flipped', 'matched'];

// deck [holding cards]
const cardDeck = document.querySelector('.card-deck');

// stats [holding game stats]
const gameStats = document.querySelector('.game-stats');

// moves count
let movesCount = 0;
const movesCountEle = gameStats.querySelector('.moves .moves-count');

// star count
const starCountEle = gameStats.querySelector('.star-count');

// match count
const matchCountEle = gameStats.querySelector('.matches .matches-count');

// reset game button
const resetBtn = gameStats.querySelector('.restart');

/**
 * @description Shuffle array items
 * @param {Array} arr - original array
 * @returns {Array} shuffled array
 */
function shuffleArr(arr) {
	for (let i = 0; i < arr.length; i++) {
		const index = Math.floor(Math.random() * arr.length);
		// applying swap two values concept
		const temp = arr[i];
		arr[i] = arr[index];
		arr[index] = temp;
	}
	return arr;
}

/**
 * @description Create cards HTML from shuffle icons & append to deck [page]
 */
function createCards() {
	// NO shuffle -- DEV MODE
	// const shuffledIcons = cardIcons; 
	const shuffledIcons = shuffleArr(cardIcons);
	let cardsHTML = '';
	shuffledIcons.forEach((icon, index) => {
		cardsHTML += createCardHTML(icon, index);
	});
	cardDeck.innerHTML = cardsHTML;
}

/**
 * @description Create card HTML from icon
 * @param {string} icon - Displayed on card
 * @param {number} index - sequence order or tab index to fire key events
 * @returns {string} card html
 */
function createCardHTML(icon, index) {
	const cardHTML = `<div class="card-item" tabindex="${index + 1}">
                        <div class="card-holder">
                            <div class="front"></div>
                            <div class="back">
                                <i class="fa fa-${icon}"></i>
                            </div>
                        </div>
                    </div>`;
	return cardHTML;
}

// holding all cards from deck
let cards = [];

/**
 * @description Adding click event listener on cards
 */
function addCardClickListener() {
	cards = cardDeck.querySelectorAll('.card-item');
	cards.forEach((card) => {
		card.addEventListener('click', () => handleCard(card));
	});
}

/**
 * @description Handle card click event listener
 * @param {HTMLElement} card - card to be clicked
 */
function handleCard(card) {
	// flip card
	flipCard(card);
	if (!timerCounter) {
		// start time when game started [only when first card click]
		startTimer();
	}
}

/**
 * @description Flip the card & hold the card
 * @param {HTMLElement} card - flipped card
 */
function flipCard(card) {
	if (!card.classList.contains('flipped') && !card.classList.contains('matched') && flippedCards.length < 2) {
		flippedCards.push(card);
		card.classList.add('flipped');
		checkFlippedCard(card);
	}
}

/**
 * @description Check for two flipped card to compare
 */
function checkFlippedCard() {
	if (flippedCards.length === 2) {
		setTimeout(() => {
			updateDeckStats();
			// compare both flipped cards
			compareFlippedCard(flippedCards[0], flippedCards[1]);
		}, 400);
	}
}

/**
 * @description Update deck stats moves count and start count
 */
function updateDeckStats() {
	updateMovesCount(++movesCount);
	updateStarCount();
}

/**
 * @description Compare flipped cards
 * @param {HTMLElement} card1 - First flipped card to compare
 * @param {HTMLElement} card2 - Second flipped card to compare
 */
function compareFlippedCard(card1, card2) {
	// compare HTML nodes
	if (card1.querySelector('i').isEqualNode(card2.querySelector('i'))) {
		cardMatch(card1, card2);
	} else {
		cardMisMatch(card1, card2);
	}
}

/**
 * @description Card match success
 * @param {HTMLElement} card1 - First flipped card to animate success
 * @param {HTMLElement} card2 - Second flipped card to animate success
 */
function cardMatch(card1, card2) {

	animateSuccess(card1);
	animateSuccess(card2);

	clearFlippedCards();
	updateMatchCount();
}

/**
 * @description Animate card on match success
 * @param {HTMLElement} card - flipped card to animate success
 */
function animateSuccess(card) {
	card.classList.add('matched');
	card.classList.remove('flipped');
	card.classList.add(...matchClasses);
	setTimeout(() => {
		card.classList.remove(...matchClasses);
	}, 1000);
}

/**
 * @description Card match failure
 * @param {HTMLElement} card1 - First flipped card to animate failure
 * @param {HTMLElement} card2 - Second flipped card to animate failure
 */
function cardMisMatch(card1, card2) {

	animateFailure(card1);
	animateFailure(card2);

	clearFlippedCards();
}

/**
 * @description Animate card on match failure
 * @param {HTMLElement} card - flipped card to animate failure
 */
function animateFailure(card) {
	card.classList.add(...mismatchClasses);
	setTimeout(() => {
		card.classList.remove('flipped');
		setTimeout(() => {
			card.classList.remove(...mismatchClasses);
		}, 400);
	}, 1000);
}

/**
 * @description Update moves count
 */
function updateMovesCount(count = 0) {
	movesCount = count;
	movesCountEle.textContent = movesCount;
}

/**
 * @description Update star count
 * 3 star for <= 10 moves
 * 2 star for <= 20 moves
 * 1 star for more than 20 moves
 */
function updateStarCount() {

	// move check to draw stars
	if (movesCount <= 10) starCount = 3;
	else if (movesCount <= 20) starCount = 2;
	else starCount = 1;

	let starsHTML = '';
	for (let i = 0; i < 3; i++) {
		const starEle = document.createElement('i');
		starEle.classList.add('fa');
		if (i < starCount) {
			starEle.classList.add('fa-star');
		} else {
			starEle.classList.add('fa-star-o');
		}
		starsHTML += starEle.outerHTML;
	}
	starCountEle.innerHTML = starsHTML;
}

/**
 * @description Update match count
 */
function updateMatchCount() {
	const matchedCards = cardDeck.querySelectorAll('.card-item.matched');
	matchCountEle.textContent = matchedCards.length / 2;

	// after all match stop timer & save player stats
	if (matchedCards.length / 2 === MATCH_PAIR) {
		clearInterval(timerInterval); // timer <script>
		savePlayerStats(); // modal <script>
	}
}

/**
 * @description Flip back all cards before clearing to improve user experience
 */
function flipCardBack() {
	for (const card of cards) {
		card.classList.remove(...clearClasses, ...matchClasses);
	}
}

/**
 * @description Destroy existing card for reset
 */
function destroyCards() {
	cardDeck.innerHTML = '';
}

/**
 * @description Clear both holded flipped cards
 */
function clearFlippedCards() {
	flippedCards = [];
}

/**
 * @description Adding click event listener to reset game
 */
resetBtn.addEventListener('click', resetGame);

/**
 * @description Holding functions to reset game
 */
function resetGame() {
	flipCardBack();
	setTimeout(() => {
		destroyCards();
		createCards();
		addCardClickListener();

		clearTimer(); // timer <script>
		updateMovesCount();
		updateMatchCount();
		updateStarCount();

		clearFlippedCards();
	}, 400);
}

/**
 * @description Holding functions to initialize game
 */
function initGame() {
	// capture user info
	loadModal(startModal); // modal <script>

	createCards();
	addCardClickListener();

	addKeyEventListener(); // control <script>

	clearTimer(); // timer <script>
	updateMovesCount();
	updateMatchCount();
	updateStarCount();

	generateLeaderBoard(); // leader <script>
}

// initialize game [Let's Play]
initGame();