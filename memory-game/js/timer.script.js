let timer;
let timerInterval;
let timerCounter = false;

function startTimer() {
    timerCounter = true;

    const startTime = new Date().getTime();

    timerInterval = setInterval(function () {
        let currentTime = new Date().getTime();

        let difference = currentTime - startTime;

        let minutes = formatTimer(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
        let seconds = formatTimer(Math.floor((difference % (1000 * 60)) / 1000));

        timer = minutes + ':' + seconds;
        updateTimer(timer);

    }, 1000);
}

function formatTimer(value) {
    if (value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

function clearTimer() {
    timerCounter = false;
    clearInterval(timerInterval);
    updateTimer('00:00')
}

function updateTimer(timer) {
    const timerCountEle = document.querySelector('.timer .timer-count');
    timerCountEle.textContent = timer;
}
