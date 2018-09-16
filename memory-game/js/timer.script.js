/**
 * Handling Time
 */

// time constants
let timer;
let timerInterval;
let timerCounter = false;

/**
 * @description Start time
 */
function startTimer() {
	timerCounter = true;

	// start time
	const startTime = new Date().getTime();

	timerInterval = setInterval(function () {

		// current time [play time]
		let currentTime = new Date().getTime();

		let difference = currentTime - startTime;

		let minutes = formatTimer(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
		let seconds = formatTimer(Math.floor((difference % (1000 * 60)) / 1000));

		timer = minutes + ':' + seconds;
		updateTimer(timer);

	}, 1000);
}

/**
 * @description Format time
 * @returns {number} time
 */
function formatTimer(value) {
	if (value < 10) {
		return '0' + value;
	} else {
		return value;
	}
}

/**
 * @description Clear time
 */
function clearTimer() {
	timerCounter = false;
	clearInterval(timerInterval);
	updateTimer('00:00')
}

/**
 * @description Update time
 */
function updateTimer(timer) {
	const timerCountEle = document.querySelector('.timer .timer-count');
	timerCountEle.textContent = timer;
}