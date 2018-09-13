// flipped card array to hold flipped cards
let flippedCards = [];

// flag for comparing of cards in process, 
// so, that in mean time other cards aren't able to click
let isComparing = false;

// moves count
let movesCount = 0;
const movesCountEle = document.querySelector('.moves .moves-count');

// star count
const starCountEle = document.querySelector('.star-count');

// match count
const matchCountEle = document.querySelector('.matches .matches-count');

// trigger class for animate match & mis-match & flipped
const matchClasses = ['success', 'animated', 'rubberBand'];
const mismatchClasses = ['warning', 'animated', 'wobble'];
const clearClasses = ['flipped', 'matched'];

// get the cards
let cards = document.querySelectorAll('.card-item');
for (const card of cards) {
    // add event listener
    card.addEventListener('click', function () {
        if (!isComparing) {
            flipCard(card);
        }
        if (!timerCounter) {
            // start time when game started
            // it means when 1st card clicked
            startTimer();
        }
    });
}

// flip the card
function flipCard(card) {
    if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        holdFlippedCard(card);
    }
}

// hold flipped card
function holdFlippedCard(card) {
    if (!flippedCards.length) {
        flippedCards.push(card);
    } else {
        isComparing = true;
        movesCount++;
        updateMovesCount();
        updateStarCount();
        let existCard = flippedCards[0];
        setTimeout(function () {
            compareFlippedCard(card, existCard);
        }, 500);
    }
}

// compare flipped cards
function compareFlippedCard(card, existCard) {
    if (card.querySelector('i').isEqualNode(existCard.querySelector('i'))) {
        cardMatch(card, existCard);
    } else {
        cardMisMatch(card, existCard);
    }
}

// card matches
function cardMatch(card, existCard) {

    animateSuccess(card);
    animateSuccess(existCard);

    clearFlippedCards();
    updateMatchCount();
}

function animateSuccess(card) {
    card.classList.add('matched');
    card.classList.remove('flipped');
    card.classList.add(...matchClasses);
    setTimeout(function () {
        card.classList.remove(...matchClasses);
    }, 1000);
}

// card mismatches
function cardMisMatch(card, existCard) {
    animateFailure(card);
    animateFailure(existCard);
    clearFlippedCards();
}

function animateFailure(card) {
    card.classList.add(...mismatchClasses);
    setTimeout(function () {
        card.classList.remove('flipped');
        setTimeout(function () {
            card.classList.remove(...mismatchClasses);
        }, 400);
    }, 1000);
}

// clear flipped cards array after comparing
function clearFlippedCards() {
    flippedCards = [];
    isComparing = false;
}

function updateMovesCount() {
    movesCountEle.textContent = movesCount;
}

function updateStarCount() {
    if (movesCount < 10) starCount = 3;
    else if (movesCount < 15) starCount = 2;
    else starCount = 1;

    // clear previous added div
    starCountEle.removeChild(starCountEle.firstElementChild);
    // create new div to hold stars
    const divEle = document.createElement('div');
    for (let i = 0; i < 3; i++) {
        const starEle = document.createElement('i');
        starEle.classList.add('fa');
        if (i < starCount) {
            starEle.classList.add('fa-star');
        } else {
            starEle.classList.add('fa-star-o');
        }
        divEle.appendChild(starEle);
    }
    starCountEle.appendChild(divEle);
}

function updateMatchCount() {
    let matchedCards = document.querySelectorAll('.card-item.matched');
    matchCountEle.textContent = matchedCards.length / 2;

    // pause timer
    if (matchedCards.length / 2 === 8) {
        clearInterval(timerInterval);
        savePlayerStats();
    }
}

// reset game or reset game
const resetGame = document.querySelector('.restart');
resetGame.addEventListener('click', function () {
    for (const card of cards) {
        card.classList.remove(...clearClasses, ...matchClasses);
    }
    movesCount = 0;
    clearFlippedCards();
    clearTimer();
    updateMovesCount();
    updateMatchCount();
    updateStarCount();

});

function initGame() {
    updateMovesCount();
    updateMatchCount();
    updateStarCount();
    clearTimer();
    generateLeaderBoard();
}

initGame();