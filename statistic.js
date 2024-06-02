
let numberPlayed = document.querySelector('.number-played');
let winPercentage = document.querySelector('.win-percentage')
let averageGuest = document.querySelector('.average-guest');
let bestScore = document.querySelector('.best-score');
// let distributedGuest = [0,0,0,0,0,0];
// let numberWin;

if(!localStorage.numberPlayed) {
	localStorage.setItem('numberPlayed', 0);
}

if(!localStorage.winPercentage) {
	localStorage.setItem('winPercentage', 0);
}

if(!localStorage.numberWin) {
	localStorage.setItem('numberWin', 0);
}

if(!localStorage.averageGuest) {
	localStorage.setItem('averageGuest', 0);
}

if(!localStorage.bestScore) {
	localStorage.setItem('bestScore', 0);
}

if(!localStorage.distributedGuest) {
	localStorage.setItem('distributedGuest', JSON.stringify([0,0,0,0,0,0]))
}


function updateStatistic() {
	numberPlayed.innerHTML = localStorage.numberPlayed+'x';
	winPercentage.innerHTML = localStorage.winPercentage;
	averageGuest.innerHTML = localStorage.averageGuest;
	bestScore.innerHTML = localStorage.bestScore;
	// myChart = new Chart(document.getElementById('myChart'),getConfig());
}

updateStatistic();
// numberWin = localStorage.numberWin;