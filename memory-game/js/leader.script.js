// Leader Board
const leaderHeaderEle = document.querySelector('.leader-header');
const leaderContentEle = document.querySelector('.leader-content');

const leaderTableBodyEle = leaderContentEle.querySelector('.leader-table-body');

// display top 5 player score
const TOP_SCORES_PLAYER_COUNT = 5;

// toggle score card window
leaderHeaderEle.addEventListener('click', function () {
    leaderHeaderEle.parentElement.classList.toggle('open');
});

// leader board generator
function generateLeaderBoard() {
    if (checkLocalStorage) {
        players = JSON.parse(localStorage.getItem('players')) || [];
        if (players.length) {
            leaderContentEle.classList.remove('hide-head');

            const sortedPlayers = sortPlayersRecord();
            let recordsHTML = '';
            for (let i = 0; i < sortedPlayers.length && sortedPlayers.length <= TOP_SCORES_PLAYER_COUNT; i++) {
                recordsHTML = recordsHTML.concat(createRecordHTML(sortedPlayers[i]));
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

// sort the players on moves & time
function sortPlayersRecord() {
    return players.sort(function (a, b) {
        a.secs = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
        b.secs = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
        return a.moves - b.moves || a.secs - b.secs;
    });
}

// create record html 
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
