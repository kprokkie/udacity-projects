/**
 * Handles game by key events
 */

// key codes [used to play game by Key]
const LEFT_KEY = 37; // moves left
const UP_KEY = 38; // moves upwards
const RIGHT_KEY = 39; // moves right
const DOWN_KEY = 40; // moves down
const TAB_KEY = 9; // moves right [normal tab behaviour]
const ENTER_KEY = 13; // flip card
const SPACE_KEY = 32; // reset game

// index comparers & shifters
const MIN_COUNT = 1;
const MAX_COUNT = 16;
const HORIZONTAL_SHIFTER = 1;
const VERTICAL_SHIFTER = 4;

/**
 * @description Adding key event listener on document
 */
function addKeyEventListener() {
	document.addEventListener('keydown', function (e) {
		handleKeyEvent(e);
	});
}

/**
 * @description Handle key events & filter those keys only which required to play game
 * @param {Event} e - Event raised by key
 */
function handleKeyEvent(e) {
	// handling only TAB, ENTER & ARROW keys to play game
	if ([LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY, TAB_KEY, ENTER_KEY, SPACE_KEY].includes(e.keyCode)) {
		const focusCard = cardDeck.querySelector('.card-item:focus');
		if (focusCard) {
			const currIndex = +focusCard.attributes.tabindex.value;
			cardAction(e, currIndex, focusCard);
		} else {
			// default focus when any key game key (arrow) hit
			if (![ENTER_KEY, SPACE_KEY].includes(e.keyCode)) {
				cardAction(e, 0);
			}
		}
	}
}

/**
 * @description Calculate index to shift focus on card or flip card or reset game
 * @param {Event} e - Event raised by key
 * @param {number} index - Current focused index
 * @param {Element} card - Current focussed card element
 */
function cardAction(e, index, card) {
	e.preventDefault();
	if (index) {
		switch (e.keyCode) {
			case TAB_KEY:
				index === MAX_COUNT ? index = MIN_COUNT : index = index + HORIZONTAL_SHIFTER;
				break;
			case RIGHT_KEY:
				index = index + HORIZONTAL_SHIFTER;
				break;
			case LEFT_KEY:
				index = index - HORIZONTAL_SHIFTER;
				break;
			case UP_KEY:
				index = index - VERTICAL_SHIFTER;
				break;
			case DOWN_KEY:
				index = index + VERTICAL_SHIFTER;
				break;
			case ENTER_KEY:
				card.click(); // flip card
				break;
			case SPACE_KEY:
				resetBtn.click(); // reset game
			default:
				break;
		}
	} else {
		// default focus when any key game key (arrow) hit
		index++;
	}

	// DONT: navigate when ENTER is hit i.e. is for only for arrow
	if (e.keyCode !== ENTER_KEY) {
		index = e.keyCode === SPACE_KEY ? 1 : index;
		shiftCardFocus(index);
	}
}

/**
 * @description Shift focus to another card based on arrow key selection
 * @param {number} index - Index of card on which focus have to shift
 */
function shiftCardFocus(index) {
	if (MIN_COUNT <= index && index <= MAX_COUNT) {
		cardDeck.querySelector(`[tabindex="${index}"]`).focus();
	}
}