/**
 * Leader Board
 */

// leader constant
const leaderBoardEle = document.querySelector('.leader-board');
const leaderHeaderEle = leaderBoardEle.querySelector('.leader-header');
const leaderContentEle = leaderBoardEle.querySelector('.leader-content');

const leaderTableBodyEle = leaderContentEle.querySelector('.leader-table-body');

// display top 5 player score
const TOP_SCORES_PLAYER_COUNT = 5;

/**
 * @description Adding click event listner to toggle board
 */
leaderHeaderEle.addEventListener('click', () => {
	leaderHeaderEle.parentElement.classList.toggle('open');
});

/**
 * @description Generate leader board
 */
function generateLeaderBoard() {
	if (checkLocalStorage) {
		// fetch players from local storage
		players = JSON.parse(localStorage.getItem('players')) || [];
		if (players.length) {
			leaderContentEle.classList.remove('hide-head');

			const sortedPlayers = sortPlayersRecord().slice(0, TOP_SCORES_PLAYER_COUNT);
			let recordsHTML = '';
			for (let i = 0; i < sortedPlayers.length; i++) {
				recordsHTML += createRecordHTML(sortedPlayers[i]);
			}
			leaderTableBodyEle.innerHTML = recordsHTML;
		} else {
			leaderContentEle.classList.add('hide-head');

			let noRecordsHTML = `<div class="no-records-msg">
                                    <span>No Records Available Yet !</span>
                                </div>`;
			leaderTableBodyEle.innerHTML = noRecordsHTML;
		}
	}
}

/**
 * @description Sort the players on moves & time
 * @returns {Array} sorted players
 */
function sortPlayersRecord() {
	return players.sort(function (a, b) {
		a.secs = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
		b.secs = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
		return a.moves - b.moves || a.secs - b.secs;
	});
}

/**
 * @description Create record html
 * @returns {string} html string
 */
function createRecordHTML(player) {
	const recordHTML = `<div class="record-item">
                            <div class="record-name">
                                <span>${player.name}</span>
                                <i class="fa ${player.index === currentPlayerIndex ? 'fa-circle' : ''}"></i>
                            </div>
                            <div class="record-moves">
                                <span>${player.moves}</span>
                            </div>
                            <div class="record-time">
                                <span>${player.time}</span>
                            </div>
                            <div class="record-rating">
                                <span>${player.rating}</span>
                            </div>
                        </div>`;
	return recordHTML;
}